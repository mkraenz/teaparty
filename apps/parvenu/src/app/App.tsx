import MyRouter from './Router';
import useGameLoop from './hooks/useGameLoop';

export const App = () => {
  useGameLoop();
  return <MyRouter />;
};

export default App;
