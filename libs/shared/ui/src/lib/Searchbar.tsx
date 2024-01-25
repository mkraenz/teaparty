import { SearchIcon } from '@chakra-ui/icons';
import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react';
import React, { ComponentProps, FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  onSearch: (query: string) => void;
  maxW: ComponentProps<typeof InputGroup>['maxW'];
};

export const Searchbar: FC<Props> = ({ onSearch, maxW }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const onClick = () => onSearch(query);

  return (
    <InputGroup maxW={maxW}>
      <InputLeftElement pointerEvents="none">
        <SearchIcon />
      </InputLeftElement>
      <Input
        placeholder={t('search')}
        type={'search'}
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
      />
      <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={onClick}>
          {t('search')}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};

export default Searchbar;
