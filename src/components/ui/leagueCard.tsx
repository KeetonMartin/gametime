import React from 'react';
import { FantasyFootballLeague } from "../types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface LeagueCardProps {
  league: FantasyFootballLeague;
  userId: string | null;
  displayName: string | null;
}

const LeagueCard: React.FC<LeagueCardProps> = ({
  league,
  userId}) => {
  const userRoster = league.rosters?.find((roster: { owner_id: string | null; }) => roster.owner_id === userId);

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{league.leagueName}</CardTitle>
        <CardDescription>{league.numberOfTeams}-Team League</CardDescription>
      </CardHeader>
      <CardContent>
        {userRoster ? (
          <div>
            <p>Record: {userRoster.settings.wins}-{userRoster.settings.losses}-{userRoster.settings.ties}</p>
            <p>Starters:</p>
            <ul>
              {userRoster.starters.map((playerId: string, index: number) => (
                <li key={index}>{playerId}</li>
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