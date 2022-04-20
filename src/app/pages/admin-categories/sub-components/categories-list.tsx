import { List, ListItem, ListItemText } from '@mui/material';
import { Category } from 'app/constants/category-model';
import React from 'react';

interface Props {
  list: Category[];
  onClick: (item: Category) => void;
}

const CategoriesList = (props: Props): JSX.Element => {
  const { list, onClick } = props;

  return (
    <List>
      {list.map(item => (
        <ListItem key={item.id} onClick={() => onClick(item)}>
          <ListItemText
            primary={item.title}
            secondary={item.description ?? undefined}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default CategoriesList;
