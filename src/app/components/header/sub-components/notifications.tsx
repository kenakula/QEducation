import {
  Menu,
  MenuItem,
  Button,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Box,
  ListItemIcon,
} from '@mui/material';
import { NotificationModel } from 'app/constants/notification-model';
import { useMainPageStore } from 'app/stores/main-page-store/main-page-store';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import NotificationItem from './notification-item';
import { getNotificationIcon } from './get-notification-icon';
import { NotificationAttachmentComponent } from './notification-attachment';
import DeleteForever from '@mui/icons-material/DeleteForever';
import { SnackbarAlert } from 'app/components/snackbar-alert';
import { SnackBarStateProps } from 'app/constants/snackbar-state-props';
import { ModalDialog } from 'app/components/modal-dialog';

interface Props {
  anchor: HTMLElement | null;
  id: string;
  handleClose: () => void;
  notifications: NotificationModel[];
}

const Notifications = observer((props: Props): JSX.Element => {
  const { anchor, id, handleClose } = props;
  const store = useMainPageStore();

  const [snackbarState, setSnackbarState] = useState<SnackBarStateProps>({
    isOpen: false,
    message: 'Уведомление удалено',
    alert: 'error',
  });
  const [dialogOpenState, setDialogOpenState] = useState<boolean>(false);

  const handleDialogClose = (): void => {
    setDialogOpenState(false);
  };

  const handleDialogOpen = (): void => {
    setDialogOpenState(true);
    store.notifications
      .filter(item => !item.read)
      .forEach(item => {
        store.readNotification(item.id);
      });
  };

  const handleItemRead = (item: NotificationModel): void => {
    if (!item.read) {
      store.readNotification(item.id);
    }
  };

  const handleDeleteNotification = (notificationId: string): void => {
    store.removeNotification(notificationId).then(() => {
      setSnackbarState(prev => ({ ...prev, isOpen: true }));
    });
  };

  const renderNewNotifications = (): JSX.Element[] | JSX.Element => {
    const arr = store.notifications.filter(item => !item.read);

    if (arr.length) {
      return arr.map(item => (
        <NotificationItem
          handleRead={handleItemRead}
          key={item.id}
          note={item}
        />
      ));
    }

    return <MenuItem sx={{ py: 4 }}>Нет новых уведомлений</MenuItem>;
  };

  const isMenuOpen = Boolean(anchor);

  return (
    <>
      <Menu
        anchorEl={anchor}
        id={id}
        open={isMenuOpen}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: '250px',
            overflow: 'visible',
            mt: 1.5,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {renderNewNotifications()}

        <MenuItem
          sx={{
            justifyContent: 'center',
            '&:hover': { background: 'transparent' },
          }}
        >
          <Button
            size="small"
            color="inherit"
            fullWidth
            onClick={() => {
              handleClose();
              handleDialogOpen();
            }}
          >
            Смотреть все
          </Button>
        </MenuItem>
      </Menu>
      <ModalDialog
        isOpen={dialogOpenState}
        handleClose={handleDialogClose}
        title="Уведомления"
        closeText="Закрыть"
      >
        {store.notifications.length ? (
          <List>
            {store.notifications
              .slice()
              .reverse()
              .map(item => (
                <ListItem divider key={item.id}>
                  <ListItemAvatar>
                    {getNotificationIcon(
                      item.attachment,
                      item.severety,
                      'large',
                    )}
                  </ListItemAvatar>
                  <Box>
                    <ListItemText
                      primary={item.message}
                      secondary={item.sentDate.toDate().toLocaleDateString()}
                    />
                    {item.attachment ? (
                      <NotificationAttachmentComponent
                        attachment={item.attachment}
                      />
                    ) : null}
                  </Box>
                  <ListItemIcon sx={{ ml: 'auto' }}>
                    <IconButton
                      onClick={() => handleDeleteNotification(item.id)}
                    >
                      <DeleteForever color="error" />
                    </IconButton>
                  </ListItemIcon>
                </ListItem>
              ))}
          </List>
        ) : (
          <Typography variant="h6" sx={{ py: 4 }} textAlign="center">
            Нет уведомлений
          </Typography>
        )}
      </ModalDialog>
      <SnackbarAlert {...snackbarState} setState={setSnackbarState} />
    </>
  );
});

export default Notifications;
