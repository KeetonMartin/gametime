import { useContext, useEffect, useState } from 'react';
import './App.css';
import Heading from './components/ui/heading';
import { Title } from './components/ui/title';
import { InputWithButton } from './components/ui/inputWithButton';
import UserCard from './components/ui/userCard';
import LeagueCard from './components/ui/leagueCard';
import { PlayersContext, PlayersProvider } from './contexts/PlayersContext'; // Import the context and provider
import PlayersCard from './components/ui/playersCard';
import { ScheduleContext, ScheduleProvider } from './contexts/ScheduleContext'; // Import the ScheduleContext and Provider

// Define a type for your API response
// Replace 'any' with a more specific type if you know the structure of your API response
type ApiResponse = any | null;

export type FantasyFootballLeague = {
  numberOfTeams: number;
  leagueName: string;
  leagueId: string;
  rosters: any
};

function App() {
  const [username, setUsername] = useState<string>("");
  // const [setApiResponse] = useState<ApiResponse>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [leagueData, setLeagueData] = useState<ApiResponse>(null); // State to store the league data
  const [leagues, setLeagues] = useState<FantasyFootballLeague[]>([]); // State to store league objects

  const { setPlayers } = useContext(PlayersContext); // Use the setPlayers function from context
  const { setSchedule } = useContext(ScheduleContext); // Use setSchedule from ScheduleContext

  useEffect(() => {
    fetch('https://api.sleeper.app/v1/players/nfl')
      .then(response => response.json())
      .then(data => setPlayers(data)) // Store the data in the global state
      .catch(error => console.error('Error fetching player data:', error));

    // New schedule data fetching
    fetch('https://shielded-journey-91279-c0d1ba13fd56.herokuapp.com/api')
      .then(response => response.json())
      .then(data => {
        // Assuming 'data' contains the schedule in the expected format
        setSchedule(data); // Store the schedule data in the global state
      })
      .catch(error => console.error('Error fetching schedule data:', error));

    if (leagueData) {
      const mappedLeagues = leagueData.map((league: any) => ({
        numberOfTeams: league.total_rosters,
        leagueName: league.name,
        leagueId: league.league_id,
        rosters: null // Initialize rosters as null
      }));

      setLeagues(mappedLeagues);

      // Fetch roster data for each league
      mappedLeagues.forEach((league: { leagueId: string; }) => {
        fetchRosterData(league.leagueId);
      });
    }
  }, [leagueData, setPlayers, setSchedule]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`https://api.sleeper.app/v1/user/${username}`);
      const data: ApiResponse = await response.json();
      // setApiResponse(data);
      if (data && data.user_id) {
        setUserId(data.user_id);
        fetchLeagueData(data.user_id); // Fetch league data after getting user_id
      }
      if (data && data.display_name) {
        setDisplayName(data.display_name);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchLeagueData = async (userId: string) => {
    try {
      const response = await fetch(`https://api.sleeper.app/v1/user/${userId}/leagues/nfl/2023`);
      const data: ApiResponse = await response.json();
      setLeagueData(data); // Set league data in state


    } catch (error) {
      console.error("Error fetching league data:", error);
    }
  };

  const fetchRosterData = async (leagueId: string) => {
    try {
      const response = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`);
      const rosterData: ApiResponse = await response.json();

      // Update the leagues state with the roster data
      setLeagues(prevLeagues => prevLeagues.map(league =>
        league.leagueId === leagueId ? { ...league, rosters: rosterData } : league
      ));
    } catch (error) {
      console.error("Error fetching roster data:", error);
    }
  };

  return (
    <>
      {/* <Heading /> */}
      <Title />
      <InputWithButton username={username} setUsername={setUsername} fetchUserData={fetchUserData} />
      <UserCard username={username} userId={userId} displayName={displayName} />
      <PlayersCard leagues={leagues} userId={userId} displayName={displayName} />
      {/* Create an array of LeagueCard components based on leagues */}
      {leagues.map((league, index) => (
        <LeagueCard key={index} league={league} userId={userId} displayName={displayName} />
      ))}
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