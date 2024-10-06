import { useContext, useEffect, useState } from "react";
import { PlayersContext, PlayersProvider } from "./contexts/PlayersContext";
import { ScheduleContext, ScheduleProvider } from "./contexts/ScheduleContext";
import Dashboard from "./components/dashboard";
import { ApiResponse, FantasyFootballLeague } from "./types";

function App() {
  const [username, setUsername] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [leagueData, setLeagueData] = useState<ApiResponse>(null);
  const [leagues, setLeagues] = useState<FantasyFootballLeague[]>([]);

  const { setPlayers } = useContext(PlayersContext);
  const { setSchedule } = useContext(ScheduleContext);

  useEffect(() => {
    // Fetch players data
    fetch("https://api.sleeper.app/v1/players/nfl")
      .then((response) => response.json())
      .then((data) => setPlayers(data))
      .catch((error) => console.error("Error fetching player data:", error));

    // Fetch schedule data
    fetch("https://shielded-journey-91279-c0d1ba13fd56.herokuapp.com/api")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching schedule data");
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          console.log("schedule data: ", data);
          setSchedule(data);
        }
      })
      .catch((error) => console.error("Error fetching schedule data:", error));
  }, [setPlayers, setSchedule]);

  useEffect(() => {
    if (leagueData) {
      const mappedLeagues = leagueData.map((league: any) => ({
        numberOfTeams: league.total_rosters,
        leagueName: league.name,
        leagueId: league.league_id,
        rosters: null,
        avatar: league.avatar,
      }));

      setLeagues(mappedLeagues);

      mappedLeagues.forEach((league: { leagueId: string }) => {
        fetchRosterData(league.leagueId);
      });
    }
  }, [leagueData]);

  const fetchUserData = async (username: string) => {
    try {
      const response = await fetch(`https://api.sleeper.app/v1/user/${username}`);
      const data: ApiResponse = await response.json();
      if (data && data.user_id) {
        setUserId(data.user_id);
        setDisplayName(data.display_name || null);
        setAvatar(data.avatar || null);
        fetchLeagueData(data.user_id);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchLeagueData = async (userId: string) => {
    try {
      const response = await fetch(`https://api.sleeper.app/v1/user/${userId}/leagues/nfl/2024`);
      const data: ApiResponse = await response.json();
      setLeagueData(data);
    } catch (error) {
      console.error("Error fetching league data:", error);
    }
  };

  const fetchRosterData = async (leagueId: string) => {
    try {
      const response = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`);
      const rosterData: ApiResponse = await response.json();
      setLeagues((prevLeagues) =>
        prevLeagues.map((league) =>
          league.leagueId === leagueId ? { ...league, rosters: rosterData } : league
        )
      );
    } catch (error) {
      console.error("Error fetching roster data:", error);
    }
  };

  return (
    <PlayersProvider>
      <ScheduleProvider>
        <Dashboard
          username={username}
          setUsername={setUsername}
          fetchUserData={fetchUserData}
          userId={userId}
          displayName={displayName}
          avatar={avatar}
          leagues={leagues}
        />
      </ScheduleProvider>
    </PlayersProvider>
  );
}

export default App;
