import { BootState } from 'app/constants/boot-state';
import { Category } from 'app/constants/category-model';
import { FirestoreCollection } from 'app/constants/firestore-collections';
import { userTabs } from 'app/constants/tabs';
import { UserModel } from 'app/constants/user-model';
import { Auth, getAuth } from 'firebase/auth';
import { makeAutoObservable, runInAction } from 'mobx';
import React from 'react';
import { FirebaseStore } from '../firebase-store/firebase-store';
import { ArticleModel } from 'app/constants/article-model';

export class MainPageStore {
  private _bootState: BootState = BootState.None;
  public get bootState(): BootState {
    return this._bootState;
  }

  public currentUserTab: string = userTabs[0].value;
  public profileInfo: UserModel;
  public categories: Category[] = [];
  public categoriesLoadState: BootState = BootState.None;
  public articles: ArticleModel[] = [];
  public articlesLoadState: BootState = BootState.None;

  constructor(private firebase: FirebaseStore, private auth: Auth = getAuth()) {
    makeAutoObservable(this);
  }

  fetchUserInfo = async (): Promise<void> => {
    if (this.auth.currentUser) {
      await this.firebase
        .readDocument(FirestoreCollection.Users, this.auth.currentUser.uid)
        .then(val => {
          if (val) {
            runInAction(() => (this.profileInfo = val.data()));
          }
        });
    }
  };

  fetchCategories = async (): Promise<void> => {
    this.categoriesLoadState = BootState.Loading;

    this.firebase
      .readDocument(FirestoreCollection.Resources, 'categories')
      .then(value => {
        const response = value?.data();
        runInAction(() => {
          this.categories = response.list;
          this.categoriesLoadState = BootState.Success;
        });
      })
      .catch(error => {
        console.error(error);
        this.categoriesLoadState = BootState.Error;
      });
  };

  fetchArticlesByCategory = async (label: string): Promise<void> => {
    this.articlesLoadState = BootState.Loading;

    this.firebase
      .queryForDocumentInCollection<ArticleModel>(
        FirestoreCollection.Articles,
        'categories',
        label,
      )
      .then(res =>
        runInAction(() => {
          this.articles = res;
          this.articlesLoadState = BootState.Success;
        }),
      )
      .catch(err =>
        runInAction(() => {
          console.error(err);
          this.articlesLoadState = BootState.Error;
        }),
      );
  };

  setUserTab = (value: string): void => {
    this.currentUserTab = value;
  };

  init = async (): Promise<void> => {
    this._bootState = BootState.Loading;

    try {
      await this.fetchUserInfo();

      runInAction(() => (this._bootState = BootState.Success));
    } catch (error) {
      console.error(error);
      this._bootState = BootState.Error;
    }
  };
}

export const MainPageStoreContext = React.createContext<
  MainPageStore | undefined
>(undefined);
export const useMainPageStore = (): MainPageStore =>
  React.useContext(MainPageStoreContext)!;
