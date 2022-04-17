/* eslint-disable react-hooks/exhaustive-deps */
import {
  AccordionDetails,
  AccordionSummary,
  Button,
  IconButton,
  Skeleton,
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
import { BootState } from 'app/constants/boot-state';
import { observer } from 'mobx-react-lite';
import ArticlesList from './sub-components/articles-list';
import Article from './sub-components/article';
import { Routes } from 'app/routes/routes';
import { useAdminStore } from 'app/stores/admin-store/admin-store';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LaunchIcon from '@mui/icons-material/Launch';
import qs from 'qs';

const ArticlesPage = observer((): JSX.Element => {
  const params = useParams<{ categoryId: string }>();
  const location = useLocation();
  const history = useHistory();
  const store = useMainPageStore();
  const adminStore = useAdminStore();
  const match = useMediaQuery('(min-width: 900px)');

  useEffect(() => {
    store.fetchArticlesByCategory(params.categoryId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => store.resetArticle();
  }, []);

  useEffect(() => {
    if (location.search) {
      const obj: ArtilcesPageParams = qs.parse(location.search.slice(1));

      if (obj.article) {
        store.fetchArticle(obj.article);
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

  return (
    <Main>
      <PageTop>
        <PageTitle>
          {store.selectedCategory ? store.selectedCategory.title : ''}
        </PageTitle>
        <Button
          variant="text"
          color="inherit"
          component={Link}
          to={Routes.MAIN}
          size="small"
          sx={{ mr: 3 }}
        >
          На главную
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
            <Tooltip title="Удалить">
              <IconButton
                color="error"
                size="small"
                onClick={() => {
                  adminStore.deleteArticle(store.article!.id);
                  history.push(Routes.MAIN);
                }}
              >
                <DeleteForeverIcon />
              </IconButton>
            </Tooltip>
          </>
        ) : null}
      </PageTop>
      <PageContent>
        {store.articlesLoadState === BootState.Success ? (
          <AccordionElement
            onChange={handleAllArticlesAccordionChange}
            expanded={match || allArticlesExpanded}
            elevation={0}
          >
            <AccordionSummary
              expandIcon={match ? undefined : <ExpandMoreIcon />}
            >
              <Typography variant="h6">Список статей:</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ArticlesList
                list={store.articles}
                readArticles={store.profileInfo.readArticles}
                onClick={() => setAllArticlesExpanded(false)}
              />
            </AccordionDetails>
          </AccordionElement>
        ) : (
          <Skeleton
            width={match ? 350 : '100%'}
            height={match ? 500 : 50}
            sx={{ transform: 'none' }}
          />
        )}
        <Article article={store.article} bootState={store.articleLoadState} />
      </PageContent>
    </Main>
  );
});

export default ArticlesPage;
