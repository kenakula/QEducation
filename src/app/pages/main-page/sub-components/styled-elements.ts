import { TabPanel } from '@mui/lab';
import { Box, Grid, List, ListItem, Paper, styled } from '@mui/material';

export const CategoriesSection = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    padding: `${theme.spacing(5)} 0`,
  },
}));

export const TabItemPanel = styled(TabPanel)(() => ({
  padding: '0 0 40px 0',
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

export const AdminToolsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row-reverse',
  marginBottom: theme.spacing(3),
}));

export const VideoThumbnail = styled(Paper)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
  transition: theme.transitions.create('transform', {
    duration: 200,
    easing: 'ease-in',
  }),
  transformOrigin: 'center',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

export const VideoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  padding: theme.spacing(2),
  '& iframe': {
    maxWidth: '100%',
  },
}));
