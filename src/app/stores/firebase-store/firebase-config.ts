import {
  firebaseProdConfig,
  firebaseTestConfig,
} from 'app/constants/firebase-config';

export const firebaseConfig =
  process.env.NODE_ENV === 'production'
    ? firebaseProdConfig
    : firebaseTestConfig;
