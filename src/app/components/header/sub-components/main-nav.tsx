import React from 'react';
import { Routes } from 'app/routes/routes';
import ArticleIcon from '@mui/icons-material/Article';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import QuizIcon from '@mui/icons-material/Quiz';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import GroupIcon from '@mui/icons-material/Group';
import ClassIcon from '@mui/icons-material/Class';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

export const drawerWidth = 250;

export interface NavItem {
  text: string;
  link: string;
  icon: JSX.Element;
  disabled?: boolean;
}

export const commonNavList: NavItem[] = [
  {
    text: 'Главная',
    link: Routes.MAIN,
    icon: <ArticleIcon />,
  },
  {
    text: 'Тесты',
    link: Routes.TESTS,
    icon: <QuizIcon />,
    disabled: true,
  },
  {
    text: 'Профиль',
    link: Routes.PROFILE,
    icon: <AccountBoxIcon />,
  },
];

export const adminNavList: NavItem[] = [
  {
    text: 'Сотрудники',
    link: Routes.ADMIN_STAFF,
    icon: <GroupIcon />,
  },
  {
    text: 'Все статьи',
    link: Routes.ADMIN_ARTICLES,
    icon: <ArticleIcon />,
  },
  {
    text: 'Категории',
    link: Routes.ADMIN_CATEGORIES,
    icon: <ClassIcon />,
  },
  {
    text: 'Редактор',
    link: Routes.ADMIN_ARTICLES_EDITOR,
    icon: <FormatColorTextIcon />,
  },
  {
    text: 'Рассылки',
    link: Routes.ADMIN_MAILING,
    icon: <MailOutlineIcon />,
  },
];
