import { ArrowRightIcon } from '@chakra-ui/icons';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Icon,
  IconButton,
  Stack,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import type { FC, ReactNode } from 'react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FiBell, FiCode } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

const homeRoute = '/';
const navData = [
  { nameTKey: 'Subscriptions', href: '/subscriptions', icon: FiBell },
  { nameTKey: 'Functions', href: '/functions', icon: FiCode },
] satisfies {
  nameTKey: string;
  href: string;
  icon: unknown;
  withDividerTop?: true;
}[];

export type NavbarProps = {
  onClose: VoidFunction;
  onOpen: VoidFunction;
  isOpen: boolean;
  bottom?: ReactNode;
};

const Navbar: FC<NavbarProps> = ({ onClose, onOpen, isOpen, bottom }) => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const location = useLocation();
  const btnRef = useRef<HTMLButtonElement>(null);
  const routeHoverBg = useColorModeValue('blue.200', 'blue.700');
  const activeRouteBg = useColorModeValue('blue.100', 'blue.800');

  const handleClick = (href: string) => {
    nav(href);
    onClose();
  };
  return (
    <>
      <Tooltip label={t('asdf')}>
        <IconButton
          icon={<ArrowRightIcon />}
          aria-label={t('openDrawerNav')}
          ref={btnRef}
          onClick={onOpen}
          m={2}
          mt={4}
        />
      </Tooltip>
      <Drawer
        isOpen={isOpen}
        placement={'left'}
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton aria-label={t('closeDrawerNav')} />
          <DrawerHeader
            cursor={'pointer'}
            onClick={() => handleClick(homeRoute)}
          >
            {t('appName')}
          </DrawerHeader>

          <DrawerBody>
            <Stack alignItems={'flex-start'}>
              {navData.map((item) => (
                <Stack
                  key={item.nameTKey}
                  width={'full'}
                  align={'flex-start'}
                  onClick={() => handleClick(item.href)}
                  as={'a'}
                >
                  <Button
                    variant="nav"
                    key={item.nameTKey}
                    leftIcon={<Icon as={item.icon} boxSize={6} />}
                    width={'full'}
                    justifyContent={'flex-start'}
                    bg={
                      location.pathname === item.href
                        ? activeRouteBg
                        : undefined
                    }
                    _hover={{ bg: routeHoverBg }}
                  >
                    {t(item.nameTKey)}
                  </Button>
                </Stack>
              ))}
            </Stack>
          </DrawerBody>
          <DrawerFooter borderTopWidth="1px">
            <HStack>{bottom}</HStack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Navbar;
