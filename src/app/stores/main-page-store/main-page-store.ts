import { BootState } from 'app/constants/boot-state';
import { Category } from 'app/constants/category-model';
import { FirestoreCollection } from 'app/constants/firestore-collections';
import { UserModel } from 'app/constants/user-model';
import { Auth, getAuth } from 'firebase/auth';
import { makeAutoObservable, runInAction } from 'mobx';
import React from 'react';
import { FirebaseStore } from '../firebase-store/firebase-store';
import { ArticleModel } from 'app/constants/article-model';
import { DocumentData } from 'firebase/firestore';
import { LocalStorageKeys } from 'app/constants/local-storage-keys';

export interface MainPageParams {
  role?: string;
  content?: string;
}

export class MainPageStore {
  private _bootState: BootState = BootState.None;
  public get bootState(): BootState {
    return this._bootState;
  }

  private _isInited: boolean = false;
  public get isInited(): boolean {
    return this._isInited;
  }

  public profileInfo: UserModel;
  public profileInfoUpdating: boolean = false;
  public categories: Category[] = [];
  public categoriesLoadState: BootState = BootState.None;
  public articles: ArticleModel[] = [];
  public articlesLoadState: BootState = BootState.None;
  public article: ArticleModel | null = null;
  public articleLoadState: BootState = BootState.None;

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

  updateUserInfo = async (id: string, data: UserModel): Promise<void> => {
    this.profileInfoUpdating = true;

    await this.firebase
      .updateDocument(FirestoreCollection.Users, id, data)
      .then(() => {
        runInAction(() => {
          this.profileInfoUpdating = false;
        });

        this.fetchUserInfo();
      });
  };

  checkArticleRead = async (
    articleId: string,
    value: boolean,
  ): Promise<void> => {
    await this.fetchUserInfo();

    if (!this.profileInfo) {
      return;
    }

    let readArticles = this.profileInfo.readArticles;

    if (value) {
      readArticles.push(articleId);
    } else {
      readArticles = readArticles.filter(item => item !== articleId);
    }

    const data = { ...this.profileInfo, readArticles };
    await this.updateUserInfo(this.profileInfo.uid, data);
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

  resetArticle = (): void => {
    this.article = null;
    this.articleLoadState = BootState.None;
  };

  fetchArticle = async (id: string): Promise<void> => {
    this.articleLoadState = BootState.Loading;

    this.firebase
      .readDocument(FirestoreCollection.Articles, id)
      .then((value: void | DocumentData | undefined) => {
        if (value) {
          const data = value.data();

          runInAction(() => {
            this.article = data;
            this.articleLoadState = BootState.Success;
          });
        }
      })
      .catch(err => {
        console.error(err);
        this.articleLoadState = BootState.Error;
      });
  };

  init = async (): Promise<void> => {
    this._bootState = BootState.Loading;

    try {
      await this.fetchUserInfo();
      await this.fetchCategories();

      runInAction(() => {
        this._bootState = BootState.Success;
        this._isInited = true;
      });
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
