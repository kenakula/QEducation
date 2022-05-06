import { List, ListItemText } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { ArticleListItem } from './styled-elements';
import { observer } from 'mobx-react-lite';
import { CategoryArticle } from 'app/constants/category-model';
import qs from 'qs';
import { useMainPageStore } from 'app/stores/main-page-store/main-page-store';

interface Props {
  list: CategoryArticle[];
  onClick: () => void;
}

const ArticlesList = observer((props: Props): JSX.Element => {
  const { list, onClick } = props;

  const history = useHistory();
  const location = useLocation();
  const store = useMainPageStore();

  const [currentArticle, setCurrentArticle] = useState('');

  useEffect(() => {
    if (location.search) {
      const obj = qs.parse(location.search.slice(1));

      if (obj.article) {
        setCurrentArticle(obj.article as string);
      }
    }
  }, [location.search]);

  const handleClick = (id: string): void => {
    if (location.search) {
      const obj = qs.parse(location.search.slice(1));
      obj.article = id;

      history.replace({ search: qs.stringify(obj) });
    }

    onClick();
  };

  return (
    <List dense>
      {list.map(item => (
        <ArticleListItem
          selected={currentArticle === item.id}
          onClick={() => handleClick(item.id)}
          sx={{ cursor: 'pointer' }}
          key={item.id}
          secondaryAction={
            store.profileInfo &&
            store.profileInfo.readArticles.includes(item.id) ? (
              <CheckCircleOutlineIcon color="primary" />
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
