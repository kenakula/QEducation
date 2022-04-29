import { List, ListItemText } from '@mui/material';
import React from 'react';
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
          onClick={() => handleClick(item.id)}
          sx={{ cursor: 'pointer' }}
          key={item.id}
          secondaryAction={
            store.profileInfo &&
            store.profileInfo.readArticles.includes(item.id) ? (
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
