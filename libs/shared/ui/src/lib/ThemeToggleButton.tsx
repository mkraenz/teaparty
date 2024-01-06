import {
  Icon,
  IconButton,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FiMoon, FiSun } from 'react-icons/fi';

export const ThemeToggleButton: FC = () => {
  const { t } = useTranslation();
  const { toggleColorMode } = useColorMode();
  const icon = useColorModeValue(FiMoon, FiSun);

  return (
    <IconButton
      icon={<Icon as={icon} />}
      aria-label={t('Toggle theme')}
      onClick={toggleColorMode}
      variant={'outline'}
    />
  );
};

export default ThemeToggleButton;
