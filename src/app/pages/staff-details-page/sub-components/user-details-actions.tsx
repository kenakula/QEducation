import { Button, Divider, Stack } from '@mui/material';
import { UserModel } from 'app/constants/user-model';
import { AdminStore } from 'app/stores/admin-store/admin-store';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { StackItem } from './elements';
import { ModalDialogConfirm } from 'app/components/modal-dialog';

interface Props {
  data: UserModel;
  currentUserId: string | undefined;
  store: AdminStore;
  setDeleted: Dispatch<SetStateAction<boolean>>;
}

const UserDetailsActions = (props: Props): JSX.Element => {
  const { data, currentUserId, store, setDeleted } = props;

  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

  const handleCloseConfirm = (): void => {
    setConfirmOpen(false);
  };

  const handleConfirmOpen = (): void => {
    setConfirmOpen(true);
  };

  const handleDeleteProfile = (): void => {
    store.deleteUserProfile(data.uid).then(() => {
      setDeleted(true);
    });
  };

  return (
    <>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 2, md: 4 }}
        justifyContent="center"
        alignItems="center"
        divider={<Divider orientation="vertical" flexItem />}
      >
        <StackItem>
          <Button>Назначить статью</Button>
        </StackItem>
        <StackItem>
          <Button>Назначить тест</Button>
        </StackItem>
        {currentUserId !== data.uid ? (
          <StackItem>
            <Button
              variant="outlined"
              color="error"
              onClick={handleConfirmOpen}
            >
              Удалить профиль
            </Button>
          </StackItem>
        ) : null}
      </Stack>
      <ModalDialogConfirm
        title="Подтвердите удаление"
        message="Профиль пользователя нельзя будет восстановить"
        isOpen={confirmOpen}
        handleClose={handleCloseConfirm}
        handleAgree={handleDeleteProfile}
      />
    </>
  );
};

export default UserDetailsActions;
