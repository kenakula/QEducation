import { Divider, Menu, MenuItem, useTheme } from '@mui/material';
import { Routes } from 'app/routes/routes';
import React from 'react';
import { NavLink } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircle from '@mui/icons-material/AccountCircle';

interface Props {
  anchor: HTMLElement | null;
  id: string;
  handleClose: () => void;
  logOut: () => void;
}

const ProfileMenu = (props: Props): JSX.Element => {
  const { anchor, id, handleClose, logOut } = props;

  const theme = useTheme();
  const isMenuOpen = Boolean(anchor);

  return (
    <Menu
      anchorEl={anchor}
      id={id}
      open={isMenuOpen}
      onClose={handleClose}
      PaperProps={{
        elevation: 0,
        sx: {
          width: '250px',
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          mt: 1.5,
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem
        component={NavLink}
        activeStyle={{
          background: theme.palette.grey[300],
          pointerEvents: 'none',
        }}
        sx={{ py: 2 }}
        to={Routes.PROFILE}
        onClick={handleClose}
      >
        <AccountCircle sx={{ mr: 1 }} />
        Профиль
      </MenuItem>
      <MenuItem
        component={NavLink}
        activeStyle={{ background: theme.palette.grey[300] }}
        disabled
        to={Routes.PROFILE}
        onClick={handleClose}
        sx={{ py: 2 }}
      >
        Настройки
      </MenuItem>
      <Divider />
      <MenuItem
        sx={{ py: 2 }}
        onClick={() => {
          handleClose();
          logOut();
        }}
      >
        <LogoutIcon color="error" sx={{ mr: 1 }} />
        Выйти
      </MenuItem>
    </Menu>
  );
};

export default ProfileMenu;
