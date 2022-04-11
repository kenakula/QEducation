/* eslint-disable react-hooks/exhaustive-deps */
import {
  AccordionDetails,
  AccordionSummary,
  Button,
  Skeleton,
  Typography,
} from '@mui/material';
import Main from 'app/components/main/main';
import PageTitle from 'app/components/page-title/page-title';
import { useMainPageStore } from 'app/stores/main-page-store/main-page-store';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
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

const ArticlesPage = observer((): JSX.Element => {
  const params = useParams<{ category: string }>();
  const location = useLocation();
  const history = useHistory();
  const store = useMainPageStore();
  const adminStore = useAdminStore();
  const match = useMediaQuery('(min-width: 900px)');

  useEffect(() => {
    store.fetchArticlesByCategory(params.category);
    // eslint-disable-next-line react-hooks/exhaustive-deps

    return () => store.resetArticle();
  }, []);

  useEffect(() => {
    if (location.search) {
      store.fetchArticle(location.search.slice(1));
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
        <PageTitle>{params.category}</PageTitle>
        <Button
          variant="text"
          color="inherit"
          component={Link}
          to={Routes.MAIN}
        >
          На главную
        </Button>
        {store.profileInfo &&
        store.profileInfo.isSuperAdmin &&
        store.article ? (
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              adminStore.editArticle(store.article!);
              history.push(Routes.ADMIN_ARTICLES_EDITOR);
            }}
          >
            Редактировать
          </Button>
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
              <Typography variant="h6">Все статьи:</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ArticlesList
                list={store.articles}
                readArticles={store.profileInfo.readArticles}
              />
            </AccordionDetails>
          </AccordionElement>
        ) : (
          <Skeleton
            width={match ? 240 : '100%'}
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
