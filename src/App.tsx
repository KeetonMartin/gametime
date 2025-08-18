import { useContext, useEffect, useState } from "react";
import "./App.css";
import { Title } from "./components/ui/title";
import { InputWithButton } from "./components/ui/inputWithButton";
import UserCard from "./components/ui/userCard";
import LeagueCard from "./components/ui/leagueCard";
import { PlayersContext, PlayersProvider } from "./contexts/PlayersContext"; // Import the context and provider
import PlayersCard from "./components/ui/playersCard";
import { ScheduleContext, ScheduleProvider } from "./contexts/ScheduleContext"; // Import the ScheduleContext and Provider
import WeekCard from "./components/ui/weekCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Heading from "./components/ui/heading";
import { getCurrentNFLSeason } from "./lib/seasonUtils";

// Define a type for your API response
// Replace 'any' with a more specific type if you know the structure of your API response
type ApiResponse = any | null;

export type FantasyFootballLeague = {
  numberOfTeams: number;
  leagueName: string;
  leagueId: string;
  rosters: any;
  avatar: string;
};

function App() {
  // Extract the username from the URL path
  const path = window.location.pathname;
  const defaultUsername = path.split("/")[2] || ""; // Get the username from the URL if it exists

  const [username, setUsername] = useState<string>(defaultUsername);
  // const [setApiResponse] = useState<ApiResponse>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [leagueData, setLeagueData] = useState<ApiResponse>(null); // State to store the league data
  const [leagues, setLeagues] = useState<FantasyFootballLeague[]>([]); // State to store league objects

  const { setPlayers } = useContext(PlayersContext); // Use the setPlayers function from context
  const { setSchedule } = useContext(ScheduleContext); // Use setSchedule from ScheduleContext

  useEffect(() => {
    fetch("https://api.sleeper.app/v1/players/nfl")
      .then((response) => response.json())
      .then((data) => setPlayers(data)) // Store the data in the global state
      .catch((error) => console.error("Error fetching player data:", error));

    // New schedule data fetching - try local server first, then fallback to Heroku
    const scheduleUrls = [
      "http://localhost:5001/api", // Local development server
      "https://shielded-journey-91279-c0d1ba13fd56.herokuapp.com/api" // Production fallback
    ];
    
    const fetchScheduleData = async () => {
      for (const url of scheduleUrls) {
        try {
          console.log(`Attempting to fetch schedule from: ${url}`);
          const response = await fetch(url);
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status} from ${url}`);
          }
          
          const data = await response.json();
          
          if (data && !data.type) { // Ensure it's not an error response
            console.log("Schedule data fetched successfully:", data);
            setSchedule(data);
            return; // Success, exit the loop
          } else if (data.type === 'error') {
            console.warn(`Error response from ${url}:`, data.message);
            throw new Error(data.message);
          }
        } catch (error) {
          console.warn(`Failed to fetch from ${url}:`, (error as Error).message);
          // Continue to next URL
        }
      }
      
      // If all URLs failed, log final error
      console.error("Failed to fetch schedule data from all sources");
    };
    
    fetchScheduleData();

    if (leagueData) {
      const mappedLeagues = leagueData.map((league: any) => ({
        numberOfTeams: league.total_rosters,
        leagueName: league.name,
        leagueId: league.league_id,
        rosters: null, // Initialize rosters as null
        avatar: league.avatar,
      }));

      setLeagues(mappedLeagues);

      // Fetch roster data for each league
      mappedLeagues.forEach((league: { leagueId: string }) => {
        fetchRosterData(league.leagueId);
      });
    }
  }, [leagueData, setPlayers, setSchedule]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `https://api.sleeper.app/v1/user/${username}`
      );
      const data: ApiResponse = await response.json();
      // setApiResponse(data);
      if (data && data.user_id) {
        setUserId(data.user_id);
        fetchLeagueData(data.user_id); // Fetch league data after getting user_id
      }
      if (data && data.display_name) {
        setDisplayName(data.display_name);
      }
      if (data && data.avatar) {
        setAvatar(data.avatar);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchLeagueData = async (userId: string) => {
    try {
      const currentSeason = getCurrentNFLSeason();
      const response = await fetch(
        `https://api.sleeper.app/v1/user/${userId}/leagues/nfl/${currentSeason}`
      );
      const data: ApiResponse = await response.json();
      setLeagueData(data); // Set league data in state
    } catch (error) {
      console.error("Error fetching league data:", error);
    }
  };

  const fetchRosterData = async (leagueId: string) => {
    try {
      const response = await fetch(
        `https://api.sleeper.app/v1/league/${leagueId}/rosters`
      );
      const rosterData: ApiResponse = await response.json();

      // Update the leagues state with the roster data
      setLeagues((prevLeagues) =>
        prevLeagues.map((league) =>
          league.leagueId === leagueId
            ? { ...league, rosters: rosterData }
            : league
        )
      );
    } catch (error) {
      console.error("Error fetching roster data:", error);
    }
  };

  return (
    <>
      <div className="headerContainer">
        <Heading />
      </div>
      <Title />
      <div className="input-center">
        <InputWithButton
          username={username}
          setUsername={setUsername}
          fetchUserData={fetchUserData}
        />
      </div>
      <div className="card-container">
        <UserCard
          username={username}
          userId={userId}
          displayName={displayName}
          avatar={avatar}
        />
        <WeekCard />
      </div>

      {/* Tabs Component */}
      <Tabs defaultValue="players" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="players">All Players</TabsTrigger>
          <TabsTrigger value="leagues">Leagues</TabsTrigger>
        </TabsList>
        <TabsContent value="players">
          <PlayersCard
            leagues={leagues}
            userId={userId}
            displayName={displayName}
          />
        </TabsContent>
        <TabsContent value="leagues">
          {leagues.map((league, index) => (
            <LeagueCard
              key={index}
              league={league}
              userId={userId}
              displayName={displayName}
            />
          ))}
        </TabsContent>
      </Tabs>
    </>
  );
}

const WrappedApp = () => (
  <PlayersProvider>
    <ScheduleProvider>
      <App />
    </ScheduleProvider>
  </PlayersProvider>
);

export default WrappedApp;
