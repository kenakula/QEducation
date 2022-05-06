import { Box, styled } from '@mui/material';

export const Aside = styled(Box)(({ theme }) => ({
  display: 'none',
  marginRight: theme.spacing(2),
  width: '200px',
  [theme.breakpoints.up('lg')]: {
    display: 'block',
    flexShrink: 0,
  },
}));

export const MainElement = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: `${theme.spacing(2)} 0`,
  width: '100%',
}));
