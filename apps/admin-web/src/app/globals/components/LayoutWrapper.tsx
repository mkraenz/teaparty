import { HStack, useDisclosure } from '@chakra-ui/react';
import { LogoutButton } from '@teaparty/react-firebase-auth';
import {
  ChangeLanguageButton,
  Layout,
  ThemeToggleButton,
} from '@teaparty/shared-ui';
import { FC, PropsWithChildren } from 'react';

const languages = ['en', 'de'] as const;

const LayoutWrapper: FC<PropsWithChildren> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Layout
      navbarProps={{
        isOpen,
        onClose,
        onOpen,
        bottom: (
          <HStack>
            <ThemeToggleButton />
            <ChangeLanguageButton activeLanguages={languages} />
            <LogoutButton afterSignout={() => undefined} />
          </HStack>
        ),
      }}
    >
      {children}
    </Layout>
  );
};

export default LayoutWrapper;
