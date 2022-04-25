/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, Typography } from '@mui/material';
import Loader from 'app/components/loader/loader';
import TechnicalIssues from 'app/components/technical-issues/technical-issues';
import { BootState } from 'app/constants/boot-state';
import { VebinarModel } from 'app/constants/vebinar-model';
import { Routes } from 'app/routes/routes';
import { useMainPageStore } from 'app/stores/main-page-store/main-page-store';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'qs';

import { OpenState } from 'app/constants/open-state';
import { SnackBarStateProps } from 'app/constants/snackbar-state-props';
import SnackbarAlert from 'app/components/snackbar-alert/snackbar-alert';
import { useAdminStore } from 'app/stores/admin-store/admin-store';
import ConfirmDialog from 'app/components/confirm-dialog/confirm-dialog';
import { DeleteConfirmProps } from 'app/pages/admin-articles-page/admin-articles-page';
import VideoThumbnailElement from '../video-thumbnail-element';
import VideoView from '../video-view';
import AdminToolbar from '../admin-toolbar';
import VebinarEditorDialog from '../vebinar-editor-dialog';

const Vebinars = observer((): JSX.Element => {
  const store = useMainPageStore();
  const adminStore = useAdminStore();

  const history = useHistory();
  const location = useLocation();

  const [selectedVebinar, setSelectedVebinar] = useState<VebinarModel | null>(
    null,
  );
  const [vebinarsDialogOpenState, setVebinarsDialogOpenState] = useState(
    OpenState.Closed,
  );
  const [editingVebinar, setEditingVebinar] = useState<VebinarModel>();
  const [snackbarState, setSnackbarState] = useState<SnackBarStateProps>({
    openState: OpenState.Closed,
    message: 'Вебинар сохранен',
    alert: 'success',
  });
  const [deleteAction, setDeleteAction] = useState<DeleteConfirmProps>({
    id: '',
    openState: OpenState.Closed,
  });

  useEffect(() => {
    if (store.vebinarsLoadState !== BootState.Success) {
      store.fetchVebinars();
    }

    const parsed = qs.parse(location.search);

    if (!parsed.video) {
      setSelectedVebinar(null);
    } else {
      const videoId = parsed.video;

      setSelectedVebinar(
        store.vebinars.find(item => item.id === videoId) ?? null,
      );
    }
  }, [store.vebinarsLoadState, location.search]);

  const handleThumbClick = (item: VebinarModel): void => {
    history.push({
      pathname: Routes.MAIN,
      search: `${location.search}&video=${item.id}`,
    });
    setSelectedVebinar(item);
  };

  const handleVebinarsDialogOpen = (): void => {
    setVebinarsDialogOpenState(OpenState.Opened);
  };

  const handleVebinarsDialogClose = (): void => {
    setVebinarsDialogOpenState(OpenState.Closed);
    setEditingVebinar(undefined);
  };

  const handleEditVebinar = (video: VebinarModel): void => {
    setEditingVebinar(video);
    setVebinarsDialogOpenState(OpenState.Opened);
  };

  const handleDeleteVebinar = (id: string): void => {
    setDeleteAction(prev => ({
      ...prev,
      id,
      openState: OpenState.Opened,
    }));
  };

  const handleCopy = (id: string): void => {
    const domen = window.location.href;
    const url = `${domen}&video=${id}`;
    navigator.clipboard.writeText(url);
    setSnackbarState(prev => ({
      ...prev,
      openState: OpenState.Opened,
      message: 'Ссылка скопирована',
      alert: 'success',
    }));
  };

  const renderThumb = (item: VebinarModel): JSX.Element => (
    <Grid xs={6} sm={4} md={3} key={item.id} item sx={{ display: 'flex' }}>
      <VideoThumbnailElement
        handleCopy={() => handleCopy(item.id)}
        handleEdit={() => handleEditVebinar(item)}
        handleDelete={() => handleDeleteVebinar(item.id)}
        action={() => handleThumbClick(item)}
        isSuperAdmin={store.isSuperAdmin}
        video={item}
      />
    </Grid>
  );

  if (selectedVebinar) {
    return <VideoView vebinar={selectedVebinar} />;
  }

  switch (store.vebinarsLoadState) {
    case BootState.Success:
      return (
        <>
          {store.isSuperAdmin && (
            <AdminToolbar
              dialogOpener={handleVebinarsDialogOpen}
              tooltipText="Добавить вебинар"
            />
          )}
          <Grid container spacing={2}>
            {store.vebinars.length ? (
              store.vebinars.map(item => renderThumb(item))
            ) : (
              <Typography
                textAlign="center"
                variant="h5"
                sx={{ margin: '40px auto' }}
              >
                Нет вебинаров для просмотра
                {store.isSuperAdmin ? (
                  <Typography
                    sx={{ display: 'block' }}
                    textAlign="center"
                    variant="caption"
                    color="text.secondary"
                  >
                    Нажмите на плюсик чтобы добавить вебинар
                  </Typography>
                ) : null}
              </Typography>
            )}
          </Grid>
          <VebinarEditorDialog
            openState={vebinarsDialogOpenState}
            vebinar={editingVebinar}
            onClose={handleVebinarsDialogClose}
          />
          <ConfirmDialog
            open={deleteAction.openState}
            title="Уверены что хотите удалить вебинар?"
            message="Это действие необратимо"
            handleClose={() =>
              setDeleteAction(prev => ({
                ...prev,
                openState: OpenState.Closed,
              }))
            }
            handleAgree={() => {
              adminStore.deleteVebinar(deleteAction.id).then(() => {
                store.fetchVebinars();
                setSnackbarState(prev => ({
                  ...prev,
                  openState: OpenState.Opened,
                  message: 'Вебинар удален',
                  alert: 'error',
                }));
              });
            }}
          />
          <SnackbarAlert {...snackbarState} setState={setSnackbarState} />
        </>
      );
    case BootState.Error:
      return <TechnicalIssues />;
    default:
      return <Loader />;
  }
});

export default Vebinars;
