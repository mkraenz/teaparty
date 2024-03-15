import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react';

type Settings = {
  gamespeed: number;
};

const defaultSettings: Settings = {
  gamespeed: 1,
};

const SettingsContext = createContext<[Settings, (settings: Settings) => void]>(
  [defaultSettings, () => {}]
);

export const SettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);

  return (
    <SettingsContext.Provider value={[settings, setSettings]}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
