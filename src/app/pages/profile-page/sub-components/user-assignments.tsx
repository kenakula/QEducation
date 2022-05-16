import { Grid, Link, List, ListItem, Typography } from '@mui/material';
import { useMainPageStore } from 'app/stores/main-page-store/main-page-store';
import React from 'react';
import { generatePath, NavLink } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Routes } from 'app/routes/routes';

export const UserAssignments = (): JSX.Element => {
  const {
    userAssignments: { articles, tests, checklists, scripts },
    profileInfo,
  } = useMainPageStore();

  if (
    !articles.length &&
    !tests.length &&
    !checklists.length &&
    !scripts.length
  ) {
    return (
      <Typography textAlign="center" sx={{ opacity: 0.5, margin: '0 auto' }}>
        Нет назначенных материалов
      </Typography>
    );
  }

  return (
    <Grid gap={1} container>
      {articles.length ? (
        <Grid xs={12} sm={6} item>
          <Typography variant="h6" component="h2">
            Статьи:
          </Typography>
          <List>
            {articles.map(item => (
              <ListItem key={item.item.attachmentId}>
                <Link
                  component={NavLink}
                  to={generatePath(Routes.SINGLE_ARTICLE, {
                    articleId: item.item.attachmentId,
                  })}
                >
                  {item.item.title}
                </Link>
                {profileInfo &&
                profileInfo.readArticles.includes(item.item.attachmentId) ? (
                  <CheckCircleOutlineIcon
                    sx={{ ml: 1 }}
                    fontSize="small"
                    color="success"
                  />
                ) : null}
              </ListItem>
            ))}
          </List>
        </Grid>
      ) : null}
      {/* TODO добавить поля */}
      {/* {tests.length ? (
        <Grid xs={12} sm={6} item>
          <Typography variant="h6" component="h2">
            Статьи:
          </Typography>
          <List>
            {tests.map(item => (
              <ListItem key={item.item.attachmentId}>
                <Link
                  component={NavLink}
                  to={generatePath(Routes.SINGLE_ARTICLE, {
                    articleId: item.item.attachmentId,
                  })}
                >
                  {item.item.title}
                </Link>
                {profileInfo &&
                profileInfo.readArticles.includes(item.item.attachmentId) ? (
                  <CheckCircleOutlineIcon
                    sx={{ ml: 1 }}
                    fontSize="small"
                    color="success"
                  />
                ) : null}
              </ListItem>
            ))}
          </List>
        </Grid>
      ) : null}
      {checklists.length ? (
        <Grid xs={12} sm={6} item>
          <Typography variant="h6" component="h2">
            Статьи:
          </Typography>
          <List>
            {checklists.map(item => (
              <ListItem key={item.item.attachmentId}>
                <Link
                  component={NavLink}
                  to={generatePath(Routes.SINGLE_ARTICLE, {
                    articleId: item.item.attachmentId,
                  })}
                >
                  {item.item.title}
                </Link>
                {profileInfo &&
                profileInfo.readArticles.includes(item.item.attachmentId) ? (
                  <CheckCircleOutlineIcon
                    sx={{ ml: 1 }}
                    fontSize="small"
                    color="success"
                  />
                ) : null}
              </ListItem>
            ))}
          </List>
        </Grid>
      ) : null}
      {scripts.length ? (
        <Grid xs={12} sm={6} item>
          <Typography variant="h6" component="h2">
            Статьи:
          </Typography>
          <List>
            {scripts.map(item => (
              <ListItem key={item.item.attachmentId}>
                <Link
                  component={NavLink}
                  to={generatePath(Routes.SINGLE_ARTICLE, {
                    articleId: item.item.attachmentId,
                  })}
                >
                  {item.item.title}
                </Link>
                {profileInfo &&
                profileInfo.readArticles.includes(item.item.attachmentId) ? (
                  <CheckCircleOutlineIcon
                    sx={{ ml: 1 }}
                    fontSize="small"
                    color="success"
                  />
                ) : null}
              </ListItem>
            ))}
          </List>
        </Grid>
      ) : null} */}
    </Grid>
  );
};
