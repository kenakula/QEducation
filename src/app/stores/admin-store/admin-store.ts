import React from 'react';
import { makeAutoObservable, runInAction } from 'mobx';
import { BootState } from 'app/constants/boot-state';
import { FirebaseStore } from '../firebase-store/firebase-store';
import { ArticleModel } from 'app/constants/article-model';
import { FirestoreCollection } from 'app/constants/firestore-collections';
import { FirestoreResources } from 'app/constants/firestore-resources';
import { DocumentData } from 'firebase/firestore';
import { UserModel } from 'app/constants/user-model';
import { nanoid } from 'nanoid';
import { Category } from 'app/constants/category-model';

export class AdminStore {
  private _bootState: BootState = BootState.None;
  private _isInited: boolean = false;
  private _autosaveTimeout: NodeJS.Timeout;

  public articles: ArticleModel[] = [];
  public articlesLoading: boolean;
  public categories: Category[] = [];
  public users: UserModel[] = [];
  public usersLoading: boolean;
  public userDetailsInfo: UserModel;

  public editingArticle: ArticleModel;
  public articleAutoSave: boolean = false;

  get bootState(): BootState {
    return this._bootState;
  }

  get isInited(): boolean {
    return this._isInited;
  }

  constructor(private firebase: FirebaseStore) {
    makeAutoObservable(this);
  }

  startArticleAutosave = (cb: () => void, timeout: number): void => {
    this.articleAutoSave = true;
    this._autosaveTimeout = setTimeout(() => {
      cb();

      if (this.articleAutoSave) {
        this.startArticleAutosave(cb, timeout);
      }
    }, timeout);
  };

  stopArticleAutoSave = (): void => {
    this.articleAutoSave = false;
    clearTimeout(this._autosaveTimeout);
  };

  getArticles = async (): Promise<void> => {
    this.articlesLoading = true;

    this.firebase
      .getDocumentsFormCollection(FirestoreCollection.Articles)
      .then(value => {
        runInAction(() => {
          this.articles = value;
          this.articlesLoading = false;
        });
      })
      .catch(err => {
        console.error(err);
        this.articlesLoading = false;
      });
  };

  getCategories = async (): Promise<void> => {
    this.firebase
      .readDocument(
        FirestoreCollection.Resources,
        FirestoreResources.Categories,
      )
      .then((value: void | DocumentData | undefined) => {
        if (value) {
          const data = value.data();
          runInAction(() => {
            this.categories = data.list;
          });
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  saveCategory = async (data: Category): Promise<void> => {
    this.categories.push(data);

    try {
      await this.firebase.updateDocument(
        FirestoreCollection.Resources,
        'categories',
        { list: this.categories },
      );
    } catch (error) {
      console.error(error);
    }
    this.getCategories();
  };

  deleteCategory = async (category: string): Promise<void> => {
    this.categories = this.categories.filter(item => item.label !== category);
    await this.firebase.updateDocument(
      FirestoreCollection.Resources,
      'categories',
      {
        list: this.categories,
      },
    );
    this.getCategories();
  };

  getArticleFromStorage = (): ArticleModel | null => {
    const savedArticle = localStorage.getItem('article');

    if (savedArticle) {
      return JSON.parse(savedArticle);
    }

    return null;
  };

  deleteArticleFromStorage = (): void => {
    localStorage.clear();
  };

  saveArticleToStorage = (data: ArticleModel): void => {
    localStorage.setItem('article', JSON.stringify(data));
  };

  saveArticle = async (data: ArticleModel): Promise<void> =>
    this.firebase
      .addDocument(FirestoreCollection.Articles, data, data.id)
      .then(() => {
        this.getArticles();
      });

  deleteArticle = async (id: string): Promise<void> => {
    await this.firebase
      .deleteDocument(FirestoreCollection.Articles, id)
      .then(() => {
        this.getArticles();
      });
  };

  emptyArticle = (): void => {
    this.editingArticle = {
      id: nanoid(),
      title: '',
      description: '',
      delta: '',
      roles: [],
      categories: [],
      readMore: [],
    };
  };

  editArticle = (data: ArticleModel): void => {
    this.editingArticle = data;
    this.saveArticleToStorage(data);
  };

  getUsers = async (): Promise<void> => {
    this.usersLoading = true;

    this.firebase
      .getDocumentsFormCollection(FirestoreCollection.Users)
      .then(value => {
        runInAction(() => {
          this.users = value;
          this.usersLoading = false;
        });
      })
      .catch(err => {
        console.error(err);
        this.usersLoading = false;
      });
  };

  getUserInfo = async (id: string): Promise<void> => {
    this.firebase
      .readDocument(FirestoreCollection.Users, id)
      .then(val => {
        if (val) {
          runInAction(() => {
            this.userDetailsInfo = val.data();
          });
        }
      })
      .catch(err => console.error(err));
  };

  toggleSuperAdmin = async (uid: string, state: boolean): Promise<void> => {
    await this.firebase.updateDocument(FirestoreCollection.Users, uid, {
      isSuperAdmin: state,
    });
  };

  deleteUserProfile = async (id: string): Promise<void> => {
    this.firebase
      .deleteDocument(FirestoreCollection.Users, id)
      .then(() => this.getUsers());
  };

  init = async (): Promise<void> => {
    this._bootState = BootState.Loading;

    try {
      await this.getArticles();
      await this.getUsers();
      await this.getCategories();

      runInAction(() => {
        this._bootState = BootState.Success;
      });
    } catch (err) {
      this._bootState = BootState.Error;
    }

    this._isInited = true;
  };
}

export const AdminStoreContext = React.createContext<AdminStore | undefined>(
  undefined,
);
export const useAdminStore = (): AdminStore =>
  React.useContext(AdminStoreContext)!;
