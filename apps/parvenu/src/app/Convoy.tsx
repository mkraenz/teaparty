import { IconButton } from '@chakra-ui/react';
import { FC } from 'react';
import { MdSailing } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { Point } from '../domain/types';

type Props = {
  label: string;
  id: string;
  pos: Point;
};

const Convoy: FC<Props> = ({ id, label, pos }) => {
  return (
    <IconButton
      as={Link}
      to={`/convoys/${id}`}
      icon={<MdSailing />}
      aria-label={label}
      pos={'absolute'}
      top={pos.y}
      left={pos.x}
    />
  );
};

export default Convoy;
