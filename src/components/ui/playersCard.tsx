import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FantasyFootballLeague } from "@/App";
import { usePlayersContext } from "../../contexts/PlayersContext";
import { useScheduleContext } from "../../contexts/ScheduleContext"; // Import ScheduleContext
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"; // Import Card components
import { getTeamBackgroundColor } from "@/lib/utils";
// Import ToggleGroup components
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

interface PlayersCardProps {
  leagues: FantasyFootballLeague[];
  userId: string | null;
  displayName: string | null;
}

const DEFAULT_IMAGE="https://blog.sleeper.com/content/images/2019/06/app_logo.png"

// Helper function to determine background color based on position
const getPositionBackgroundColor = (position: string) => {
    switch (position) {
      case 'QB': return 'bg-red-200';
      case 'WR': return 'bg-blue-200';
      case 'RB': return 'bg-green-200';
      case 'TE': return 'bg-orange-200';
      case 'DEF': return 'bg-[#dcc0ab]'; // Make sure to define bg-brown-200 in your CSS
      case 'K': return 'bg-purple-200';
      default: return 'bg-gray-200'; // Default background color
    }
};

// Utility function to format date
const formatDate = (isoDateString: string | null | undefined, broadcast: string | null | undefined): string => {
  if (!isoDateString) return "N/A";

  const date = new Date(isoDateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  return `${formattedDate} on ${broadcast || 'N/A'}`;
};

const PlayersCard: React.FC<PlayersCardProps> = ({
  leagues,
  userId,
  displayName,
}) => {
  const { players } = usePlayersContext();
  const { schedule } = useScheduleContext();
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>(leagues.map(league => league.leagueId));

  useEffect(() => {
    if (leagues.length > 0) {
      setSelectedLeagues(leagues.map(league => league.leagueId));
    }
  }, [leagues]); // Dependency on leagues ensures this effect runs when leagues data changes.

  // Function to handle league selection change
  const handleLeagueSelectionChange = (value: string[]) => {
    setSelectedLeagues(value);
  };
  
  // Filter players based on selected leagues
  const filteredLeagues = leagues.filter(league => selectedLeagues.includes(league.leagueId));

  // Get current time
  const currentTime = new Date();

  interface PlayerLeaguesCount {
    [playerId: string]: number;
  }

  const playerLeaguesCount: PlayerLeaguesCount = {};

  // Adjust to use filteredLeagues for counting player appearances in selected leagues
  filteredLeagues.forEach((league) => {
    const userRoster = league.rosters?.find(
      (roster: { owner_id: string | null }) => roster.owner_id === userId
    );
    if (userRoster && userRoster.starters) {
      userRoster.starters.forEach((playerId: string | number) => {
        playerLeaguesCount[playerId] = (playerLeaguesCount[playerId] || 0) + 1;
      });
    }
  });

  const uniqueStarters = Object.keys(playerLeaguesCount);

  // Sort by leagues owned first, then by search_rank
  const sortedStarters = uniqueStarters.sort((a, b) => {
    const leaguesOwnedDiff = playerLeaguesCount[b] - playerLeaguesCount[a];
    if (leaguesOwnedDiff !== 0) return leaguesOwnedDiff;

    const rankA = players[a]?.search_rank || Infinity;
    const rankB = players[b]?.search_rank || Infinity;
    return rankA - rankB;
  });

  // Helper function to find player's team game
  const findPlayersGame = (team: string) => {
    const game = schedule.games.find(
      (g) => g.homeTeam.abbreviation === team || g.awayTeam.abbreviation === team
    );
    return game
      ? {
          scheduled: game.date,
          opponent: game.homeTeam.abbreviation === team ? game.awayTeam.name : game.homeTeam.name,
          broadcast: game.broadcast,
        }
      : null;
  };

  // Filter games that started in the last 4 hours
  const recentGames = sortedStarters.filter((playerId) => {
    const game = findPlayersGame(players[playerId]?.team);
    if (!game || !game.scheduled) return false;
    const gameTime = new Date(game.scheduled);
    return (
      gameTime >= new Date(currentTime.getTime() - 4 * 60 * 60 * 1000) &&
      gameTime <= currentTime
    );
  });

  // Filter games that started before the last 4 hours
  const pastGames = sortedStarters.filter((playerId) => {
    const game = findPlayersGame(players[playerId]?.team);
    if (!game || !game.scheduled) return false;
    const gameTime = new Date(game.scheduled);
    return gameTime < new Date(currentTime.getTime() - 4 * 60 * 60 * 1000);
  });

  // Filter upcoming games
  const upcomingGames = sortedStarters.filter((playerId) => {
    const game = findPlayersGame(players[playerId]?.team);
    if (!game || !game.scheduled) return true;
    const gameTime = new Date(game.scheduled);
    return gameTime > currentTime;
  });

  // Function to render a table with given players
  const renderTable = (playerIds: string[], caption: string) => (
    <Card>
      <CardHeader>
        <CardTitle>{caption}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Player Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Number</TableHead>
              <TableHead>Leagues Owned</TableHead>
              <TableHead>Game Info</TableHead>
              <TableHead>Opponent Team</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {playerIds.map((playerId: string) => {
              const player = players[playerId];
              const isInactive = player?.status && player.status !== "Active";
              let playerName = player?.full_name || "Unknown Player";

              if (player?.position === "DEF") {
                playerName = player?.team
                  ? `${player.team} Defense`
                  : "Unknown Defense";
              }

              const playerGame = findPlayersGame(player?.team);
              const formattedGameInfo = formatDate(playerGame?.scheduled, playerGame?.broadcast);

              return (
                <TableRow key={playerId}>
                  <TableCell className="font-bold text-left">
                    {playerName}
                  </TableCell>
                  <TableCell className={getPositionBackgroundColor(player?.position)}>
                    {player?.position || "N/A"}
                  </TableCell>
                  <TableCell className={getTeamBackgroundColor(player?.team)}>
                    {player?.team || "N/A"}
                  </TableCell>
                  <TableCell style={{ color: isInactive ? "red" : "inherit" }}>
                    {player?.status || "N/A"}
                  </TableCell>
                  <TableCell>{player?.number || "N/A"}</TableCell>
                  <TableCell>{playerLeaguesCount[playerId]}</TableCell>
                  <TableCell>{formattedGameInfo}</TableCell>
                  <TableCell className={getTeamBackgroundColor(playerGame?.opponent)}>{playerGame?.opponent || "N/A"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <p>{/* Any footer content you want to add */}</p>
      </CardFooter>
    </Card>
  );

  console.log(selectedLeagues); // Debugging the current state

  return (
    <>
      <ToggleGroup type="multiple" variant="outline" size="lg" value={selectedLeagues} onValueChange={handleLeagueSelectionChange}>
        {leagues.map((league) => (
          <ToggleGroupItem key={league.leagueId} value={league.leagueId} aria-label={`Toggle ${league.leagueName}`} className="flex items-center gap-2">
            <img src={"https://sleepercdn.com/avatars/" + league.avatar} onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.src = DEFAULT_IMAGE }} alt={`${league.leagueName} avatar`} style={{ width: 24, height: 24, borderRadius: '50%' }} />
            {league.leagueName}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {recentGames.length > 0 &&
        renderTable(
          recentGames,
          `${displayName}'s Starters - On the Field`
        )}
      {pastGames.length > 0 &&
        renderTable(
          pastGames,
          `${displayName}'s Starters - Already Played`
        )}
      {upcomingGames.length > 0 &&
        renderTable(upcomingGames, `${displayName}'s Starters - Yet to Play`)}
      {recentGames.length === 0 &&
        pastGames.length === 0 &&
        upcomingGames.length === 0 && <div>No players to display.</div>}
    </>
  );
};

export default PlayersCard;