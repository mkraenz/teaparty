import { Button } from '@chakra-ui/react';
import { FC, MouseEventHandler } from 'react';
import { Link } from 'react-router-dom';
import { useCity } from './GameProvider';

type Props = {
  id: string;
  onContextMenu: MouseEventHandler<HTMLButtonElement>;
};

const City: FC<Props> = ({ id, onContextMenu }) => {
  const city = useCity(id);
  return (
    <Button
      key={city.id}
      pos={'absolute'}
      top={city.pos.y + 23}
      left={city.pos.x - 18}
      as={Link}
      to={`/cities/${city.id}`}
      onContextMenu={onContextMenu}
    >
      {city.label}
    </Button>
  );
};

export default City;
