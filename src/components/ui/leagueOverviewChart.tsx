// At the top of your file, add the import for ScatterChart
import { ScatterChart } from 'tremor-react'; // Adjust the import path as needed

const LeagueOverviewChart = ({ rosters }) => {
  // Assuming rosters is an array of roster objects
  const data = rosters.map((roster) => ({
    x: roster.settings.fpts, // fpts as x-axis
    y: roster.settings.wins, // wins as y-axis
    name: roster.owner_id, // or any other identifier you wish to use
  }));

  return (
    <ScatterChart
      data={data}
      xLabel="Fantasy Points"
      yLabel="Wins"
      // Add any additional props or styling needed
    />
  );
};

export default LeagueOverviewChart;