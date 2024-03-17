import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react';
import { builder } from '../domain/builder';
import { City } from '../domain/city';
import { Convoy } from '../domain/convoy';
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
export const useConvoy = (id: string | undefined) =>
  (useWorld().convoys[id ?? ''] || null) as Convoy | null;
export const useCity = (id: string | undefined) =>
  useWorld().cities[id ?? ''] as City | null;
