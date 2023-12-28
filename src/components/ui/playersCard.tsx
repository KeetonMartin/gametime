import React from 'react';
import { usePlayersContext } from '../../contexts/PlayersContext';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FantasyFootballLeague } from "@/App";

interface PlayersCardProps {
  leagues: FantasyFootballLeague[];
  userId: string | null;
}

const PlayersCard: React.FC<PlayersCardProps> = ({ leagues, userId }) => {
  const { players } = usePlayersContext();

  const userStarters = leagues.reduce((starters, league) => {
    const userRoster = league.rosters?.find((roster: { owner_id: string | null; }) => roster.owner_id === userId);
    if (userRoster && userRoster.starters) {
      starters.push(...userRoster.starters);
    }
    return starters;
  }, []);

  const uniqueStarters = Array.from(new Set(userStarters));

  // Sort by search_rank
  const sortedStarters = uniqueStarters.sort((a, b) => {
    const rankA = players[a]?.search_rank || Infinity;
    const rankB = players[b]?.search_rank || Infinity;
    return rankA - rankB;
  });

  return (
    <Table>
      <TableCaption>{userId}'s Starters Across All Leagues</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-left">Player Name</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Team</TableHead>
          <TableHead>Search Rank</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Number</TableHead>
          <TableHead>Player ID</TableHead>
          {/* <TableHead>Sportradar ID</TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedStarters.map((playerId) => {
          const player = players[playerId];
          const isInactive = player?.status && player.status !== 'Active';
          return (
            <TableRow key={playerId}>
              <TableCell className="font-bold text-left">{player?.full_name || 'Unknown Player'}</TableCell>
              <TableCell>{player?.position || 'N/A'}</TableCell>
              <TableCell>{player?.team || 'N/A'}</TableCell>
              <TableCell>{player?.search_rank || 'N/A'}</TableCell>
              <TableCell style={{ color: isInactive ? 'red' : 'inherit' }}>{player?.status || 'N/A'}</TableCell>
              <TableCell>{player?.number || 'N/A'}</TableCell>
              <TableCell>{playerId}</TableCell>
              {/* <TableCell>{player?.sportradar_id || 'N/A'}</TableCell> */}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default PlayersCard;
