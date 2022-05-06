import { Paper } from '@mui/material';
import { red } from '@mui/material/colors';
import { styled } from '@mui/material/styles';

export const PaperElement = styled(Paper)(({ theme }) => ({
  ...theme.typography.body1,
  position: 'absolute',
  left: '50%',
  top: '50%',
  padding: '40px 10px 30px 10px',
  width: '400px',
  transform: 'translate(-50%, -50%)',
  '& .MuiSvgIcon-root': {
    position: 'absolute',
    left: '50%',
    top: '-85px',
    transform: 'translateX(-50%)',
    fontSize: '90px',
    color: red[500],
  },
}));
