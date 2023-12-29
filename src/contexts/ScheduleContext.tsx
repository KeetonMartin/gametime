import React, { createContext, useState, ReactNode, useContext } from 'react';

interface Game {
  id: string;
  status: string;
  scheduled: string;
  venue: {
    name: string;
    city: string;
    state: string;
    // Add other venue fields as needed
  };
  home: {
    name: string;
    alias: string;
  };
  away: {
    name: string;
    alias: string;
  };
  // Add other game fields as needed
}

interface ScheduleContextType {
  schedule: {
    week: {
      title: string;
      games: Game[];
    };
  };
  setSchedule: React.Dispatch<React.SetStateAction<{ week: { games: Game[] } }>>;
}

export const ScheduleContext = createContext<ScheduleContextType>({
  schedule: { week: {
    games: [],
    title: ''
  } },
  setSchedule: () => {},
});

interface ScheduleProviderProps {
  children: ReactNode;
}

export const ScheduleProvider: React.FC<ScheduleProviderProps> = ({ children }) => {
  const [schedule, setSchedule] = useState<{ week: { games: Game[] } }>({ week: { games: [] } });

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