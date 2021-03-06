import React from 'react';
import ArticleIcon from '@mui/icons-material/Article';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import SendIcon from '@mui/icons-material/Send';
import QuizIcon from '@mui/icons-material/Quiz';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import {
  EntityModel,
  NotificationAttachment,
  NotificationSeverety,
} from 'app/constants/notification-model';

export const getNotificationIcon = (
  attachment: NotificationAttachment | null | undefined,
  severety: NotificationSeverety,
  size: 'small' | 'large' | 'medium' = 'small',
): JSX.Element => {
  if (!attachment) {
    return <CircleNotificationsIcon fontSize={size} color="primary" />;
  }

  switch (attachment.entity) {
    case EntityModel.Article:
      return <ArticleIcon color={severety} fontSize={size} />;
    case EntityModel.Checklist:
      return <PlaylistAddCheckCircleIcon color={severety} fontSize={size} />;
    case EntityModel.Script:
      return <SendIcon color={severety} fontSize={size} />;
    case EntityModel.Test:
      return <QuizIcon color={severety} fontSize={size} />;
    default:
      return <PriorityHighIcon color="error" fontSize={size} />;
  }
};
