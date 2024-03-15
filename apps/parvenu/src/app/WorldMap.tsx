import { Button, Image } from '@chakra-ui/react';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useWorld } from './GameProvider';
import SpeedSettings from './SpeedSettings';

const WorldMap: FC = () => {
  const world = useWorld();
  return (
    <div>
      <SpeedSettings />
      <Image src="/patrician2-map.jpg" width={1400} />
      {world.citiesList.map((city) => (
        <Button
          key={city.name}
          pos={'absolute'}
          top={city.position.y + 23}
          left={city.position.x - 18}
          as={Link}
          to={`/city/${city.name}`}
        >
          {city.name}
        </Button>
      ))}
    </div>
  );
};

export default WorldMap;
