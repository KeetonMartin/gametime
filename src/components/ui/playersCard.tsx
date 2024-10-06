import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FantasyFootballLeague } from "../../types";
import { PlayersContext } from '../../contexts/PlayersContext';
import { ScheduleContext } from '../../contexts/ScheduleContext';

interface PlayersCardProps {
  leagues: FantasyFootballLeague[];
  userId: string | null;
  displayName: string | null;
}

const PlayersCard: React.FC<PlayersCardProps> = ({
  leagues,
  userId,
  displayName,
}) => {
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [recentGames, setRecentGames] = useState<any[]>([]);
  const [pastGames, setPastGames] = useState<any[]>([]);
  const [upcomingGames, setUpcomingGames] = useState<any[]>([]);

  const { players } = useContext(PlayersContext);
  const { schedule } = useContext(ScheduleContext);

  useEffect(() => {
    if (leagues.length > 0) {
      setSelectedLeagues(leagues.map(league => league.leagueId));
    }
  }, [leagues]);

  useEffect(() => {
    const currentWeek = schedule.week;
    const allPlayers: any[] = [];

    selectedLeagues.forEach(leagueId => {
      const league = leagues.find(l => l.leagueId === leagueId);
      if (league && league.rosters) {
        const userRoster = league.rosters.find((roster: any) => roster.owner_id === userId);
        if (userRoster) {
          userRoster.starters.forEach((playerId: string) => {
            const player = players[playerId];
            if (player) {
              const game = schedule.games.find((g: any) => 
                g.homeTeam.abbreviation === player.team || g.awayTeam.abbreviation === player.team
              );
              if (game) {
                allPlayers.push({
                  ...player,
                  gameInfo: game,
                  leagueName: league.leagueName
                });
              }
            }
          });
        }
      }
    });

    const recent = allPlayers.filter(p => p.gameInfo.status === 'in_progress');
    const past = allPlayers.filter(p => p.gameInfo.status === 'final');
    const upcoming = allPlayers.filter(p => p.gameInfo.status === 'pre_game');

    setRecentGames(recent);
    setPastGames(past);
    setUpcomingGames(upcoming);
  }, [selectedLeagues, leagues, userId, players, schedule]);

  const handleLeagueSelectionChange = (value: string[]) => {
    setSelectedLeagues(value);
  };

  const renderTable = (games: any[], title: string) => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Opponent</TableHead>
              <TableHead>League</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games.map((player, index) => (
              <TableRow key={index}>
                <TableCell>{player.full_name}</TableCell>
                <TableCell>{player.position}</TableCell>
                <TableCell>{player.team}</TableCell>
                <TableCell>
                  {player.team === player.gameInfo.homeTeam.abbreviation
                    ? player.gameInfo.awayTeam.abbreviation
                    : player.gameInfo.homeTeam.abbreviation}
                </TableCell>
                <TableCell>{player.leagueName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <>
      <ToggleGroup type="multiple" variant="outline" value={selectedLeagues} onValueChange={handleLeagueSelectionChange}>
        {leagues.map((league) => (
          <ToggleGroupItem key={league.leagueId} value={league.leagueId} aria-label={`Toggle ${league.leagueName}`}>
            {league.leagueName}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {recentGames.length > 0 && renderTable(recentGames, `${displayName}'s Starters - On the Field`)}
      {pastGames.length > 0 && renderTable(pastGames, `${displayName}'s Starters - Already Played`)}
      {upcomingGames.length > 0 && renderTable(upcomingGames, `${displayName}'s Starters - Yet to Play`)}
      {recentGames.length === 0 && pastGames.length === 0 && upcomingGames.length === 0 && (
        <Card className="mt-4">
          <CardContent>
            <p>No players to display.</p>
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default PlayersCard;