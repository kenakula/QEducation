import React, { useState } from 'react';
import { useAuthStore } from 'app/stores/auth-store/auth-store';
import {
  Burger,
  HeaderElement,
  LogoElement,
} from './sub-components/styled-elements';
import { Routes } from 'app/routes/routes';
import { AuthStates } from 'app/constants/auth-state';
import { Skeleton, SwipeableDrawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { observer } from 'mobx-react-lite';
import HeaderControls from './sub-components/header-controls';
import { drawerWidth } from './sub-components/main-nav';
import DrawerContent from './sub-components/drawer-content';
import { Container } from '../container';

export const Header = observer((): JSX.Element => {
  const { authState, userInfo } = useAuthStore();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = (): void => {
    setMobileOpen(!mobileOpen);
  };

  const container =
    window !== undefined ? () => window.document.body : undefined;

  return (
    <HeaderElement position="static">
      <Container sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
        {authState === AuthStates.Processing ? (
          <Skeleton variant="rectangular" width="100%" height={43} />
        ) : authState === AuthStates.Authorized ? (
          <>
            <Burger
              aria-label="Открыть меню"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { lg: 'none' } }}
            >
              <MenuIcon />
            </Burger>
            <LogoElement to={Routes.MAIN}>QEducation</LogoElement>
            <HeaderControls />
          </>
        ) : (
          <>
            <LogoElement to={Routes.MAIN}>QEducation</LogoElement>
            <HeaderControls />
          </>
        )}
        <SwipeableDrawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          onOpen={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          <DrawerContent
            onClose={handleDrawerToggle}
            isAdmin={userInfo?.isSuperAdmin}
          />
        </SwipeableDrawer>
      </Container>
    </HeaderElement>
  );
});
