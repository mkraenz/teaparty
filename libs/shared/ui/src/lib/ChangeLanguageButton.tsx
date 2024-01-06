import {
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FiGlobe } from 'react-icons/fi';

export type ChangeLanguageButtonProps = {
  activeLanguages: readonly (typeof languages)[number]['code'][];
};

const languages = [
  {
    nameInTargetLanguage: 'English',
    code: 'en',
    flag: '🇬🇧',
  },
  {
    nameInTargetLanguage: 'Deutsch',
    code: 'de',
    flag: '🇩🇪',
  },
] as const;

export const ChangeLanguageButton: FC<ChangeLanguageButtonProps> = ({
  activeLanguages,
}) => {
  const {
    t,
    i18n: { changeLanguage },
  } = useTranslation();
  const usedLanguages = languages.filter(({ code }) =>
    activeLanguages.includes(code)
  );

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label={t('changeLanguage')}
        icon={<Icon as={FiGlobe} fontSize={'xl'} />}
        variant="outline"
      />
      <MenuList>
        {usedLanguages.map(({ nameInTargetLanguage, code, flag }) => (
          <MenuItem key={code} onClick={() => changeLanguage(code)}>
            {flag} {nameInTargetLanguage}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default ChangeLanguageButton;
