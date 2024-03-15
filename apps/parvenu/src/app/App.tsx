import { useRef } from 'react';
import { builder } from '../domain/builder';
import MyRouter from './Router';
import useGameLoop from './hooks/useGameLoop';

export const App = () => {
  const mapRef = useRef(builder());
  const world = mapRef.current.world;
  useGameLoop();
  return <MyRouter world={world} />;
};

export default App;
