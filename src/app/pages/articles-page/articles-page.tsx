/* eslint-disable react-hooks/exhaustive-deps */
import {
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  Typography,
} from '@mui/material';
import Main from 'app/components/main/main';
import PageTitle from 'app/components/page-title/page-title';
import { useMainPageStore } from 'app/stores/main-page-store/main-page-store';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AccordionElement, PageTop } from './sub-components/styled-elements';
import { BootState } from 'app/constants/boot-state';
import { observer } from 'mobx-react-lite';
import ArticlesList from './sub-components/articles-list';
import Article from './sub-components/article';
import { Routes } from 'app/routes/routes';

const ArticlesPage = observer((): JSX.Element => {
  const params = useParams<{ category: string }>();
  const location = useLocation();
  const store = useMainPageStore();
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
      </PageTop>
      <Grid container sx={{ flexGrow: 1 }}>
        <Grid item xs={12} md={3}>
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
          ) : null}
        </Grid>
        <Grid item xs={12} md={9} sx={{ display: 'flex' }}>
          <Article article={store.article} bootState={store.articleLoadState} />
        </Grid>
      </Grid>
    </Main>
  );
});

export default ArticlesPage;
