import { Heading, Image } from '@chakra-ui/react';
import { FC, MouseEventHandler } from 'react';
import { useConvoySelector } from '../SelectionProvider';
import SpeedSettings from '../common/SpeedSettings';
import { useConvoy, useWorld } from '../general/GameProvider';
import City from './City';
import Convoy from './Convoy';

const WorldMap: FC = () => {
  const world = useWorld();
  const selection = useConvoySelector();
  const convoy = useConvoy(selection.selected);
  const setConvoyTarget: MouseEventHandler<HTMLDivElement> = (e) => {
    if (convoy) {
      convoy.undock();
      convoy.setTarget({ pos: { x: e.pageX, y: e.pageY } });
    }
  };
  return (
    <div>
      <SpeedSettings />
      <Image
        src="/patrician2-map.jpg"
        minWidth={1400}
        onClick={() => selection.setSelected('')}
        onContextMenu={setConvoyTarget}
      />
      {world.citiesList.map((city) => {
        const onCityContextMenu: MouseEventHandler<HTMLButtonElement> = (e) => {
          e.stopPropagation();
          e.preventDefault();
          if (convoy) convoy.setTarget(city);
        };
        return (
          <City id={city.id} key={city.id} onContextMenu={onCityContextMenu} />
        );
      })}
      {world.convoysList.map((convoy) => (
        <Convoy key={convoy.id} id={convoy.id} />
      ))}
      {selection.selectedConvoy && (
        <Heading>Selected Convoy {selection.selectedConvoy.label}</Heading>
      )}
    </div>
  );
};

export default WorldMap;
