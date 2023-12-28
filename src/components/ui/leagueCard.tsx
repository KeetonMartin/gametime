import React from 'react';
import { FantasyFootballLeague } from "@/App";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface LeagueCardProps {
  league: FantasyFootballLeague;
  userId: string | null; // Add userId prop
}

const LeagueCard: React.FC<LeagueCardProps> = ({
  league,
  userId,
}) => {
  // Function to find the roster for the current user
  const userRoster = league.rosters?.find((roster: { owner_id: string | null; }) => roster.owner_id === userId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{league.leagueName}</CardTitle>
        <CardDescription>{league.numberOfTeams}-Man League</CardDescription>
        <br></br>
        <CardDescription>Roster</CardDescription>
      </CardHeader>
      <CardContent>
        {userRoster ? (
          <div>
            <p>Starters for {userId}:</p>
            <ul>
              {userRoster.starters.map((playerId: string, index: number) => (
                <li key={index}>{playerId}</li> // Display player IDs
              ))}
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
