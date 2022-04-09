import React, { useEffect, useState } from 'react';
// import Loader from './components/loader/loader';
import { BootState } from './constants/boot-state';
import RouterComponent from './routes/router-component';
// import {
//   AdminStore,
//   AdminStoreContext,
// } from './stores/admin-store/admin-store';
import { AuthStoreProvider } from './stores/auth-store/auth-store';
import {
  FirebaseStore,
  FirebaseContext,
} from './stores/firebase-store/firebase-store';
// import {
//   MainPageStore,
//   MainPageStoreContext,
// } from './stores/main-page-store/main-page-store';
// import {
//   ProfileStore,
//   ProfileStoreContext,
// } from './stores/profile-store/profile-store';
import { ThemeStoreProvider } from './stores/theme-store/theme-store';

const App = (): JSX.Element | null => {
  const [bootState, setBootState] = useState<BootState>(BootState.None);
  const [firebaseStore, setFirebaseStore] = useState<FirebaseStore>();
  // const [adminStore, setAdminStore] = useState<AdminStore>();
  // const [profileStore, setProfileStore] = useState<ProfileStore>();
  // const [mainPageStore, setMainPageStore] = useState<MainPageStore>();

  useEffect(() => {
    setBootState(BootState.Loading);

    const firebase = new FirebaseStore();
    // const adminPagesStore = new AdminStore(firebase);
    // const profilePageStore = new ProfileStore(firebase);
    // const mainStore = new MainPageStore(firebase);

    try {
      setFirebaseStore(firebase);
      // setAdminStore(adminPagesStore);
      // setProfileStore(profilePageStore);
      // setMainPageStore(mainStore);
      setBootState(BootState.Success);
    } catch {
      setBootState(BootState.Error);
      console.error('error in app initiation');
    }
  }, []);

  switch (bootState) {
    case BootState.Success:
      return (
        <FirebaseContext.Provider value={firebaseStore}>
          <ThemeStoreProvider>
            <AuthStoreProvider>
              <RouterComponent />
              {/* <AdminStoreContext.Provider value={adminStore}>
                <ProfileStoreContext.Provider value={profileStore}>
                  <MainPageStoreContext.Provider value={mainPageStore}>
                    <RouterComponent />
                  </MainPageStoreContext.Provider>
                </ProfileStoreContext.Provider>
              </AdminStoreContext.Provider> */}
            </AuthStoreProvider>
          </ThemeStoreProvider>
        </FirebaseContext.Provider>
      );
    case BootState.Loading:
      return <p>...loading</p>;
    case BootState.Error:
      return <div>error in initiation</div>;
    default:
      return null;
  }
};

export default App;
