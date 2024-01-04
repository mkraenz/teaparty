import { Grid, GridItem } from '@chakra-ui/react';
import type { FC, PropsWithChildren } from 'react';
import Navbar, { NavbarProps } from './Navbar';

export const Layout: FC<PropsWithChildren & { navbarProps: NavbarProps }> = ({
  children,
  navbarProps,
}) => {
  return (
    <Grid
      templateAreas={{
        md: `"nav main"`,
        base: `"nav"
                "main"`,
      }}
      gridTemplateRows={{ md: '1fr', base: 'fit-content(20px) 1fr' }}
      gridTemplateColumns={{ md: 'fit-content(0px) 1fr', base: '1fr' }}
      gap="1"
      minH={'100vh'}
    >
      <GridItem area={'nav'}>
        <Navbar {...navbarProps} />
      </GridItem>
      <GridItem area={'main'} padding={4}>
        {children}
      </GridItem>
    </Grid>
  );
};

export default Layout;
