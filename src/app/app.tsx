import React, { useEffect, useState } from 'react';
import { Loader } from './components/loader';
import { TechnicalIssues } from './components/technical-issues';
import { BootState } from './constants/boot-state';
import RouterComponent from './routes/router-component';
import {
  AdminStore,
  AdminStoreContext,
} from './stores/admin-store/admin-store';
import { AuthStoreProvider } from './stores/auth-store/auth-store';
import {
  FirebaseStore,
  FirebaseContext,
} from './stores/firebase-store/firebase-store';
import {
  MainPageStore,
  MainPageStoreContext,
} from './stores/main-page-store/main-page-store';
import { ThemeStoreProvider } from './stores/theme-store/theme-store';

const App = (): JSX.Element | null => {
  const [bootState, setBootState] = useState<BootState>(BootState.None);
  const [firebaseStore, setFirebaseStore] = useState<FirebaseStore>();
  const [adminStore, setAdminStore] = useState<AdminStore>();
  const [mainPageStore, setMainPageStore] = useState<MainPageStore>();

  useEffect(() => {
    setBootState(BootState.Loading);

    const firebase = new FirebaseStore();
    const adminPagesStore = new AdminStore(firebase);
    const mainStore = new MainPageStore(firebase);

    try {
      setFirebaseStore(firebase);
      setAdminStore(adminPagesStore);
      setMainPageStore(mainStore);
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
              <AdminStoreContext.Provider value={adminStore}>
                <MainPageStoreContext.Provider value={mainPageStore}>
                  <RouterComponent />
                </MainPageStoreContext.Provider>
              </AdminStoreContext.Provider>
            </AuthStoreProvider>
          </ThemeStoreProvider>
        </FirebaseContext.Provider>
      );
    case BootState.Loading:
      return <Loader />;
    case BootState.Error:
      return (
        <TechnicalIssues message="При рендере приложения возникла ошибка, перезагрузите" />
      );
    default:
      return null;
  }
};

export default App;
