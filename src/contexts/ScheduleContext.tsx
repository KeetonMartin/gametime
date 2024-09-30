import React, { createContext, useState, ReactNode, useContext } from 'react';

interface Team {
  id: string;
  name: string;
  abbreviation: string;
  score: string;
}

interface Game {
  id: string;
  date: string;
  name: string;
  shortName: string;
  homeTeam: Team;
  awayTeam: Team;
  status: string;
  venue: string;
  broadcast: string;
  odds: null; // You might want to define a more specific type for odds if needed
}

interface Schedule {
  week: number;
  games: Game[];
  season?: number;
  seasonType?: 'preseason' | 'regular' | 'playoffs' | 'offseason';
  timestamp?: string;
}

interface ScheduleContextType {
  schedule: Schedule;
  setSchedule: React.Dispatch<React.SetStateAction<Schedule>>;
}

const defaultSchedule: Schedule = {
  week: 0,
  games: [],
};

export const ScheduleContext = createContext<ScheduleContextType>({
  schedule: defaultSchedule,
  setSchedule: () => {},
});

interface ScheduleProviderProps {
  children: ReactNode;
}

export const ScheduleProvider: React.FC<ScheduleProviderProps> = ({ children }) => {
  const [schedule, setSchedule] = useState<Schedule>(defaultSchedule);

  return (
    <ScheduleContext.Provider value={{ schedule, setSchedule }}>
      {children}
    </ScheduleContext.Provider>
  );
};

export function useScheduleContext() {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useScheduleContext must be used within a ScheduleProvider');
  }
  return context;
}