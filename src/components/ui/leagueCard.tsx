import React from 'react';
import { FantasyFootballLeague } from "@/App";
import { usePlayersContext } from '../../contexts/PlayersContext'; // Import the custom hook
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LeagueOverviewChart from './leagueOverviewChart';

interface LeagueCardProps {
  league: FantasyFootballLeague;
  userId: string | null; // Add userId prop
  displayName: string | null;
}

const LeagueCard: React.FC<LeagueCardProps> = ({
  league,
  userId,
  displayName
}) => {
  const { players } = usePlayersContext(); // Use the custom hook to access players data

  // Function to find the roster for the current user
  const userRoster = league.rosters?.find((roster: { owner_id: string | null; }) => roster.owner_id === userId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{league.leagueName}</CardTitle>
        <CardDescription>{league.numberOfTeams}-Man League</CardDescription>
        {userRoster ? (
          <CardDescription>
            Regular Season Record: 
            <span style={{ color: 'green' }}> {userRoster.settings.wins} wins</span> / 
            <span style={{ color: 'red' }}> {userRoster.settings.losses} losses</span>
            {userRoster.settings.ties > 0 ? ` / ${userRoster.settings.ties} ties` : ""}
          </CardDescription>
        ) : (
          <CardDescription>No roster information available.</CardDescription>
        )}
        <CardDescription><LeagueOverviewChart rosters={league.rosters} /></CardDescription>
        <br></br>
        <CardDescription>{displayName}'s Starters:</CardDescription>
      </CardHeader>
      <CardContent>
        {userRoster ? (
          <div>
            <ul>
              {userRoster.starters.map((playerId: string, index: number) => {
                const playerName = players[playerId]?.full_name || 'Unknown Player';
                return <li key={index}>{playerName}</li>; // Display player ID and name
              })}
            </ul>
          </div>
        ) : (
          <p>No roster found for user.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default LeagueCard;
