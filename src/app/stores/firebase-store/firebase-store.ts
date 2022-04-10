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
import React from 'react';
import { FirestoreCollection } from 'app/constants/firestore-collections';
import { firebaseProdConfig } from 'app/constants/firebase-config';

export class FirebaseStore {
  app: FirebaseApp;
  auth: Auth;
  store: Firestore;

  constructor() {
    this.app = initializeApp(firebaseProdConfig);
    this.store = getFirestore();
    this.auth = getAuth(this.app);

    makeAutoObservable(this);
  }

  readDocument = async (
    collName: FirestoreCollection,
    docId: string,
  ): Promise<void | DocumentData | undefined> => {
    const ref = doc(this.store, collName, docId);
    return getDoc(ref).catch((err: FirebaseError) => {
      console.error('error when getting document', err);
    });
  };

  queryForDocumentInCollection = async <T>(
    collName: FirestoreCollection,
    field: string,
    value: string,
  ): Promise<T[]> => {
    const result: T[] = [];
    const ref = collection(this.store, collName);
    const q = query(ref, where(field, 'array-contains', value));
    const snapShot = await getDocs(q);
    snapShot.forEach(val => result.push(val.data() as T));

    return result;
  };

  updateDocument = async (
    collName: FirestoreCollection,
    docId: string,
    data: any,
  ): Promise<void> => {
    const ref = doc(this.store, collName, docId);

    return updateDoc(ref, data).catch(err =>
      console.error('document update error: ', err),
    );
  };

  getDocumentsFormCollection = async (
    collName: FirestoreCollection,
  ): Promise<any[]> => {
    const result: any[] = [];
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
    const ref = doc(this.store, collName, docId);
    return setDoc(ref, data).catch((err: FirebaseError) => {
      console.error('error when adding document', err);
    });
  };

  async deleteDocument(
    collName: FirestoreCollection,
    docId: string,
  ): Promise<void> {
    return deleteDoc(doc(this.store, collName, docId));
  }
}

export const FirebaseContext = React.createContext<FirebaseStore | undefined>(
  undefined,
);

export const useFirebaseContext = (): FirebaseStore =>
  React.useContext(FirebaseContext)!;
