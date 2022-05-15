/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, Typography } from '@mui/material';
import { useAdminStore } from 'app/stores/admin-store/admin-store';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserPhoto } from './sub-components/styled-elements';
import PersonIcon from '@mui/icons-material/Person';
import UserDetailsInfo from './sub-components/user-details-info';
import UserDetailsActions from './sub-components/user-details-actions';
import { useAuthStore } from 'app/stores/auth-store/auth-store';
import { observer } from 'mobx-react-lite';
import { Loader } from 'app/components/loader';
import { useMainPageStore } from 'app/stores/main-page-store/main-page-store';
import UserProgress from './sub-components/user-progress';
import { useFirebaseContext } from 'app/stores/firebase-store/firebase-store';
import { StorageFolder } from 'app/constants/storage-folder';
import { Main } from 'app/components/main';
import { TechnicalIssues } from 'app/components/technical-issues';

interface PageParams {
  staffId: string;
}

const StaffDetailsPage = observer((): JSX.Element => {
  const adminStore = useAdminStore();
  const store = useMainPageStore();
  const firebase = useFirebaseContext();
  const params = useParams<PageParams>();
  const { currentUser } = useAuthStore();

  const [profileDeleted, setProfileDeleted] = useState(false);
  const [userImageUrl, setUserImageUrl] = useState('');

  useEffect(() => {
    adminStore.init();
    adminStore.getUserInfo(params.staffId);
  }, []);

  useEffect(() => {
    firebase
      .getFileUrl(`${StorageFolder.UserAvatars}/${params.staffId}`)
      .then(url => {
        setUserImageUrl(url);
      });
  }, []);

  useEffect(() => {
    if (adminStore.userDetailsInfo) {
      store.getUserCategories(adminStore.userDetailsInfo.role);
    }
  }, [adminStore.userDetailsInfo]);

  if (profileDeleted) {
    return <TechnicalIssues header="Профиль удален" message="" />;
  }

  return (
    <Main>
      {adminStore.userDetailsInfo ? (
        <Grid spacing={2} container rowSpacing={6}>
          <Grid item xs={12} sm={4}>
            <UserPhoto variant="rounded" src={userImageUrl}>
              <PersonIcon />
            </UserPhoto>
          </Grid>
          <Grid item xs={12} sm={8}>
            <UserDetailsInfo
              store={adminStore}
              data={adminStore.userDetailsInfo}
            />
          </Grid>
          {store.roleCategories.length ? (
            <Grid xs={12} item>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Прогресс пользователя
              </Typography>
              <UserProgress
                userInfo={adminStore.userDetailsInfo}
                categories={store.roleCategories}
              />
            </Grid>
          ) : null}
          <Grid item xs={12}>
            <UserDetailsActions
              setDeleted={setProfileDeleted}
              store={adminStore}
              data={adminStore.userDetailsInfo}
              currentUserId={currentUser?.uid}
            />
          </Grid>
        </Grid>
      ) : (
        <Loader />
      )}
    </Main>
  );
});

export default StaffDetailsPage;
