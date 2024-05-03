import { IconButton } from '@chakra-ui/react';
import { FC } from 'react';
import { FiGlobe } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useNavigateToHomeOnEscape } from '../hooks/useNavigateToHomeOnEscape';

const ToWorldmapButton: FC = () => {
  useNavigateToHomeOnEscape();
  return (
    <IconButton aria-label="Open map" icon={<FiGlobe />} as={Link} to={'/'} />
  );
};

export default ToWorldmapButton;
