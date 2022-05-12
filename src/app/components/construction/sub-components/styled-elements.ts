import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ComponentContainer = styled(Box)(() => ({
  width: '250px',
  height: '250px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));
