import MyRouter from './Router';
import { useDisableContextMenu } from './hooks/useDisableContextMenu';
import useGameLoop from './hooks/useGameLoop';

export const App = () => {
  useDisableContextMenu();
  useGameLoop();
  return <MyRouter />;
};

export default App;
