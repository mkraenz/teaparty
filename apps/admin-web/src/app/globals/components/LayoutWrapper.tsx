import { HStack, useDisclosure } from '@chakra-ui/react';
import { LogoutButton } from '@teaparty/react-firebase-auth';
import { Layout } from '@teaparty/shared-ui';
import { FC, PropsWithChildren } from 'react';

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
            {/* <ThemeToggleButton />
                  <ChangeLanguageButton /> */}
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
