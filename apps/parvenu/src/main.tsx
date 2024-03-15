import { ChakraProvider } from '@chakra-ui/react';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import { GameProvider } from './app/GameProvider';
import { SettingsProvider } from './app/SettingsContext';
import './global.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <BrowserRouter>
      <ChakraProvider>
        <GameProvider>
          <SettingsProvider>
            <App />
          </SettingsProvider>
        </GameProvider>
      </ChakraProvider>
    </BrowserRouter>
  </StrictMode>
);
