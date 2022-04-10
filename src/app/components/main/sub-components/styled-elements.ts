import { Box, styled } from '@mui/material';
import { drawerWidth } from 'app/components/header/sub-components/main-nav';

export const Aside = styled(Box)(({ theme }) => ({
  display: 'none',
  marginRight: theme.spacing(2),
  width: drawerWidth,
  [theme.breakpoints.up('lg')]: {
    display: 'block',
    flexShrink: 0,
  },
}));
