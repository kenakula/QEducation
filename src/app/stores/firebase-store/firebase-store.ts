import { initializeApp, FirebaseApp, FirebaseError } from 'firebase/app';
import { makeAutoObservable } from 'mobx';
import { Auth, getAuth } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  Unsubscribe,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  deleteObject,
  FirebaseStorage,
  getDownloadURL,
  getStorage,
  listAll,
  ListResult,
  ref,
  StorageError,
  StorageObserver,
  uploadBytes,
  uploadBytesResumable,
  UploadResult,
  UploadTaskSnapshot,
} from 'firebase/storage';
import React from 'react';
import { FirestoreCollection } from 'app/constants/firestore-collections';
import { firebaseProdConfig } from 'app/constants/firebase-config';

export type NextObserverType =
  | StorageObserver<UploadTaskSnapshot>
  | ((snapshot: UploadTaskSnapshot) => unknown)
  | null
  | undefined;

export type ErrorObserverType =
  | ((a: StorageError) => unknown)
  | null
  | undefined;

export type CompleteObserverType = Unsubscribe | null | undefined;

export class FirebaseStore {
  app: FirebaseApp;
  auth: Auth;
  store: Firestore;
  storage: FirebaseStorage;

  constructor() {
    this.app = initializeApp(firebaseProdConfig);
    this.store = getFirestore();
    this.auth = getAuth(this.app);
    this.storage = getStorage();

    makeAutoObservable(this);
  }

  readDocument = async (
    collName: FirestoreCollection,
    docId: string,
  ): Promise<void | DocumentData | undefined> => {
    const reference = doc(this.store, collName, docId);
    return getDoc(reference).catch((err: FirebaseError) => {
      console.error('error when getting document', err);
    });
  };

  readDeepDocument = async (
    collName: FirestoreCollection,
    pathSegments: string[],
    docId: string,
  ): Promise<void | DocumentData | undefined> => {
    const reference = doc(this.store, collName, ...pathSegments, docId);
    return getDoc(reference).catch((err: FirebaseError) => {
      console.error('error when getting document', err);
    });
  };

  queryForDocumentInCollection = async <T>(
    collName: FirestoreCollection,
    field: string,
    value: string,
  ): Promise<T[]> => {
    const result: T[] = [];
    const reference = collection(this.store, collName);
    const q = query(reference, where(field, 'array-contains', value));
    const snapShot = await getDocs(q);
    snapShot.forEach(val => result.push(val.data() as T));

    return result;
  };

  updateDocument = async (
    collName: FirestoreCollection,
    docId: string,
    data: any,
  ): Promise<void> => {
    const reference = doc(this.store, collName, docId);

    return updateDoc(reference, data).catch(err =>
      console.error('document update error: ', err),
    );
  };

  updateDeepDocument = async (
    collName: FirestoreCollection,
    pathSegements: string[],
    docId: string,
    data: any,
  ): Promise<void> => {
    const reference = doc(this.store, collName, ...pathSegements, docId);

    return updateDoc(reference, data).catch(err =>
      console.error('document update error: ', err),
    );
  };

  getDocumentsFromDeepCollection = async <T>(
    collName: FirestoreCollection,
    pathSegments: string[],
  ): Promise<T[]> => {
    const result: T[] = [];
    const collRef = collection(this.store, collName, ...pathSegments);
    const snapShot = await getDocs(collRef);

    snapShot.forEach((document: DocumentData) => {
      result.push(document.data());
    });

    return result;
  };

  getDocumentsFormCollection = async <T>(
    collName: FirestoreCollection,
  ): Promise<T[]> => {
    const result: T[] = [];
    const q = query(collection(this.store, collName));

    const snapShot = await getDocs(q);

    snapShot.forEach((document: DocumentData) => {
      result.push(document.data());
    });

    return result;
  };

  addDocument = async <T>(
    collName: FirestoreCollection,
    data: T,
    docId: string,
  ): Promise<void> => {
    const reference = doc(this.store, collName, docId);
    return setDoc(reference, data).catch((err: FirebaseError) => {
      console.error('error when adding document', err);
    });
  };

  addDocToDeepCollection = async <T>(
    collName: FirestoreCollection,
    pathSegements: string[],
    docId: string,
    data: T,
  ): Promise<void> => {
    const reference = doc(this.store, collName, ...pathSegements, docId);

    return setDoc(reference, data).catch((err: FirebaseError) => {
      console.error('error when adding document', err);
    });
  };

  deleteDocument = async (
    collName: FirestoreCollection,
    docId: string,
  ): Promise<void> => deleteDoc(doc(this.store, collName, docId));

  deleteDeepDocument = async (
    collName: FirestoreCollection,
    pathSegements: string[],
    docId: string,
  ): Promise<void> => {
    const reference = doc(this.store, collName, ...pathSegements, docId);

    return deleteDoc(reference);
  };

  getFolderContents = async (folder: string): Promise<ListResult> => {
    const reference = ref(this.storage, folder);

    return listAll(reference);
  };

  uploadFile = async (
    path: string,
    file: File,
  ): Promise<UploadResult | void> => {
    const fileRef = ref(this.storage, path);

    return uploadBytes(fileRef, file).catch(err => {
      console.error(err);
    });
  };

  uploadFileWithProgress = (
    path: string,
    file: File,
    next: NextObserverType,
    error?: ErrorObserverType,
    complete?: CompleteObserverType,
  ): void => {
    const fileRef = ref(this.storage, path);

    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on('state_changed', next, error, complete);
  };

  deleteFile = async (path: string): Promise<void> => {
    const fileRef = ref(this.storage, path);

    return deleteObject(fileRef).catch(err => {
      console.error(err);
    });
  };

  getFileUrl = async (path: string): Promise<string> => {
    const fileRef = ref(this.storage, path);

    return getDownloadURL(fileRef);
  };
}

export const FirebaseContext = React.createContext<FirebaseStore | undefined>(
  undefined,
);

export const useFirebaseContext = (): FirebaseStore =>
  React.useContext(FirebaseContext)!;
