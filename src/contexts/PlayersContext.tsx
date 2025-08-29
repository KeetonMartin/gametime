/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, ReactNode, useContext } from 'react';

interface PlayersMap {
  [key: string]: unknown;
}

interface PlayersContextType {
  players: PlayersMap;
  setPlayers: React.Dispatch<React.SetStateAction<PlayersMap>>;
}

export const PlayersContext = createContext<PlayersContextType>({
  players: {},
  setPlayers: () => { }, // Provide a noop function as a default
});

interface PlayersProviderProps {
  children: ReactNode;
}

export const PlayersProvider: React.FC<PlayersProviderProps> = ({ children }) => {
  const [players, setPlayers] = useState<PlayersMap>({});

  return (
    <PlayersContext.Provider value={{ players, setPlayers }}>
      {children}
    </PlayersContext.Provider>
  );
};

export function usePlayersContext() {
  const context = useContext(PlayersContext);
  if (context === undefined) {
    throw new Error('usePlayersContext must be used within a PlayersProvider');
  }
  return context;
}