import { Box, IconButton, ListItemIcon, Typography, Link } from '@mui/material';
import {
  NotificationAttachment,
  NotificationModel,
} from 'app/constants/notification-model';
import React from 'react';
import { NotificationElement } from './styled-elements';
import CloseIcon from '@mui/icons-material/Close';
import { NavLink } from 'react-router-dom';
import { getNotificationIcon } from './get-notification-icon';

interface Props {
  note: NotificationModel;
  handleRead: (note: NotificationModel) => void;
}

const NotificationItem = (props: Props): JSX.Element => {
  const { note, handleRead } = props;

  const renderAttachment = (
    attachment: NotificationAttachment,
  ): JSX.Element => (
    <ul>
      {attachment.links.map(item => (
        <li key={item.link}>
          <Link component={NavLink} to={item.link}>
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <NotificationElement divider>
      <ListItemIcon>
        {getNotificationIcon(note.attachment, note.severety)}
      </ListItemIcon>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography>{note.message}</Typography>
        {note.attachment ? renderAttachment(note.attachment) : null}
      </Box>
      <IconButton onClick={() => handleRead(note)} size="small" color="error">
        <CloseIcon fontSize="small" />
      </IconButton>
    </NotificationElement>
  );
};

export default NotificationItem;
