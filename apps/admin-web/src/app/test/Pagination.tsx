import { Button, Flex, Icon, IconButton, chakra } from '@chakra-ui/react';
import { noop, range } from 'lodash';
import { FC, PropsWithChildren, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiArrowRight, FiMoreHorizontal } from 'react-icons/fi';

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

const TheresMoreButton: FC<{ left?: boolean }> = (props) => {
  const DoubleArrow = props.left ? FiArrowLeft : FiArrowRight;
  const [hovered, setHovered] = useState(false);
  return (
    <chakra.a
      w={8}
      py={2}
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      cursor="pointer"
      textAlign="center"
    >
      {hovered ? (
        <Icon as={DoubleArrow} boxSize={7} cursor="pointer" />
      ) : (
        <Icon as={FiMoreHorizontal} boxSize={7} opacity={0.5} />
      )}
    </chakra.a>
  );
};

// TODO we should keep track of the state inside the URL
const Pagination = ({
  onNext = noop,
  onPrevious = noop,
  nextDisabled = false,
  previousDisabled = true,
  visiblePages = 1,
  activePageIndex = 0,
}) => {
  const { t } = useTranslation();
  return (
    <Flex p={50} w="full" alignItems="center" justifyContent="center">
      <Flex>
        <IconButton
          aria-label={t('Previous page')}
          onClick={onPrevious}
          isDisabled={previousDisabled}
        >
          <Icon as={FiArrowLeft} boxSize={7} />
        </IconButton>
        {range(visiblePages).map((i) => (
          <PageButton key={i} active={i === activePageIndex}>
            {i + 1}
          </PageButton>
        ))}
        <TheresMoreButton />
        <IconButton
          aria-label={t('Next page')}
          onClick={onNext}
          isDisabled={nextDisabled}
        >
          <Icon as={FiArrowRight} boxSize={7} />
        </IconButton>
      </Flex>
    </Flex>
  );
};

export default Pagination;
