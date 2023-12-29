import { ScatterChart } from "@tremor/react";
import { Card, CardContent, CardTitle } from "./card";
import { usePlayersContext } from "@/contexts/PlayersContext";

const LeagueOverviewChart = ({ rosters }) => {
  const { players } = usePlayersContext(); // Access players context

  if (!rosters) {
    return <p>Loading chart data...</p>;
  }

  const data = rosters.map((roster) => {
    const { wins, losses, ties, fpts } = roster.settings;
    const totalGames = wins + losses + ties;
    const winPercentage = totalGames > 0 ? wins / totalGames : 0;

    // Calculate the average age of starters
    const starterAges = roster.starters.map(
      (playerId: string | number) => players[playerId]?.age || 0
    );
    const averageAge =
      starterAges.length > 0
        ? starterAges.reduce((a, b) => a + b, 0) / starterAges.length
        : 0;

    return {
      x: averageAge, // Average age of starters as x-axis
      y: winPercentage, // Win percentage as y-axis
      size: fpts, // Fantasy points to determine the size of the scatter point
      name: roster.owner_id, // Identifier
    };
  });

  return (
    <Card>
      <CardTitle className="m-4">League Overview</CardTitle>
      <CardContent>
        <ScatterChart
          data={data}
          x="x"
          y="y"
          size="size"
          category="name"
          showOpacity={true}
          minXValue={20}
          maxYValue={1.0}
          enableLegendSlider
          // Add any additional props or styling needed
        />
      </CardContent>
    </Card>
  );
};

export default LeagueOverviewChart;
