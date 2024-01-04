import { HStack } from '@chakra-ui/react';
import { FC } from 'react';
// import ThemeToggleButton from '../common/components/ThemeToggleButton';
// TODO

const LoginAppbar: FC = () => {
  return (
    <HStack justify={'flex-end'} minW={'full'} paddingEnd={4} pt={4}>
      {/* <ThemeToggleButton /> */}
    </HStack>
  );
};

export default LoginAppbar;
