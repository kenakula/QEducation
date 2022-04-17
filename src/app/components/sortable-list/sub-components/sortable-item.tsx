import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Typography } from '@mui/material';
import { ItemList } from './styled-elements';
import { SortableListItemProps } from '../sortable-list';

interface Props<T> {
  data: T;
  index: number;
  id: string;
}

export const SortableItem = <T extends SortableListItemProps>(
  props: Props<T>,
): JSX.Element => {
  const { data, id, index } = props;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <ItemList ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <span>{index + 1}</span>
      <Typography variant="h6">{data.title}</Typography>
      {data.description ? (
        <Typography variant="body1" color="text.secondary">
          {data.description}
        </Typography>
      ) : null}
    </ItemList>
  );
};
