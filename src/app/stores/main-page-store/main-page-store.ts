import { BootState } from 'app/constants/boot-state';
import { Category, CategoryArticle } from 'app/constants/category-model';
import { FirestoreCollection } from 'app/constants/firestore-collections';
import { UserModel } from 'app/constants/user-model';
import { Auth, getAuth } from 'firebase/auth';
import { makeAutoObservable, runInAction } from 'mobx';
import React from 'react';
import { FirebaseStore } from '../firebase-store/firebase-store';
import { ArticleModel } from 'app/constants/article-model';
import { DocumentData } from 'firebase/firestore';
import { IRole, UserRole } from 'app/constants/user-roles';

export interface MainPageParams {
  role?: UserRole;
  content?: PageContentType;
}

export interface ArtilcesPageParams {
  role?: UserRole;
  article?: string;
}

// eslint-disable-next-line no-shadow
export enum PageContentType {
  Articles = 'articles',
  Checklists = 'checklists',
  Vebinars = 'vebinars',
  Scripts = 'scripts',
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

  public pageParams: MainPageParams;
  public profileInfo: UserModel;
  public isSuperAdmin: boolean;
  public profileInfoUpdating: boolean = false;
  public selectedCategory: Category;
  public categories: Category[] = [];
  public roles: IRole[] = [];
  public roleCategories: Category[] = [];
  public categoriesLoadState: BootState = BootState.None;
  public articles: ArticleModel[] = [];
  public articlesLoadState: BootState = BootState.None;
  public article: ArticleModel | null = null;
  public articleLoadState: BootState = BootState.None;

  constructor(private firebase: FirebaseStore, private auth: Auth = getAuth()) {
    makeAutoObservable(this);
  }

  setPageParams = (obj: any): void => {
    this.pageParams = {
      ...this.pageParams,
      ...obj,
    };
  };

  fetchUserInfo = async (): Promise<void> => {
    if (this.auth.currentUser) {
      await this.firebase
        .readDocument(FirestoreCollection.Users, this.auth.currentUser.uid)
        .then(val => {
          if (val) {
            runInAction(() => {
              this.profileInfo = val.data();
              if (this.profileInfo.isSuperAdmin) {
                this.isSuperAdmin = true;
              }
            });
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
    if (!this.profileInfo) {
      await this.fetchUserInfo();
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

  getUserCategories = async (role: UserRole): Promise<void> => {
    if (!this.roles.length) {
      await this.fetchRoles();
    }

    const currentRole = this.roles.find(item => item.title === role);

    if (currentRole) {
      const categories = currentRole.categories;

      runInAction(() => {
        this.roleCategories = categories;
      });
    }
  };

  getArticlesFromUserCategories = (categoryId: string): CategoryArticle[] => {
    const category = this.roleCategories.find(item => item.id === categoryId);

    if (!category) {
      return [];
    }

    return category.articles;
  };

  fetchCategories = async (): Promise<void> => {
    this.categoriesLoadState = BootState.Loading;

    try {
      const response = await this.firebase.getDocumentsFormCollection<Category>(
        FirestoreCollection.Categories,
      );

      runInAction(() => {
        this.categories = response;
        this.categoriesLoadState = BootState.Success;
      });
    } catch (error) {
      console.error(error);
      this.categoriesLoadState = BootState.Error;
    }
  };

  getCategoryById = async (id: string): Promise<void> => {
    if (!this.categories.length) {
      await this.fetchCategories();
    }

    const selectedCategory = this.categories.find(item => item.id === id);

    if (selectedCategory) {
      this.selectedCategory = selectedCategory;
    }
  };

  fetchArticlesByCategory = async (id: string): Promise<void> => {
    this.articlesLoadState = BootState.Loading;

    if (!this.categories.length) {
      await this.fetchCategories();
    }

    const selectedCategory = this.categories.find(item => item.id === id);

    if (!selectedCategory) {
      return;
    }

    this.firebase
      .queryForDocumentInCollection<ArticleModel>(
        FirestoreCollection.Articles,
        'categories',
        selectedCategory.title,
      )
      .then(list => {
        runInAction(() => {
          this.articles = list;
          this.selectedCategory = selectedCategory;
          this.articlesLoadState = BootState.Success;
        });
      })
      .catch(error => {
        console.error(error);
        this.articlesLoadState = BootState.Error;
      });
  };

  resetArticle = (): void => {
    this.article = null;
    this.articleLoadState = BootState.None;
  };

  resetArticles = (): void => {
    this.articles = [];
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

  fetchRoles = async (): Promise<void> => {
    try {
      const response = await this.firebase.getDocumentsFormCollection<IRole>(
        FirestoreCollection.Roles,
      );

      runInAction(() => {
        this.roles = response;
      });
    } catch (error) {
      console.error(error);
    }
  };

  init = async (): Promise<void> => {
    this._bootState = BootState.Loading;
    this._isInited = false;

    try {
      await this.fetchRoles();
      await this.fetchUserInfo();
      await this.fetchCategories();

      runInAction(() => {
        this._bootState = BootState.Success;
        this._isInited = true;
      });
    } catch (error) {
      console.error(error);
      this._isInited = false;
      this._bootState = BootState.Error;
    }
  };

  dispose = (): void => {
    this.isSuperAdmin = false;
  };
}

export const MainPageStoreContext = React.createContext<
  MainPageStore | undefined
>(undefined);
export const useMainPageStore = (): MainPageStore =>
  React.useContext(MainPageStoreContext)!;
