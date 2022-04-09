export const firebaseTestConfig = {
  apiKey: process.env.REACT_APP_TEST_API_KEY,
  authDomain: process.env.REACT_APP_TEST_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_TEST_PROJECT_ID,
  storageBucket: process.env.REACT_APP_TEST_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_TEST_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_TEST_ID,
};

export const firebaseProdConfig = {
  apiKey: process.env.REACT_APP_PRODUCTION_API_KEY,
  authDomain: process.env.REACT_APP_PRODUCTION_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PRODUCTION_PROJECT_ID,
  storageBucket: process.env.REACT_APP_PRODUCTION_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_PRODUCTION_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_PRODUCTION_ID,
  measurementId: process.env.REACT_APP_PRODUCTION_MEASURMENT_ID,
};
