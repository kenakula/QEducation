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
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  deleteObject,
  FirebaseStorage,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  UploadResult,
} from 'firebase/storage';
import React from 'react';
import { FirestoreCollection } from 'app/constants/firestore-collections';
import { firebaseProdConfig } from 'app/constants/firebase-config';
import { StorageFolder } from 'app/constants/storage-folder';

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

  deleteDocument = async (
    collName: FirestoreCollection,
    docId: string,
  ): Promise<void> => deleteDoc(doc(this.store, collName, docId));

  uploadFile = async (
    folder: StorageFolder,
    fileName: string,
    file: File,
  ): Promise<UploadResult | void> => {
    const fileRef = ref(this.storage, `${folder}/${fileName}`);

    return uploadBytes(fileRef, file).catch(err => {
      console.error(err);
    });
  };

  deleteFile = async (
    folder: StorageFolder,
    fileName: string,
  ): Promise<void> => {
    const fileRef = ref(this.storage, `${folder}/${fileName}`);

    return deleteObject(fileRef).catch(err => {
      console.error(err);
    });
  };

  getFileUrl = async (
    folder: StorageFolder,
    fileName: string,
  ): Promise<string> => {
    const fileRef = ref(this.storage, `${folder}/${fileName}`);

    return getDownloadURL(fileRef);
  };
}

export const FirebaseContext = React.createContext<FirebaseStore | undefined>(
  undefined,
);

export const useFirebaseContext = (): FirebaseStore =>
  React.useContext(FirebaseContext)!;
