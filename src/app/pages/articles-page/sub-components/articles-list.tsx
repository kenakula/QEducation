import { List, ListItemText } from '@mui/material';
import { ArticleModel } from 'app/constants/article-model';
import React from 'react';
import { useHistory } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { ArticleListItem } from './styled-elements';

interface Props {
  list: ArticleModel[];
  readArticles: string[];
}

const ArticlesList = (props: Props): JSX.Element => {
  const { list, readArticles } = props;

  const history = useHistory();

  const handleClick = (id: string): void => {
    history.push({ search: `?${id}` });
  };

  return (
    <List dense>
      {list.map(item => (
        <ArticleListItem
          onClick={() => handleClick(item.id)}
          sx={{ cursor: 'pointer' }}
          key={item.id}
          secondaryAction={
            readArticles.includes(item.id) ? (
              <CheckCircleOutlineIcon color="success" />
            ) : undefined
          }
        >
          <ListItemText primary={item.title} />
        </ArticleListItem>
      ))}
    </List>
  );
};

export default ArticlesList;
