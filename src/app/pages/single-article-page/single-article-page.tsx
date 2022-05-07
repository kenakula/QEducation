/* eslint-disable react/no-danger */
/* eslint-disable react-hooks/exhaustive-deps */
import { Fab, FormControlLabel, Grid, Switch, Typography } from '@mui/material';
import { ArticleModel } from 'app/constants/article-model';
import { BootState } from 'app/constants/boot-state';
import { FirestoreCollection } from 'app/constants/firestore-collections';
import { useFirebaseContext } from 'app/stores/firebase-store/firebase-store';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Main } from 'app/components/main';
import { Loader } from 'app/components/loader';
import { useMainPageStore } from 'app/stores/main-page-store/main-page-store';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ScrollTop } from 'app/components/scroll-to-top';

interface PageParams {
  articleId: string;
}

const SingleArticlePage = observer((): JSX.Element => {
  const firebase = useFirebaseContext();
  const params = useParams<PageParams>();
  const store = useMainPageStore();

  const [article, setArticle] = useState<ArticleModel>();
  const [mainContentLoading, setMainContentLoading] = useState<BootState>(
    BootState.None,
  );

  useEffect(() => {
    if (!store.isInited) {
      store.init();
    }
  }, []);

  const handleSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    newValue: boolean,
  ): void => {
    if (article) {
      store.checkArticleRead(article.id, newValue);
    }
  };

  useEffect(() => {
    setMainContentLoading(BootState.Loading);
    firebase
      .readDocument(FirestoreCollection.Articles, params.articleId)
      .then(value => {
        setArticle(value!.data());
        setMainContentLoading(BootState.Success);
      })
      .catch(err => {
        setMainContentLoading(BootState.Error);
        console.error(err);
      });

    firebase.getDocumentsFormCollection<ArticleModel>(
      FirestoreCollection.Articles,
    );
  }, [params]);

  return (
    <Main>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        {mainContentLoading === BootState.Success ? (
          <Grid item xs={12}>
            <Typography variant="h4" component="h1" textAlign="center" mb={1}>
              {article?.title}
            </Typography>
            <Typography textAlign="center" mb={2}>
              {article?.description}
            </Typography>
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: article?.delta }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={
                    store.profileInfo &&
                    store.profileInfo.readArticles.includes(params.articleId)
                  }
                  disabled={store.profileInfoUpdating}
                  onChange={handleSwitchChange}
                />
              }
              label="Прочитано"
            />
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Loader />
          </Grid>
        )}
      </Grid>
      <ScrollTop>
        <Fab
          color="primary"
          size="small"
          aria-label="Прокрутить к началу страницы"
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </Main>
  );
});

export default SingleArticlePage;
