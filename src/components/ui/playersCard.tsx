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
    displayName: string | null;
}

const PlayersCard: React.FC<PlayersCardProps> = ({ leagues, userId, displayName }) => {
    const { players } = usePlayersContext();

    interface PlayerLeaguesCount {
        [playerId: string]: number;
    }

    const playerLeaguesCount: PlayerLeaguesCount = {};

    leagues.forEach(league => {
        const userRoster = league.rosters?.find((roster: { owner_id: string | null; }) => roster.owner_id === userId);
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

    return (
        <Table>
            <TableCaption>{displayName}'s Starters Across All Leagues</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-left">Player Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Search Rank</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Number</TableHead>
                    <TableHead>Player ID</TableHead>
                    <TableHead>Leagues Owned</TableHead> {/* New Column */}
                </TableRow>
            </TableHeader>
            <TableBody>
                {sortedStarters.map((playerId) => {
                    const player = players[playerId];
                    const isInactive = player?.status && player.status !== 'Active';
                    let playerName = player?.full_name || 'Unknown Player';

                    // Check if the player is a defense player
                    if (player?.position === 'DEF') {
                        playerName = player?.team ? `${player.team} Defense` : 'Unknown Defense';
                    }

                    return (
                        <TableRow key={playerId}>
                            <TableCell className="font-bold text-left">{playerName}</TableCell>
                            <TableCell>{player?.position || 'N/A'}</TableCell>
                            <TableCell>{player?.team || 'N/A'}</TableCell>
                            <TableCell>{player?.search_rank || 'N/A'}</TableCell>
                            <TableCell style={{ color: isInactive ? 'red' : 'inherit' }}>{player?.status || 'N/A'}</TableCell>
                            <TableCell>{player?.number || 'N/A'}</TableCell>
                            <TableCell>{playerId}</TableCell>
                            <TableCell>{playerLeaguesCount[playerId]}</TableCell> {/* Display the count */}
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

export default PlayersCard;