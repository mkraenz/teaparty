import { useCallback, useEffect, useRef, useState } from 'react';
import { World } from '../../domain/world';

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

const useGamespeed = (
  initialTime: number,
  setTime: (newValue: number) => void,
  world: World
) => {
  const timeRef = useRef(initialTime);
  const [gamespeed, setGamespeed] = useState(1); // 0 = paused, 0.1, 1 = 1 day per second, 2, 3, 10
  useEffect(() => {
    const interval =
      gamespeed === 0
        ? 0
        : window.setInterval(() => {
            timeRef.current += 1; // i didn't find a better way to ensure access to the up-to-date time without rerunning useEffect
            setTime(timeRef.current);
            world.passDay(timeRef.current);
          }, 1000 / gamespeed);
    return () => window.clearInterval(interval);
  }, [gamespeed]);
  useEffect(() => {
    const listener = handleKeyPress(setGamespeed);
    window.addEventListener('keydown', listener, false);
    return () => document.removeEventListener('keydown', listener);
  }, [setGamespeed]);
  const setGameSpeedPolymorph = useCallback(
    (value: number | string) =>
      setGamespeed(typeof value === 'number' ? value : parseFloat(value)),
    [setGamespeed]
  );

  return {
    gamespeed,
    setGamespeed: setGameSpeedPolymorph,
  };
};

export default useGamespeed;
