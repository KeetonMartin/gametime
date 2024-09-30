import requests
import time
import json
from collections import defaultdict

# --- Configuration ---
CURRENT_LEAGUE_ID = "1183849444265443328"
SEASONS_TO_PROCESS = 3 # Number of *past* completed seasons
INITIAL_FAAB_SEASON_1 = 1000 # *** ASSUMPTION: Starting FAAB for the very first season ***
ANNUAL_FAAB_ADDITION = 250
FAAB_CAP = 1000
API_BASE_URL = "https://api.sleeper.app/v1"
# Add a small delay to be kind to the API
SLEEP_INTERVAL = 0.5

# --- Helper Functions ---
def fetch_sleeper_data(url):
    """Fetches data from the Sleeper API, handles basic errors."""
    try:
        response = requests.get(url)
        response.raise_for_status() # Raise an exception for bad status codes (4xx or 5xx)
        # Handle potential 404 specifically if needed, though raise_for_status covers it
        if response.status_code == 404:
            print(f"Warning: Data not found at {url}")
            return None
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching {url}: {e}")
        return None
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON from {url}: {e}")
        return None

# --- Main Logic ---
def calculate_faab_history(current_league_id):
    """Calculates starting FAAB for the current season based on history."""

    print(f"Starting FAAB calculation for league history ending with {current_league_id}")

    historical_league_ids = []
    temp_league_id = current_league_id

    # 1. Trace back league history
    print(f"Tracing back {SEASONS_TO_PROCESS} seasons...")
    for i in range(SEASONS_TO_PROCESS + 1): # Need one extra step to get the ID of season 1
        if not temp_league_id:
            print(f"Warning: Found null previous_league_id after {len(historical_league_ids)} seasons.")
            break

        print(f"Fetching details for league: {temp_league_id}")
        league_details = fetch_sleeper_data(f"{API_BASE_URL}/league/{temp_league_id}")
        time.sleep(SLEEP_INTERVAL)

        if not league_details:
            print(f"Error: Could not fetch details for league {temp_league_id}. Aborting.")
            return None

        # Store the ID we just fetched details for (except the current one)
        if i > 0:
            historical_league_ids.append(temp_league_id)

        previous_id = league_details.get("previous_league_id")
        print(f"  -> Found previous_league_id: {previous_id}")
        temp_league_id = previous_id

        # Break if we have enough seasons or no more history
        if len(historical_league_ids) == SEASONS_TO_PROCESS or not previous_id:
             # If we stopped because we have enough seasons, but didn't get the *last* previous_id
             # add it now if it exists (this is the ID for Season 1)
             if previous_id and len(historical_league_ids) < SEASONS_TO_PROCESS:
                 print(f"Warning: Only found {len(historical_league_ids)} previous seasons, expected {SEASONS_TO_PROCESS}.")
             elif previous_id and len(historical_league_ids) == SEASONS_TO_PROCESS:
                  historical_league_ids.append(previous_id) # Add the ID for Season 1
             break


    if len(historical_league_ids) < SEASONS_TO_PROCESS:
         print(f"Error: Could only trace back {len(historical_league_ids)} seasons. Cannot complete calculation for {SEASONS_TO_PROCESS} seasons.")
         # If you want to proceed with fewer seasons, adjust logic here.
         # For now, we exit.
         return None

    # Reverse to process chronologically (Season 1, Season 2, Season 3)
    historical_league_ids.reverse()
    print(f"\nProcessing seasons in order: {historical_league_ids}")

    faab_balances = defaultdict(int) # {owner_id: faab_amount}

    # 2. Process each historical season
    for season_index, league_id in enumerate(historical_league_ids):
        season_number = season_index + 1
        print(f"\n--- Processing Season {season_number} (League ID: {league_id}) ---")

        # Apply pre-season FAAB addition (except for Season 1)
        print("\nApplying annual FAAB addition (if applicable)...")
        if season_number > 1:
            for owner_id in list(faab_balances.keys()): # Iterate over keys copy
                start_of_season_bal = faab_balances[owner_id]
                faab_balances[owner_id] = min(faab_balances[owner_id] + ANNUAL_FAAB_ADDITION, FAAB_CAP)
                print(f"  Owner {owner_id}: End of Season {season_number-1} FAAB = {start_of_season_bal}")
                print(f"  Owner {owner_id}: Start of Season {season_number} FAAB (after +{ANNUAL_FAAB_ADDITION}, capped at {FAAB_CAP}) = {faab_balances[owner_id]}")
        else:
             print("  (Skipping for Season 1)")

        # Fetch rosters for the season
        print(f"\nFetching rosters for league {league_id}...")
        rosters = fetch_sleeper_data(f"{API_BASE_URL}/league/{league_id}/rosters")
        time.sleep(SLEEP_INTERVAL)

        if not rosters:
            print(f"Error: Could not fetch rosters for league {league_id}. Skipping season.")
            continue

        # Process spending for each roster
        print("Calculating spending for the season...")
        for roster in rosters:
            owner_id = roster.get("owner_id")
            roster_id = roster.get("roster_id")
            settings = roster.get("settings", {})
            # Handle potential negative budget used (seen in API examples)
            faab_used = settings.get("waiver_budget_used", 0) or 0 # Ensure it's not None

            if not owner_id:
                print(f"Warning: Roster {roster_id} in league {league_id} has no owner_id. Skipping.")
                continue

            # Initialize FAAB for Season 1 if owner not seen before
            if season_number == 1 and owner_id not in faab_balances:
                faab_balances[owner_id] = INITIAL_FAAB_SEASON_1
                print(f"  Owner {owner_id}: Initialized Season 1 FAAB = {faab_balances[owner_id]}")

            # Apply spending
            if owner_id in faab_balances:
                 balance_before_spending = faab_balances[owner_id]
                 faab_balances[owner_id] = max(0, balance_before_spending - faab_used)
                 print(f"  Owner {owner_id} (Roster {roster_id}): Spent {faab_used}. End of Season {season_number} FAAB = {faab_balances[owner_id]} (was {balance_before_spending} before spending)")
            else:
                 # Initialize new owner
                 if season_number == 1:
                     # Should not happen if rosters are fetched correctly, but as fallback:
                     print(f"Warning: Owner {owner_id} found in season {season_number} but not initialized. Initializing with {INITIAL_FAAB_SEASON_1}.")
                     balance_before_spending = INITIAL_FAAB_SEASON_1
                 else:
                     # Assume new owner starts season with the annual addition amount
                     print(f"Warning: Owner {owner_id} found in season {season_number} but not initialized. Assuming they start with {ANNUAL_FAAB_ADDITION} FAAB for this season.")
                     balance_before_spending = ANNUAL_FAAB_ADDITION

                 # Calculate end-of-season balance, ensuring it doesn't drop below 0
                 faab_balances[owner_id] = max(0, balance_before_spending - faab_used)
                 print(f"  Owner {owner_id} (Roster {roster_id}): Spent {faab_used}. End of Season {season_number} FAAB = {faab_balances[owner_id]} (was {balance_before_spending} before spending)")


    # 3. Apply final FAAB addition for the start of the *current* season (Season 4)
    current_season_number = SEASONS_TO_PROCESS + 1
    print(f"\n--- Calculating Starting FAAB for Current Season ({current_season_number}) ---")
    for owner_id in list(faab_balances.keys()):
        end_of_last_season_bal = faab_balances[owner_id]
        faab_balances[owner_id] = min(faab_balances[owner_id] + ANNUAL_FAAB_ADDITION, FAAB_CAP)
        print(f"  Owner {owner_id}: End of Season {SEASONS_TO_PROCESS} FAAB = {end_of_last_season_bal}")
        print(f"  Owner {owner_id}: Starting FAAB for Season {current_season_number} (after +{ANNUAL_FAAB_ADDITION}, capped at {FAAB_CAP}) = {faab_balances[owner_id]}")

    # 4. Get user display names for final output
    print(f"\nFetching user details for current league {CURRENT_LEAGUE_ID}...")
    users = fetch_sleeper_data(f"{API_BASE_URL}/league/{CURRENT_LEAGUE_ID}/users")
    time.sleep(SLEEP_INTERVAL)
    owner_id_to_name = {}
    if users:
        for user in users:
            owner_id_to_name[user.get("user_id")] = user.get("display_name", f"Unknown Owner ({user.get('user_id')})")
    else:
        print("Warning: Could not fetch user details. Output will use owner IDs.")


    # 5. Prepare and return final results
    final_results = {}
    print("\n--- Final Starting FAAB Balances ---")
    for owner_id, balance in sorted(faab_balances.items(), key=lambda item: item[1], reverse=True):
        display_name = owner_id_to_name.get(owner_id, f"Owner ID {owner_id}")
        final_results[display_name] = balance
        print(f"{display_name}: {balance}")

    return final_results

# --- Run the script ---
if __name__ == "__main__":
    results = calculate_faab_history(CURRENT_LEAGUE_ID)
    if results:
        print("\nCalculation complete.")
        # You could save results to a file here if needed
        # with open("faab_results.json", "w") as f:
        #     json.dump(results, f, indent=2)
    else:
        print("\nCalculation failed.")
