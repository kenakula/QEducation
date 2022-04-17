import { Box, styled } from '@mui/material';

export const ItemList = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(1),
  paddingLeft: theme.spacing(5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '& > span': {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    ...theme.typography.h6,
    color: theme.palette.grey[500],
  },
}));
