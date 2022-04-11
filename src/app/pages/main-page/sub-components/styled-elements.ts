import { TabPanel } from '@mui/lab';
import { Box, Grid, List, ListItem, styled } from '@mui/material';

export const CategoriesSection = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    padding: `${theme.spacing(5)} 0`,
  },
}));

export const TabItemPanel = styled(TabPanel)(() => ({
  padding: 0,
}));

export const ImageContainer = styled(Box)(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.up('sm')]: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export const CategoriesContainer = styled(List)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2),
  gridTemplateColumns: '1fr 1fr',
  gridAutoRows: '90px',
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

  '&:hover': {
    boxShadow: theme.shadows[5],
  },

  '&:active': {
    opacity: '0.7',
  },

  '& span': {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '3px',
    backgroundColor: theme.palette.grey[300],
  },
}));
