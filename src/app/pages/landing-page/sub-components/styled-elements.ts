import { Box, styled } from '@mui/material';

export const PromoBlock = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: `${theme.spacing(2)} 0`,
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: `${theme.spacing(6)} 0`,
  },
  [theme.breakpoints.up('lg')]: {
    padding: `${theme.spacing(6)} ${theme.spacing(4)}`,
  },

  '& > .MuiButton-root': {
    alignSelf: 'flex-start',
  },

  '.MuiTypography-h2': {
    ...theme.typography.h4,
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      ...theme.typography.h3,
      marginBottom: theme.spacing(3),
    },
  },

  '.MuiTypography-body1': {
    ...theme.typography.body1,
    marginBottom: theme.spacing(2),
    a: {
      color: theme.palette.primary.main,
      transition: theme.transitions.create(['color', 'opacity'], {
        duration: 300,
        easing: 'ease-in',
      }),
      '&:hover': {
        color: theme.palette.primary.dark,
      },
    },

    [theme.breakpoints.up('md')]: {
      ...theme.typography.h5,
    },
  },

  '& svg': {
    flexShring: 0,
    width: '100%',
    height: 'auto',
  },
}));
