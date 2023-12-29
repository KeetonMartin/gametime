import { ScatterChart } from "@tremor/react";
import { Card, CardContent, CardTitle } from "./card";
import { usePlayersContext } from "@/contexts/PlayersContext";

const LeagueOverviewChart = ({ rosters }) => {
  const { players } = usePlayersContext();

  if (!rosters) {
    return <p>Loading chart data...</p>;
  }

  // Calculate mean and standard deviation of fpts
  const fptsArray = rosters.map((roster) => roster.settings.fpts);
  const meanFpts = fptsArray.reduce((a, b) => a + b, 0) / fptsArray.length;
  const stdDevFpts = Math.sqrt(
    fptsArray.map((fpts) => Math.pow(fpts - meanFpts, 2)).reduce((a, b) => a + b, 0) / fptsArray.length
  );

  // Map over rosters to create data for scatter plot
  const data = rosters.map((roster) => {
    const { wins, losses, ties, fpts } = roster.settings;
    const totalGames = wins + losses + ties;
    const winPercentage = totalGames > 0 ? wins / totalGames : 0;

    // Calculate the average age of starters
    const starterAges = roster.starters.map(
      (playerId) => players[playerId]?.age || 0
    );
    const averageAge = starterAges.length > 0
      ? starterAges.reduce((a, b) => a + b, 0) / starterAges.length
      : 0;

    // Calculate z-score for fpts
    const zScoreFpts = (fpts - meanFpts) / stdDevFpts;

    return {
      "Avg Age - Starters": averageAge,
      "Win %": winPercentage,
      "PF Z-score": zScoreFpts, // Using z-score for size
      name: roster.owner_id,
    };
  });

  console.log("Scatter Chart Data:", data);

  return (
    <Card>
      <CardTitle className="m-4">League Overview</CardTitle>
      <CardContent>
        <ScatterChart
          data={data}
          x="Avg Age - Starters"
          y="Win %"
          size="PF Z-score"
          category="name"
          showOpacity={true}
		  sizeRange={[100, 1000]}
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
