import { Avatar, Box, ListItem, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const InfoContainer = styled(Box)(({ theme }) => ({
  ...theme.typography.body1,
  display: 'flex',
  flexDirection: 'column',
}));

export const InfoListItem = styled(ListItem)(({ theme }) => ({
  ...theme.typography.body1,
  display: 'flex',
}));

export const InfoListLabel = styled(Typography)(({ theme }) => ({
  ...theme.typography.body1,
  minWidth: '110px',
}));

export const UserPhoto = styled(Avatar)(({ theme }) => ({
  margin: '0 auto',
  width: '150px',
  height: '150px',
  '.MuiSvgIcon-root': {
    width: '100%',
    height: '100%',
  },
  [theme.breakpoints.up('md')]: {
    width: '200px',
    height: '200px',
  },
}));

export const StackItem = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export const CategoryProgress = styled(Box)(({ theme }) => ({
  ...theme.typography.body1,
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  '& > .MuiBox-root': {
    textAlign: 'center',
    padding: `0 ${theme.spacing(1)}`,
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
      alignItems: 'center',
    },
    '& .MuiTypography-body2': {
      marginLeft: theme.spacing(2),
    },
  },
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: '1fr 2fr',
  },
}));
