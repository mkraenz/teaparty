import { Button, Flex, Icon, IconButton } from '@chakra-ui/react';
import { FC, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

const activeStyle = {
  bg: 'brand.600',
  _dark: {
    bg: 'brand.500',
  },
  color: 'white',
};

const PageButton: FC<
  PropsWithChildren<{ disabled?: boolean; active?: boolean }>
> = ({ disabled = false, children, active }) => {
  return (
    <Button
      mx={1}
      px={4}
      py={2}
      rounded="md"
      bg="white"
      _dark={{
        bg: 'gray.800',
      }}
      color="gray.700"
      opacity={disabled ? 0.6 : undefined}
      _hover={disabled ? undefined : activeStyle}
      cursor={disabled ? 'not-allowed' : undefined}
      {...(active && activeStyle)}
    >
      {children}
    </Button>
  );
};

const Pagination = () => {
  const { t } = useTranslation();
  return (
    <Flex p={50} w="full" alignItems="center" justifyContent="center">
      <Flex>
        <IconButton aria-label={t('Previous page')}>
          <Icon
            as={FiArrowLeft}
            color="gray.700"
            _dark={{
              color: 'gray.200',
            }}
            boxSize={4}
          />
        </IconButton>
        <PageButton>1</PageButton>
        <PageButton active>2</PageButton>
        <PageButton>3</PageButton>
        <PageButton>4</PageButton>
        <PageButton>5</PageButton>
        <IconButton aria-label={t('Next page')}>
          <Icon
            as={FiArrowRight}
            color="gray.700"
            _dark={{
              color: 'gray.200',
            }}
            boxSize={4}
          />
        </IconButton>
      </Flex>
    </Flex>
  );
};

export default Pagination;
