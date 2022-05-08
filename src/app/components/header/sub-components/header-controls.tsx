/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, Badge, Box, Button, IconButton } from '@mui/material';
import { AuthStates } from 'app/constants/auth-state';
import { Routes } from 'app/routes/routes';
import { useAuthStore } from 'app/stores/auth-store/auth-store';
import { stringToColor } from 'app/utils/color-helpers';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ProfileMenu from './profile-menu';
import { useMainPageStore } from 'app/stores/main-page-store/main-page-store';
import Notifications from './notifications';

const HeaderControls = observer((): JSX.Element | null => {
  const { authState, userInfo, logOut } = useAuthStore();
  const store = useMainPageStore();

  const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null);
  const [anchorNotifications, setAnchorNotifications] =
    useState<null | HTMLElement>(null);

  useEffect(() => {
    if (store.profileInfo) {
      store.getUserImage();
    }
  }, [store.profileInfo]);

  const handleProfileMenuOpen = ({
    currentTarget,
  }: React.MouseEvent<HTMLElement>): void => {
    setAnchorMenu(currentTarget);
  };

  const handleProfileMenuClose = (): void => {
    setAnchorMenu(null);
  };

  const handleNotificationsOpen = ({
    currentTarget,
  }: React.MouseEvent<HTMLElement>): void => {
    setAnchorNotifications(currentTarget);
  };

  const handleNotificationsClose = (): void => {
    setAnchorNotifications(null);
  };

  const handleLogout = (): void => {
    if (logOut) {
      logOut();
      store.dispose();
    }
  };

  const getNotReadNotificationsCount = (): number =>
    store.notifications.filter(item => !item.read).length;

  switch (authState) {
    case AuthStates.Authorized:
      return (
        <Box sx={{ marginLeft: 'auto' }}>
          <IconButton
            size="small"
            color="default"
            sx={{ mr: 2 }}
            onClick={handleNotificationsOpen}
          >
            <Badge
              variant="dot"
              badgeContent={getNotReadNotificationsCount()}
              color="error"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            size="small"
            edge="end"
            onClick={handleProfileMenuOpen}
            color="default"
          >
            {userInfo && (
              <Avatar
                sx={{
                  width: 30,
                  height: 30,
                  backgroundColor: stringToColor(userInfo.firstName),
                  fontSize: 18,
                }}
                src={store.profileImageUrl}
              >
                {userInfo.firstName[0]}
              </Avatar>
            )}
          </IconButton>
          <ProfileMenu
            anchor={anchorMenu}
            id="profile-menu"
            handleClose={handleProfileMenuClose}
            logOut={handleLogout}
          />
          {store.notifications && (
            <Notifications
              anchor={anchorNotifications}
              id="notifications"
              handleClose={handleNotificationsClose}
              notifications={store.notifications}
            />
          )}
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
