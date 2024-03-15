import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react';
import { builder } from '../domain/builder';
import { World } from '../domain/world';

type Game = {
  world: World;
};

const defaultGame: Game = {
  // @ts-expect-error - this is a placeholder
  world: null,
};

const GameContext = createContext<[Game, (game: Game) => void]>([
  defaultGame,
  () => {},
]);

export const GameProvider: FC<PropsWithChildren> = ({ children }) => {
  const [game, setGame] = useState(builder());

  return (
    <GameContext.Provider value={[game, setGame]}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
export const useWorld = () => useGame()[0].world;
