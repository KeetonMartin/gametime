import { useContext } from 'react';
import { ScheduleContext } from '../../contexts/ScheduleContext'; // Adjust the import path as necessary
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const WeekCard = () => {
  const { schedule } = useContext(ScheduleContext); // Access schedule from ScheduleContext

  // Format season type for display
  const formatSeasonType = (seasonType?: string) => {
    if (!seasonType) return '';
    
    switch (seasonType) {
      case 'preseason':
        return '🏈 Preseason';
      case 'regular':
        return '🏟️ Regular Season';
      case 'playoffs':
        return '🏆 Playoffs';
      case 'offseason':
        return '🏈 Offseason';
      default:
        return seasonType;
    }
  };

  // Get appropriate styling for season type
  const getSeasonTypeStyle = (seasonType?: string) => {
    switch (seasonType) {
      case 'preseason':
        return { 
          backgroundColor: '#fef3c7', 
          color: '#92400e', 
          padding: '4px 8px', 
          borderRadius: '4px',
          fontSize: '0.875rem',
          fontWeight: '500',
          display: 'inline-block',
          marginBottom: '8px'
        };
      case 'regular':
        return { 
          backgroundColor: '#d1fae5', 
          color: '#065f46', 
          padding: '4px 8px', 
          borderRadius: '4px',
          fontSize: '0.875rem',
          fontWeight: '500',
          display: 'inline-block',
          marginBottom: '8px'
        };
      case 'playoffs':
        return { 
          backgroundColor: '#ddd6fe', 
          color: '#5b21b6', 
          padding: '4px 8px', 
          borderRadius: '4px',
          fontSize: '0.875rem',
          fontWeight: '500',
          display: 'inline-block',
          marginBottom: '8px'
        };
      case 'offseason':
        return { 
          backgroundColor: '#f3f4f6', 
          color: '#374151', 
          padding: '4px 8px', 
          borderRadius: '4px',
          fontSize: '0.875rem',
          fontWeight: '500',
          display: 'inline-block',
          marginBottom: '8px'
        };
      default:
        return {};
    }
  };

  return (
    <Card style={{ width: '33.33%' }}>
      <CardHeader>
        <CardTitle>
          Week {schedule.week}
          {schedule.season && (
            <div style={{ fontSize: '0.875rem', fontWeight: 'normal', color: '#6b7280', marginTop: '4px' }}>
              {schedule.season} Season
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {schedule.seasonType && (
          <div style={getSeasonTypeStyle(schedule.seasonType)}>
            {formatSeasonType(schedule.seasonType)}
          </div>
        )}
        <p>Total Games: {schedule.games.length}</p>
        {schedule.timestamp && (
          <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '8px' }}>
            Updated: {new Date(schedule.timestamp).toLocaleTimeString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default WeekCard;
