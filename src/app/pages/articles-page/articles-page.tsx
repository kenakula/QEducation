/* eslint-disable react-hooks/exhaustive-deps */
import {
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import Main from 'app/components/main/main';
import PageTitle from 'app/components/page-title/page-title';
import {
  ArtilcesPageParams,
  useMainPageStore,
} from 'app/stores/main-page-store/main-page-store';
import React, { useEffect, useState } from 'react';
import {
  generatePath,
  Link,
  useHistory,
  useLocation,
  useParams,
} from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  AccordionElement,
  PageContent,
  PageTop,
} from './sub-components/styled-elements';
import { observer } from 'mobx-react-lite';
import ArticlesList from './sub-components/articles-list';
import Article from './sub-components/article';
import { Routes } from 'app/routes/routes';
import { useAdminStore } from 'app/stores/admin-store/admin-store';
import EditIcon from '@mui/icons-material/Edit';
import LaunchIcon from '@mui/icons-material/Launch';
import qs from 'qs';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import { nanoid } from 'nanoid';
import { Category } from 'app/constants/category-model';

const ArticlesPage = observer((): JSX.Element => {
  const params = useParams<{ categoryId: string }>();
  const location = useLocation();
  const history = useHistory();
  const store = useMainPageStore();
  const adminStore = useAdminStore();
  const match = useMediaQuery('(min-width: 900px)');

  useEffect(() => {
    store.getCategoryById(params.categoryId);
    store.getArticlesFromUserCategory(params.categoryId);
  }, []);

  useEffect(() => {
    if (location.search) {
      const obj: ArtilcesPageParams = qs.parse(location.search.slice(1));

      if (obj.article) {
        store.fetchArticle(obj.article);
      }

      if (obj.role) {
        store.setSelectedRole(obj.role);
        store.getUserCategories(obj.role).then(() => {
          store.getArticlesFromUserCategory(params.categoryId);
        });
      } else if (!obj.role && obj.article) {
        history.push(
          generatePath(Routes.ARTICLE_PAGE, {
            category: params.categoryId,
            articleId: obj.article,
          }),
        );
      }
    }
  }, [location.search]);

  const [allArticlesExpanded, setAllArticlesExpanded] = useState(false);
  const handleAllArticlesAccordionChange = (
    event: React.SyntheticEvent,
    isExpanded: boolean,
  ): void => {
    setAllArticlesExpanded(isExpanded);
  };

  const handleNewArticle = (): void => {
    const url = location.pathname;

    adminStore.editArticle(
      {
        id: nanoid(),
        title: '',
        description: '',
        delta: '',
        roles: [store.selectedRole],
        categories: [store.selectedCategory.title as unknown as Category],
        readMore: [],
      },
      url,
    );
    history.push(Routes.ADMIN_ARTICLES_EDITOR);
  };

  return (
    <Main>
      <PageTop>
        <PageTitle>
          <Typography sx={{ mr: 2 }} color="text.secondary">
            Категория:{' '}
          </Typography>
          {store.selectedCategory ? store.selectedCategory.title : ''}
        </PageTitle>
        <Button
          variant="text"
          color="inherit"
          component={Link}
          to={Routes.MAIN}
          size="small"
          sx={{ mr: 3 }}
          startIcon={<ArrowBackIcon />}
        >
          К категориям
        </Button>
        {store.article ? (
          <Tooltip title="Открыть на отдельной странице">
            <IconButton
              color="inherit"
              size="small"
              onClick={() => {
                history.push(
                  generatePath(Routes.ARTICLE_PAGE, {
                    category: params.categoryId,
                    articleId: store.article!.id,
                  }),
                );
              }}
            >
              <LaunchIcon />
            </IconButton>
          </Tooltip>
        ) : null}
        {store.isSuperAdmin && store.article ? (
          <>
            <Tooltip title="Редактировать">
              <IconButton
                color="inherit"
                size="small"
                onClick={() => {
                  adminStore.editArticle(store.article!);
                  history.push(Routes.ADMIN_ARTICLES_EDITOR);
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          </>
        ) : null}
      </PageTop>
      <Typography variant="body1">
        {store.selectedCategory ? store.selectedCategory.description : ''}
      </Typography>
      <PageContent>
        <AccordionElement
          onChange={handleAllArticlesAccordionChange}
          expanded={match || allArticlesExpanded}
          elevation={0}
        >
          <AccordionSummary expandIcon={match ? undefined : <ExpandMoreIcon />}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <Typography variant="h6">Список статей:</Typography>
              <Tooltip title="Создать статью в данной категории. Автоматически добавится к выбранной роли пользователя">
                <IconButton onClick={handleNewArticle} color="primary">
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <ArticlesList
              list={store.userCategoryArticles}
              onClick={() => setAllArticlesExpanded(false)}
            />
          </AccordionDetails>
        </AccordionElement>
        <Article article={store.article} bootState={store.articleLoadState} />
      </PageContent>
    </Main>
  );
});

export default ArticlesPage;
