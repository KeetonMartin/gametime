import { useContext } from 'react';
import { ScheduleContext } from '../../contexts/ScheduleContext'; // Adjust the import path as necessary
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const WeekCard = () => {
  const { schedule } = useContext(ScheduleContext); // Access schedule from ScheduleContext

  return (
    <Card style={{ width: '33.33%' }}>
      <CardHeader>
        <CardTitle>Week {schedule.week}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Total Games: {schedule.games.length}</p>
      </CardContent>
    </Card>
  );
};

export default WeekCard;
