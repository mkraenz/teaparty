import { Button } from '@chakra-ui/react';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { World } from '../domain/world';

type Props = {
  world: World;
};

const WorldMap: FC<Props> = ({ world }) => {
  return (
    <div>
      {world.citiesList.map((city) => (
        <Button
          key={city.name}
          pos={'absolute'}
          top={city.position.y}
          left={city.position.x}
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
