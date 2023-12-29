import React from "react";
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

interface PlayersCardProps {
  leagues: FantasyFootballLeague[];
  userId: string | null;
  displayName: string | null;
}

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
const formatDate = (isoDateString: string | null | undefined): string => {
  if (!isoDateString) return "N/A";

  const date = new Date(isoDateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
};

const PlayersCard: React.FC<PlayersCardProps> = ({
  leagues,
  userId,
  displayName,
}) => {
  const { players } = usePlayersContext();
  const { schedule } = useScheduleContext();

  // Get current time
  const currentTime = new Date();

  interface PlayerLeaguesCount {
    [playerId: string]: number;
  }

  const playerLeaguesCount: PlayerLeaguesCount = {};

  leagues.forEach((league) => {
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
    const game = schedule.week.games.find(
      (g) => g.home.alias === team || g.away.alias === team
    );
    return game
      ? {
          scheduled: game.scheduled,
          opponent: game.home.alias === team ? game.away.name : game.home.name,
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
              {/* <TableHead>Search Rank</TableHead> */}
              <TableHead>Status</TableHead>
              <TableHead>Number</TableHead>
              {/* <TableHead>Player ID</TableHead> */}
              <TableHead>Leagues Owned</TableHead>
              <TableHead>&#x1F4C5; Scheduled Time</TableHead>
              <TableHead>Opponent Team</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {playerIds.map((playerId: string) => {
              const player = players[playerId];
              const isInactive = player?.status && player.status !== "Active";
              let playerName = player?.full_name || "Unknown Player";

              // Check if the player is a defense player
              if (player?.position === "DEF") {
                playerName = player?.team
                  ? `${player.team} Defense`
                  : "Unknown Defense";
              }

              // Find the player's team game
              const playerGame = findPlayersGame(player?.team);
              // Format the scheduled time
              const formattedScheduledTime = formatDate(playerGame?.scheduled);

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
                  {/* <TableCell>{player?.search_rank || "N/A"}</TableCell> */}
                  <TableCell style={{ color: isInactive ? "red" : "inherit" }}>
                    {player?.status || "N/A"}
                  </TableCell>
                  <TableCell>{player?.number || "N/A"}</TableCell>
                  {/* <TableCell>{playerId}</TableCell> */}
                  <TableCell>{playerLeaguesCount[playerId]}</TableCell>
                  <TableCell>{formattedScheduledTime || "N/A"}</TableCell>
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

  return (
    <>
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
