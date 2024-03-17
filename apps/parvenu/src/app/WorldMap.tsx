import { Button, Heading, Image } from '@chakra-ui/react';
import { FC, MouseEventHandler } from 'react';
import { Link } from 'react-router-dom';
import Convoy from './Convoy';
import { useConvoy, useWorld } from './GameProvider';
import { useConvoySelector } from './SelectionProvider';
import SpeedSettings from './SpeedSettings';

const WorldMap: FC = () => {
  const world = useWorld();
  const selectedConvoy = useConvoySelector();
  const convoy = useConvoy(selectedConvoy.selected);
  const setConvoyTarget: MouseEventHandler<HTMLDivElement> = (e) => {
    if (convoy) convoy.setTarget({ x: e.pageX, y: e.pageY }); // TODO: this is absolute position, ideally it should be relative to the map though
  };
  return (
    <div
      onClick={() => selectedConvoy.setSelected('')}
      onContextMenu={setConvoyTarget}
    >
      <SpeedSettings />
      <Image src="/patrician2-map.jpg" minWidth={1400} />
      {world.citiesList.map((city) => (
        <Button
          key={city.id}
          pos={'absolute'}
          top={city.pos.y + 23}
          left={city.pos.x - 18}
          as={Link}
          to={`/cities/${city.id}`}
        >
          {city.label}
        </Button>
      ))}
      {world.convoysList.map((convoy) => (
        <Convoy key={convoy.id} id={convoy.id} />
      ))}
      {selectedConvoy.selected && (
        <Heading>Selected Convoy {selectedConvoy.selected}</Heading>
      )}
    </div>
  );
};

export default WorldMap;
