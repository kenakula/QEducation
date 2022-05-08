import { Link, ListItem } from '@mui/material';
import { NotificationAttachment } from 'app/constants/notification-model';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { NotificationAttachmentList } from './styled-elements';

interface Props {
  attachment: NotificationAttachment;
}

export const NotificationAttachmentComponent = (props: Props): JSX.Element => (
  <NotificationAttachmentList dense>
    {props.attachment.links.map(item => (
      <ListItem key={item.link}>
        <Link component={NavLink} to={item.link} target="_blank">
          {item.title}
        </Link>
      </ListItem>
    ))}
  </NotificationAttachmentList>
);
