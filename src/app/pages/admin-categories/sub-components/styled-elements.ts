import { Box, List, ListItem, styled } from '@mui/material';

export const CategoriesContainer = styled(List)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2),
  gridTemplateColumns: '1fr 1fr',
  gridAutoRows: '90px',
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: '1fr 1fr 1fr',
  },
}));

export const CategoryItem = styled(ListItem)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderRadius: '8px',
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,
  textAlign: 'center',
  transition: theme.transitions.create(['box-shadow', 'opacity'], {
    duration: 200,
    easing: 'ease-in',
  }),
  cursor: 'pointer',

  '&:active': {
    opacity: '0.7',
  },

  '& > span': {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '3px',
    backgroundColor: theme.palette.grey[300],
  },

  '& > button': {
    position: 'absolute',
    opacity: 0,
    transition: theme.transitions.create('opacity', {
      duration: 200,
      easing: 'ease-in',
    }),
  },

  '& > button:first-of-type': {
    right: '5px',
    top: '5px',
  },

  '& > button:last-of-type': {
    right: '5px',
    bottom: '5px',
  },

  '&:hover': {
    boxShadow: theme.shadows[5],

    '& > button': {
      opacity: 1,
    },
  },
}));

export const InfoBox = styled(Box)(({ theme }) => ({
  ...theme.typography.body1,
  display: 'flex',
  flexDirection: 'column',
  '& .MuiBox-root': {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),

    '& .MuiTypography-root': {
      marginRight: theme.spacing(4),
    },

    '& .MuiBox-root': {
      flexGrow: 1,
    },
  },
  '& .MuiTypography-h6': {
    fontSize: '1rem',
  },
}));
