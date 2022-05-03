import { Box, LinearProgress, Typography } from '@mui/material';
import { Category, CategoryArticle } from 'app/constants/category-model';
import { UserModel } from 'app/constants/user-model';
import React from 'react';
import { CategoryProgress } from './elements';

interface Props {
  categories: Category[];
  userInfo: UserModel;
}

const UserProgress = (props: Props): JSX.Element => {
  const { categories, userInfo } = props;

  const getReadPercentage = (articles: CategoryArticle[]): number => {
    const readCount = articles.reduce(
      (acc, article) =>
        acc + (userInfo.readArticles.includes(article.id) ? 1 : 0),
      0,
    );

    return Math.floor((readCount / articles.length) * 100);
  };

  const getReadArticlesCount = (articles: CategoryArticle[]): number =>
    articles.reduce(
      (acc, article) =>
        acc + (userInfo.readArticles.includes(article.id) ? 1 : 0),
      0,
    );

  return (
    <Box>
      {categories.map(category => (
        <CategoryProgress key={category.id}>
          <Box>
            <Typography variant="body1">{category.title}</Typography>
            <Typography variant="body2" color="primary">
              {`${getReadArticlesCount(category.articles)} из ${
                category.articles.length
              }`}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={getReadPercentage(category.articles)}
          />
        </CategoryProgress>
      ))}
    </Box>
  );
};

export default UserProgress;
