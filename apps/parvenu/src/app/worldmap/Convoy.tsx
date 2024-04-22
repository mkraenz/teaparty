import { Box, IconButton } from '@chakra-ui/react';
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
    <Box
      // HACK: using inline styles to bypass chakra trying to create styles in the html head which seems to cause laggy animation. Though sometimes it's still laggy with this approach.
      style={{
        top: `${convoy.pos.y}px`,
        left: `${convoy.pos.x}px`,
        position: 'absolute',
      }}
    >
      <IconButton
        variant={'outline'}
        position={'relative'}
        left={'-50%'}
        top={'-21px'}
        onClick={handleSelect}
        icon={<MdSailing />}
        aria-label={convoy.label}
        isActive={selector.selected === id}
        backgroundColor={'transparent'}
      />
    </Box>
  );
};

export default Convoy;
