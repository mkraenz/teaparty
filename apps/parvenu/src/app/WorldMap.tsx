import { Button, Image } from '@chakra-ui/react';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import Convoy from './Convoy';
import { useWorld } from './GameProvider';
import SpeedSettings from './SpeedSettings';

const WorldMap: FC = () => {
  const world = useWorld();
  return (
    <div>
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
        <Convoy key={convoy.id} {...convoy} />
      ))}
    </div>
  );
};

export default WorldMap;
