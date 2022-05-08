import { AppBar, IconButton, List, MenuItem, Switch } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

export const HeaderElement = styled(AppBar)(({ theme }) => ({
  ...theme.typography.body1,
  background: theme.palette.background.default,
  boxShadow: 'none',
  borderBottom: '1px solid',
  borderColor: theme.palette.divider,
  color: theme.palette.text.primary,
}));

export const LogoElement = styled(Link)(({ theme }) => ({
  ...theme.typography.h6,
  color: theme.palette.text.primary,
  transition: theme.transitions.create(['color', 'opacity'], {
    duration: 300,
    easing: 'ease-in',
  }),
  '&:first-letter': {
    color: theme.palette.primary.main,
  },
  '&:hover': {
    color: theme.palette.text.secondary,
  },
}));

export const Burger = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(1),
  color: theme.palette.text.primary,
}));

export const ColorModeSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 30,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(30px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor:
      theme.palette.mode === 'dark' ? '#003892' : theme.palette.grey[500],
    width: 28,
    height: 28,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="21" width="21" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));

export const NotificationElement = styled(MenuItem)(({ theme }) => ({
  ...theme.typography.body1,
  position: 'relative',
  maxWidth: '100%',
  whiteSpace: 'initial',

  '& p': {
    fontSize: '16px',
  },

  '&:hover': {
    '& .MuiIconButton-root': {
      opacity: 1,
    },
  },

  '& ul': {
    ...theme.typography.caption,
    margin: 0,
    paddingLeft: theme.spacing(2),
  },

  '& a': {
    color: 'inherit',
    textDecoration: 'none',

    '&:hover': {
      textDecoration: 'underline',
    },
  },

  '& .MuiIconButton-root': {
    marginLeft: 'auto',
    opacity: 0,
    transition: theme.transitions.create('opacity', {
      duration: 200,
      easing: 'ease',
    }),
  },
}));

export const NotificationAttachmentList = styled(List)(({ theme }) => ({
  ...theme.typography.caption,
}));
