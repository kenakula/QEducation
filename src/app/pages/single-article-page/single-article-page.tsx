/* eslint-disable react/no-danger */
/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, Skeleton, Typography } from '@mui/material';
import { ArticleModel } from 'app/constants/article-model';
import { BootState } from 'app/constants/boot-state';
import { FirestoreCollection } from 'app/constants/firestore-collections';
import { useFirebaseContext } from 'app/stores/firebase-store/firebase-store';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Main from 'app/components/main/main';

interface PageParams {
  articleId: string;
  categoryId: string;
}

const SingleArticlePage = observer((): JSX.Element => {
  const firebase = useFirebaseContext();
  const params = useParams<PageParams>();

  const [article, setArticle] = useState<ArticleModel>();
  const [mainContentLoading, setMainContentLoading] = useState<BootState>(
    BootState.None,
  );

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
          <Grid item xs={12} md={9}>
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
          </Grid>
        ) : (
          <Grid item md={9}>
            {/* TODO заменить на скелет статьи */}
            <Skeleton />
          </Grid>
        )}
      </Grid>
    </Main>
  );
});

export default SingleArticlePage;
