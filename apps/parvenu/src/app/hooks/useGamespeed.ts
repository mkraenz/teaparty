import { useCallback, useEffect } from 'react';
import { World } from '../../domain/world';
import { useSettings } from '../SettingsContext';

const handleKeyPress =
  (setSpeed: (value: number) => void) => (event: KeyboardEvent) => {
    if (event.key === '1') setSpeed(0);
    if (event.key === '2') setSpeed(0.1);
    if (event.key === '3') setSpeed(1);
    if (event.key === '4') setSpeed(2);
    if (event.key === '5') setSpeed(3);
    if (event.key === '6') setSpeed(10);
    if (event.key === '7') setSpeed(100);
  };

const useGamespeed = (world: World) => {
  const [settings, setSettings] = useSettings();
  useEffect(() => {
    const interval =
      settings.gamespeed === 0
        ? 0
        : window.setInterval(() => {
            world.passDay();
          }, 1000 / settings.gamespeed);
    return () => window.clearInterval(interval);
  }, [settings.gamespeed]);
  useEffect(() => {
    const listener = handleKeyPress((val) =>
      setSettings({ ...settings, gamespeed: val })
    );
    window.addEventListener('keydown', listener, false);
    return () => document.removeEventListener('keydown', listener);
  }, [setSettings]);
  const setGameSpeedPolymorph = useCallback(
    (value: number | string) =>
      setSettings({
        ...settings,
        gamespeed: typeof value === 'number' ? value : parseFloat(value),
      }),
    [setSettings, settings]
  );

  return {
    gamespeed: settings.gamespeed,
    setGamespeed: setGameSpeedPolymorph,
  };
};

export default useGamespeed;
