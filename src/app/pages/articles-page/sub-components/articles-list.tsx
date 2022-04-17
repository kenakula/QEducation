import { List, ListItemText } from '@mui/material';
import { ArticleModel } from 'app/constants/article-model';
import React from 'react';
import { useHistory } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { ArticleListItem } from './styled-elements';
import { observer } from 'mobx-react-lite';

interface Props {
  list: ArticleModel[];
  readArticles: string[];
  onClick: () => void;
}

const ArticlesList = observer((props: Props): JSX.Element => {
  const { list, readArticles, onClick } = props;

  const history = useHistory();

  const handleClick = (id: string): void => {
    history.push({ search: `${history.location.search}&article=${id}` });
    onClick();
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
});

export default ArticlesList;
