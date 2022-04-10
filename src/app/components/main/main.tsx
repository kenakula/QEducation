import { Box } from '@mui/material';
import { useAuthStore } from 'app/stores/auth-store/auth-store';
import React from 'react';
import Container from '../container/container';
import DrawerContent from '../header/sub-components/drawer-content';
import { Aside } from './sub-components/styled-elements';

interface Props {
  children: JSX.Element | JSX.Element[];
}

const Main = (props: Props): JSX.Element => {
  const { children } = props;
  const { userInfo } = useAuthStore();

  return (
    <Container sx={{ display: 'flex', flexGrow: 1 }}>
      <Aside component="aside">
        <DrawerContent isAdmin={userInfo ? userInfo.isSuperAdmin : undefined} />
      </Aside>
      <Box component="main" sx={{ width: '100%', paddingTop: '40px' }}>
        {children}
      </Box>
    </Container>
  );
};

export default Main;
