import React, { createContext, useState, ReactNode, useContext } from 'react';

interface PlayersContextType {
  players: { [key: string]: any }; // Replace 'any' with a more specific type if possible
  setPlayers: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>; // Same as above
}

export const PlayersContext = createContext<PlayersContextType>({
  players: {},
  setPlayers: () => { }, // Provide a noop function as a default
});

interface PlayersProviderProps {
  children: ReactNode;
}

export const PlayersProvider: React.FC<PlayersProviderProps> = ({ children }) => {
  const [players, setPlayers] = useState<{ [key: string]: any }>({}); // Replace 'any' with a more specific type if possible

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