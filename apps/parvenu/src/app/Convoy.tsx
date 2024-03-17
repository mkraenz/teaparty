import { IconButton } from '@chakra-ui/react';
import { FC, MouseEventHandler } from 'react';
import { MdSailing } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useConvoy } from './GameProvider';
import { useConvoySelector } from './SelectionProvider';

type Props = {
  id: string;
};

const Convoy: FC<Props> = ({ id }) => {
  const convoy = useConvoy(id);
  const nav = useNavigate();
  const selector = useConvoySelector();
  if (!convoy) return null;
  const handleSelect: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    if (selector.selected === convoy.id) {
      return nav(`/convoys/${convoy.id}`);
    } else {
      selector.setSelected(convoy.id);
    }
  };
  return (
    <IconButton
      onClick={handleSelect}
      onDoubleClick={() => convoy.setTarget({ x: 115, y: 700 })}
      // as={Link}
      // to={`/convoys/${convoy.id}`}
      icon={<MdSailing />}
      aria-label={convoy.label}
      pos={'absolute'}
      top={convoy.pos.y}
      left={convoy.pos.x}
    />
  );
};

export default Convoy;
