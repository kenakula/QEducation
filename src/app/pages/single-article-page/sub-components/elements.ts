import { Grid, styled } from '@mui/material';

export const AsideEl = styled(Grid)(({ theme }) => ({
  order: '-1',
  [theme.breakpoints.up('md')]: {
    order: 'initial',
  },
}));
