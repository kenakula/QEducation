import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { ItemList } from './styled-elements';
import { SortableListItemProps } from '../sortable-list';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { useAdminStore } from 'app/stores/admin-store/admin-store';
import { observer } from 'mobx-react-lite';

interface Props<T> {
  data: T;
  index: number;
  id: string;
}

export const SortableItem = observer(
  <T extends SortableListItemProps>(props: Props<T>): JSX.Element => {
    const { data, id, index } = props;
    const store = useAdminStore();
    const isExcluded = store.excludedArticlesFromCategoryList.includes(id);

    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    const handleAction = (): void => {
      store.setExcludedArticlesFromCategoryList(id);
    };

    return (
      <ItemList exluded={isExcluded} ref={setNodeRef} style={style}>
        <span>{index + 1}</span>
        <DragIndicatorIcon {...attributes} {...listeners} />
        {store.excludedArticlesFromCategoryList.includes(id) ? (
          <Tooltip title="Вернуть в список">
            <IconButton
              onClick={handleAction}
              sx={{ flexShrink: 0, mr: 2 }}
              color="success"
              size="small"
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Исключить из списка">
            <IconButton
              onClick={handleAction}
              sx={{ flexShrink: 0, mr: 2 }}
              color="error"
              size="small"
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        <Box>
          <Typography variant="h6">{data.title}</Typography>
          {data.description ? (
            <Typography variant="body1" color="text.secondary">
              {data.description}
            </Typography>
          ) : null}
        </Box>
      </ItemList>
    );
  },
);
