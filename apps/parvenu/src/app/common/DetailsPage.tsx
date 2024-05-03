import { Box } from '@chakra-ui/react';
import { FC, PropsWithChildren } from 'react';
import { useNavigateBack } from '../hooks/useNavigateHome';

const DetailsPage: FC<PropsWithChildren> = ({ children }) => {
  const navHome = useNavigateBack();

  return (
    <Box onContextMenu={navHome} h={'98vh'}>
      {children}
    </Box>
  );
};

export default DetailsPage;
