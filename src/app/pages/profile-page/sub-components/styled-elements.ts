import { Avatar, Box, Stack, styled } from '@mui/material';

export const ProfileInfoSection = styled(Box)(({ theme }) => ({
  padding: `${theme.spacing(4)} 0`,
}));

export const PhotoContainer = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: `${theme.spacing(2)} 0`,
}));

export const UserPhoto = styled(Avatar)(({ theme }) => ({
  width: '150px',
  height: '150px',
  marginBottom: theme.spacing(2),

  '.MuiSvgIcon-root': {
    width: '100%',
    height: '100%',
  },
  [theme.breakpoints.up('md')]: {
    width: '200px',
    height: '200px',
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
