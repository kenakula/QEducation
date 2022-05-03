import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const Banner = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  '& .MuiBox-root': {
    maxWidth: '400px',

    svg: {
      maxWidth: '100%',
    },
  },
}));
