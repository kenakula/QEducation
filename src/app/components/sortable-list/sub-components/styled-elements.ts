import { Box, styled } from '@mui/material';

interface ItemListProps {
  exluded: boolean;
}

export const ItemList = styled(Box)<ItemListProps>(({ theme, exluded }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '& > .MuiBox-root': {
    opacity: exluded ? '0.3' : '1',
    textDecoration: exluded ? 'line-through' : 'none',
  },
  '& > span': {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    ...theme.typography.h6,
    color: theme.palette.grey[500],
  },
  '& > svg': {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    color: theme.palette.grey[500],
    cursor: 'grab',
  },
}));
