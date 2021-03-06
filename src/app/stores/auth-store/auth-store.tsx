/* eslint-disable react/jsx-no-constructed-context-values */
import { AuthStates } from 'app/constants/auth-state';
import { FirestoreCollection } from 'app/constants/firestore-collections';
import { SignInModel } from 'app/constants/sign-in-model';
import { SignUpModel } from 'app/constants/sign-up-model';
import { UserModel } from 'app/constants/user-model';

import {
  Auth,
  AuthError,
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
  User,
  UserCredential,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useFirebaseContext } from '../firebase-store/firebase-store';

type ContextProps = {
  auth: Auth;
  userInfo: UserModel | null;
  authError: AuthError | null;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  authState: AuthStates;
  currentUser: User | null;
  actionProcesing: boolean;
  signUp: (data: SignUpModel) => Promise<void>;
  signIn: (data: SignInModel) => Promise<void>;
  logOut: () => Promise<void>;
  deleteUserProfile: (user: User) => Promise<void>;
  changeEmail: (email: string, cb: () => void) => Promise<void>;
  resetPassword: (email: string, cb: () => void) => Promise<void>;
  changePassword: (password: string, cb: () => void) => Promise<void>;
  reauthenticateUser: (
    email: string,
    password: string,
  ) => Promise<UserCredential | void>;
};

interface Props {
  children: JSX.Element;
}

export const AuthStoreContext = React.createContext<Partial<ContextProps>>({});

export function useAuthStore(): Partial<ContextProps> {
  return useContext(AuthStoreContext);
}

export function AuthStoreProvider(props: Props): JSX.Element {
  const { children } = props;

  const [authError, setAuthError] = useState<AuthError | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<UserModel | null>(null);
  const [authState, setAuthState] = useState<AuthStates>(AuthStates.Processing);
  const [actionProcesing, setActionProcesing] = useState<boolean>(false);

  const auth = getAuth();
  const firebase = useFirebaseContext();
  auth.languageCode = 'ru';

  const getUserInfo = useCallback(
    async (id: string): Promise<void> => {
      firebase.readDocument(FirestoreCollection.Users, id).then(value => {
        if (value) {
          setUserInfo(value.data());
        }
      });
    },
    [firebase],
  );

  const signUp = async (data: SignUpModel): Promise<void> => {
    setAuthError(null);
    setActionProcesing(true);
    return createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential: UserCredential) => {
        const user: User = userCredential.user;

        const userData: UserModel = {
          uid: userCredential.user.uid,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role,
          readArticles: [],
        };

        firebase.addDocument(FirestoreCollection.Users, userData, user.uid);

        setCurrentUser(user);
        setUserInfo(userData);
        setActionProcesing(false);
        setAuthState(AuthStates.Authorized);
      })
      .catch((err: AuthError) => {
        setAuthError(err);
        setActionProcesing(false);
        setAuthState(AuthStates.NotAuthorized);
      });
  };

  const signIn = async (data: SignInModel): Promise<void> => {
    setAuthError(null);
    setActionProcesing(true);
    return signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential: UserCredential) => {
        getUserInfo(userCredential.user.uid);
        setCurrentUser(userCredential.user);
        setActionProcesing(false);
        setAuthState(AuthStates.Authorized);
      })
      .catch((err: AuthError) => {
        setActionProcesing(false);
        setAuthError(err);
        setAuthState(AuthStates.NotAuthorized);
      });
  };

  const reauthenticateUser = async (
    email: string,
    password: string,
  ): Promise<UserCredential | void> => {
    const credentials = EmailAuthProvider.credential(email, password);

    return reauthenticateWithCredential(currentUser!, credentials).catch(
      (err: AuthError) => {
        setAuthError(err);
        setActionProcesing(false);
        console.error('error while reauth:', err);
      },
    );
  };

  const changeEmail = async (email: string, cb: () => void): Promise<void> => {
    setAuthError(null);
    setActionProcesing(true);
    return updateEmail(currentUser!, email)
      .then(() => {
        firebase.updateDocument(FirestoreCollection.Users, currentUser!.uid, {
          email,
        });
      })
      .then(() => {
        setActionProcesing(false);
        cb();
      })
      .catch((err: AuthError) => {
        setAuthError(err);
        setActionProcesing(false);
        console.error('error changing email');
      });
  };

  const changePassword = async (
    password: string,
    cb: () => void,
  ): Promise<void> => {
    setAuthError(null);
    setActionProcesing(true);

    return updatePassword(currentUser!, password)
      .then(() => {
        setActionProcesing(false);
        cb();
      })
      .catch((err: AuthError) => {
        setAuthError(err);
        setActionProcesing(false);
        console.error('error in changing password: ', err);
      });
  };

  const resetPassword = async (
    email: string,
    cb: () => void,
  ): Promise<void> => {
    setAuthError(null);
    setActionProcesing(true);
    return sendPasswordResetEmail(auth, email)
      .then(() => {
        setActionProcesing(false);
        cb();
      })
      .catch((err: AuthError) => {
        setAuthError(err);
        setActionProcesing(false);
        console.error('error in sending reset email');
      });
  };

  const deleteUserProfile = async (user: User): Promise<void> =>
    deleteUser(user).catch(e => console.error('error in delete user', e));

  const logOut = async (): Promise<void> =>
    signOut(auth).then(() => {
      setAuthState(AuthStates.NotAuthorized);
      setCurrentUser(null);
      setUserInfo(null);
    });

  function getErrorMessage(error: AuthError): string {
    switch (error.code) {
      case 'auth/wrong-password':
        return '???????????????????????? ????????????';
      case 'auth/email-already-exists':
      case 'auth/email-already-in-use':
        return '???????????????????????? ?? ?????????? ???????????? ?????? ??????????????????????????????';
      case 'auth/user-not-found':
        return '???????????????????????? ?? ?????????? ???????????? ???? ??????????????????????????????';
      case 'auth/internal-error':
        return '???????????????????? ???????????? ??????????????. ???????????????????? ??????????. ???????? ???????????????? ??????????????????????, ???????????????????? ?? ??????????????????';
      case 'auth/weak-password':
        return '?????????????? ???????????? ????????????. ?????????????? ???? ?????????? 6 ????????????????';
      case 'auth/user-mismatch':
        return '?????????????????????? ?????????????? ??????????';
      default:
        return '???????????? ??????????????. ???????????????????? ??????????';
    }
  }

  useEffect(() => {
    if (authError) {
      setErrorMessage(getErrorMessage(authError));
    } else {
      setErrorMessage('');
    }
  }, [authError]);

  useEffect(() => {
    setAuthState(AuthStates.Processing);
    const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
      if (user) {
        getUserInfo(user.uid);
        setCurrentUser(user);
        setAuthState(AuthStates.Authorized);
      } else {
        setAuthState(AuthStates.NotAuthorized);
      }
    });

    return unsubscribe;
  }, [auth, getUserInfo]);

  const value = {
    auth,
    userInfo,
    authState,
    authError,
    errorMessage,
    setErrorMessage,
    currentUser,
    signIn,
    signUp,
    logOut,
    changeEmail,
    resetPassword,
    changePassword,
    actionProcesing,
    deleteUserProfile,
    reauthenticateUser,
  };

  return (
    <AuthStoreContext.Provider value={value}>
      {children}
    </AuthStoreContext.Provider>
  );
}
