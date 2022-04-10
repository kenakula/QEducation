import { Avatar, Badge, Box, Button, IconButton } from '@mui/material';
import { AuthStates } from 'app/constants/auth-state';
import { Routes } from 'app/routes/routes';
import { useAuthStore } from 'app/stores/auth-store/auth-store';
import { stringToColor } from 'app/utils/color-helpers';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ProfileMenu from './profile-menu';

interface Props {
  menuId: string;
}

const HeaderControls = observer((props: Props): JSX.Element | null => {
  const { menuId } = props;
  const { authState, userInfo, logOut } = useAuthStore();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
  ): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = (): void => {
    setAnchorEl(null);
  };

  const handleLogout = (): void => {
    if (logOut) {
      logOut();
    }
  };

  switch (authState) {
    case AuthStates.Authorized:
      return (
        <Box sx={{ marginLeft: 'auto' }}>
          <IconButton
            size="small"
            aria-label="show 4 new mails"
            color="default"
          >
            <Badge badgeContent={0} color="error">
              <MailIcon />
            </Badge>
          </IconButton>
          <IconButton
            size="small"
            aria-label="show 17 new notifications"
            color="default"
            sx={{ mr: 2 }}
          >
            <Badge badgeContent={0} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          {userInfo ? (
            <>
              <IconButton
                size="small"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="default"
              >
                <Avatar
                  sx={{
                    width: 30,
                    height: 30,
                    backgroundColor: stringToColor(userInfo.firstName),
                    fontSize: 18,
                  }}
                >
                  {userInfo.firstName[0]}
                </Avatar>
              </IconButton>
              <ProfileMenu
                anchor={anchorEl}
                id={menuId}
                handleClose={handleProfileMenuClose}
                logOut={handleLogout}
              />
            </>
          ) : null}
        </Box>
      );
    case AuthStates.NotAuthorized:
      return (
        <Button
          variant="outlined"
          color="inherit"
          component={NavLink}
          to={Routes.SIGN_IN}
          activeClassName="Mui-disabled"
          sx={{ ml: 'auto' }}
        >
          Войти
        </Button>
      );
    default:
      return null;
  }
});

export default HeaderControls;
