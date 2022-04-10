import { Button, Divider, Stack } from '@mui/material';
import ConfirmDialog from 'app/components/confirm-dialog/confirm-dialog';
import { OpenState } from 'app/constants/open-state';
import { UserModel } from 'app/constants/user-model';
import { AdminStore } from 'app/stores/admin-store/admin-store';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { StackItem } from './elements';

interface Props {
  data: UserModel;
  currentUserId: string | undefined;
  store: AdminStore;
  setDeleted: Dispatch<SetStateAction<boolean>>;
}

const UserDetailsActions = (props: Props): JSX.Element => {
  const { data, currentUserId, store, setDeleted } = props;

  const [confirmOpen, setConfirmOpen] = useState<OpenState>(OpenState.Closed);

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
              onClick={() => setConfirmOpen(OpenState.Opened)}
            >
              Удалить профиль
            </Button>
          </StackItem>
        ) : null}
      </Stack>
      <ConfirmDialog
        title="Подтвердите удаление"
        message="Профиль пользователя нельзя будет восстановить"
        open={confirmOpen}
        handleClose={() => setConfirmOpen(OpenState.Closed)}
        handleAgree={handleDeleteProfile}
      />
    </>
  );
};

export default UserDetailsActions;
