import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const LoaderContainer = styled(Box)(({ theme }) => ({
  ...theme.typography.body1,

  '& div::after': {
    background: theme.palette.text.primary,
  },
}));
