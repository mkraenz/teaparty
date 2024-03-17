import { IconButton } from '@chakra-ui/react';
import { FC } from 'react';
import { MdSailing } from 'react-icons/md';
import { Point } from '../domain/types';
import { useWorld } from './GameProvider';

type Props = {
  label: string;
  id: string;
  pos: Point;
};

const Convoy: FC<Props> = ({ id, label, pos }) => {
  const world = useWorld();
  return (
    <IconButton
      onClick={() => world.passTime(1000)}
      // as={Link}
      // to={`/convoys/${id}`}
      icon={<MdSailing />}
      aria-label={label}
      pos={'absolute'}
      top={pos.y}
      left={pos.x}
    />
  );
};

export default Convoy;
