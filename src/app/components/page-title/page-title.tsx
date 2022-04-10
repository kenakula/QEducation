import { styled, Typography } from '@mui/material';

export const PageTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.h5,
  marginBottom: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    ...theme.typography.h4,
  },
}));
