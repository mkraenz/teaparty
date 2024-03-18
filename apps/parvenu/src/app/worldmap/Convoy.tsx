import { IconButton } from '@chakra-ui/react';
import { FC, MouseEventHandler } from 'react';
import { MdSailing } from 'react-icons/md';
import { useConvoySelector } from '../SelectionProvider';
import { useConvoy } from '../general/GameProvider';

type Props = {
  id: string;
};

const Convoy: FC<Props> = ({ id }) => {
  const convoy = useConvoy(id);
  const selector = useConvoySelector();
  if (!convoy) return null;
  const handleSelect: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    selector.setSelectedWithNavEffect(convoy.id);
  };
  return (
    <IconButton
      onClick={handleSelect}
      icon={<MdSailing />}
      aria-label={convoy.label}
      pos={'absolute'}
      top={convoy.pos.y}
      left={convoy.pos.x}
      isActive={selector.selected === id}
    />
  );
};

export default Convoy;
