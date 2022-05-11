import React, { useEffect, useState } from 'react';
import { useMainPageStore } from 'app/stores/main-page-store/main-page-store';
import { DocumentsContainer } from '../styled-elements';
import { Box, Button, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { observer } from 'mobx-react-lite';
import { BootState } from 'app/constants/boot-state';
import { Loader } from 'app/components/loader';
import { TechnicalIssues } from 'app/components/technical-issues';
import { DocumentsItem } from '../documents-item';
import { SnackBarStateProps } from 'app/constants/snackbar-state-props';
import { SnackbarAlert } from 'app/components/snackbar-alert';
import { useAdminStore } from 'app/stores/admin-store/admin-store';
import { useFirebaseContext } from 'app/stores/firebase-store/firebase-store';
import { DocumentUploadDialog } from '../document-upload-dialog';
import { ReactComponent as EmptyImage } from 'assets/images/empty-image.svg';

export const Documents = observer((): JSX.Element => {
  const store = useMainPageStore();
  const adminStore = useAdminStore();
  const firebaseStore = useFirebaseContext();

  const [snackbarState, setSnackbarState] = useState<SnackBarStateProps>({
    isOpen: false,
    message: '',
    alert: 'success',
  });
  const [uploadDialogOpenState, setUploadDialogOpenState] = useState(false);

  useEffect(() => {
    store.fetchDocumentsFolders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUploadDialogOpen = (): void => {
    setUploadDialogOpenState(true);
  };

  const handleUploadDialogClose = (): void => {
    setUploadDialogOpenState(false);
  };

  const handleDocumentDelete = (path: string): void => {
    adminStore.deleteDocument(path).then(() => {
      store.fetchFolderDocuments();
    });
  };

  const handleDownloadDocument = (path: string): void => {
    firebaseStore.getFileUrl(path).then(url => {
      const win = window.open(url, '_blank');

      if (win) {
        win.focus();
      }
    });
  };

  const handleUploadSuccess = (cb?: () => void): void => {
    setSnackbarState(prev => ({
      ...prev,
      isOpen: true,
      message: 'Файл загружен',
    }));
    setUploadDialogOpenState(false);
    store.fetchDocumentsFolders();

    if (cb) {
      cb();
    }
  };

  const handleUploadError = (cb?: () => void): void => {
    setSnackbarState(prev => ({
      ...prev,
      isOpen: true,
      message: 'Файл не загружен. Ошибка сервера',
      alert: 'error',
    }));

    if (cb) {
      cb();
    }
  };

  const renderContent = (): JSX.Element => {
    switch (store.documentsLoadState) {
      case BootState.Success:
        return (
          <DocumentsContainer>
            {store.documents.length ? (
              store.documents.map(item => (
                <DocumentsItem
                  deleteDocument={handleDocumentDelete}
                  downloadDocument={handleDownloadDocument}
                  key={item.name}
                  folder={item}
                  isAdmin={store.isSuperAdmin}
                />
              ))
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <EmptyImage width={150} height={150} />
                <Typography variant="h5" textAlign="center" sx={{ py: 4 }}>
                  Нет документов
                </Typography>
              </Box>
            )}
            {store.isSuperAdmin ? (
              <Button
                sx={{ alignSelf: 'center' }}
                startIcon={<AddCircleOutlineIcon />}
                color="primary"
                variant="outlined"
                onClick={handleUploadDialogOpen}
              >
                Загрузить файл
              </Button>
            ) : null}
            <SnackbarAlert {...snackbarState} setState={setSnackbarState} />
            <DocumentUploadDialog
              open={uploadDialogOpenState}
              handleClose={handleUploadDialogClose}
              handleSuccess={handleUploadSuccess}
              handleError={handleUploadError}
            />
          </DocumentsContainer>
        );
      case BootState.Error:
        return <TechnicalIssues />;
      default:
        return <Loader />;
    }
  };

  return renderContent();
});
