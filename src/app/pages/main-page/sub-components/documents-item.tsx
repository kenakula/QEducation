import { IconButton, ListItem, ListItemIcon, Typography } from '@mui/material';
import { DocumentsFolderModel } from 'app/constants/documents-folder-model';
import React from 'react';
import { DocumentsFolder, FolderHeader, FolderItems } from './styled-elements';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { observer } from 'mobx-react-lite';
import { Box } from '@mui/system';
import DownloadIcon from '@mui/icons-material/Download';
import { getFileIcon } from '../assets/get-file-icon';

interface Props {
  isAdmin: boolean;
  folder: DocumentsFolderModel;
  deleteDocument: (path: string) => void;
  downloadDocument: (path: string) => void;
}

export const DocumentsItem = observer((props: Props): JSX.Element | null => {
  const { folder, deleteDocument, downloadDocument, isAdmin } = props;

  if (!folder.items.length) {
    return null;
  }

  return (
    <DocumentsFolder variant="outlined">
      <FolderHeader>
        <Typography variant="h6">{folder.name}</Typography>
      </FolderHeader>
      <FolderItems dense>
        {folder.items.map(item => (
          <ListItem key={item.fullPath} disableGutters>
            <ListItemIcon>{getFileIcon(item.name)}</ListItemIcon>
            <Typography variant="caption">{item.name}</Typography>
            <Box>
              <IconButton
                size="small"
                onClick={() => downloadDocument(item.fullPath)}
              >
                <DownloadIcon fontSize="small" color="info" />
              </IconButton>
              {isAdmin ? (
                <IconButton
                  size="small"
                  onClick={() => deleteDocument(item.fullPath)}
                >
                  <DeleteForeverIcon fontSize="small" color="error" />
                </IconButton>
              ) : null}
            </Box>
          </ListItem>
        ))}
      </FolderItems>
    </DocumentsFolder>
  );
});
