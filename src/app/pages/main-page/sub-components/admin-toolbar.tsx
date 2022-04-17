import { IconButton, Tooltip } from '@mui/material';
import React from 'react';
import { AdminToolsRow } from './styled-elements';
import AddIcon from '@mui/icons-material/Add';

interface Props {
  onOpenCategoriesDialog: () => void;
}

const AdminToolbar = (props: Props): JSX.Element => {
  const { onOpenCategoriesDialog } = props;

  return (
    <AdminToolsRow>
      <Tooltip title="Добавить категорию и статьи для выбранной роли пользователей">
        <IconButton
          onClick={onOpenCategoriesDialog}
          size="large"
          color="primary"
        >
          <AddIcon fontSize="large" />
        </IconButton>
      </Tooltip>
    </AdminToolsRow>
  );
};

export default AdminToolbar;
