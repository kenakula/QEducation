/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-danger */
import {
  Fab,
  FormControlLabel,
  Switch,
  Typography,
  useTheme,
} from '@mui/material';
import { Loader } from 'app/components/loader';
import { ScrollTop } from 'app/components/scroll-to-top';
import { TechnicalIssues } from 'app/components/technical-issues';
import { ArticleModel } from 'app/constants/article-model';
import { BootState } from 'app/constants/boot-state';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { ArticleContainer } from './styled-elements';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useMainPageStore } from 'app/stores/main-page-store/main-page-store';
import ReadMoreArticles from './readmore-articles';

interface Props {
  bootState: BootState;
  article: ArticleModel | null;
}

const Article = observer((props: Props): JSX.Element => {
  const { bootState, article } = props;
  const theme = useTheme();
  const store = useMainPageStore();

  const handleSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    newValue: boolean,
  ): void => {
    if (article) {
      store.checkArticleRead(article.id, newValue);
    }
  };

  useEffect(() => {
    if (!store.isInited) {
      store.init();
    }
  }, [store.isInited]);

  const renderContent = (): JSX.Element => {
    switch (bootState) {
      case BootState.Success:
        return article ? (
          <>
            <Typography textAlign="center" variant="h4">
              {article.title}
            </Typography>
            <Typography textAlign="center" variant="body1" sx={{ mb: 4 }}>
              {article.description}
            </Typography>
            <div
              dangerouslySetInnerHTML={{ __html: article.delta }}
              style={{
                borderBottom: `1px solid ${theme.palette.divider}`,
                marginBottom: theme.spacing(2),
              }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={
                    store.profileInfo &&
                    store.profileInfo.readArticles.includes(article.id)
                  }
                  disabled={store.profileInfoUpdating}
                  onChange={handleSwitchChange}
                />
              }
              label="??????????????????"
            />
            {article.readMore && article.readMore.length ? (
              <ReadMoreArticles list={article.readMore} />
            ) : null}
          </>
        ) : (
          <p>no article</p>
        );
      case BootState.Loading:
        return <Loader />;
      case BootState.None:
        return (
          <Typography variant="h4" textAlign="center">
            ???????????????? ????????????
          </Typography>
        );
      default:
        return (
          <TechnicalIssues message="???? ?????????????? ?????????????????? ????????????. ???????????????????? ??????????." />
        );
    }
  };

  return (
    <ArticleContainer>
      {renderContent()}
      <ScrollTop>
        <Fab
          color="primary"
          size="small"
          aria-label="???????????????????? ?? ???????????? ????????????????"
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </ArticleContainer>
  );
});

export default Article;
