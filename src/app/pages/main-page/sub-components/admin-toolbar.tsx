import { IconButton, Tooltip } from '@mui/material';
import React from 'react';
import { AdminToolsRow } from './styled-elements';
import AddIcon from '@mui/icons-material/Add';

interface Props {
  dialogOpener: () => void;
  tooltipText?: string;
}

const AdminToolbar = (props: Props): JSX.Element => {
  const { dialogOpener, tooltipText } = props;

  return (
    <AdminToolsRow>
      <Tooltip title={tooltipText ?? false}>
        <IconButton onClick={dialogOpener} size="large" color="primary">
          <AddIcon fontSize="large" />
        </IconButton>
      </Tooltip>
    </AdminToolsRow>
  );
};

export default AdminToolbar;
