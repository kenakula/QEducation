import React from 'react';
import { makeAutoObservable, runInAction } from 'mobx';
import { BootState } from 'app/constants/boot-state';
import { FirebaseStore } from '../firebase-store/firebase-store';
import { ArticleModel } from 'app/constants/article-model';
import { FirestoreCollection } from 'app/constants/firestore-collections';
import { UserModel } from 'app/constants/user-model';
import { nanoid } from 'nanoid';
import { Category, CategoryArticle } from 'app/constants/category-model';
import { IRole, UserRole } from 'app/constants/user-roles';
import { UserCategoriesFormModel } from 'app/pages/main-page/sub-components/user-categories-dialog';
import { VebinarModel } from 'app/constants/vebinar-model';

export class AdminStore {
  private _bootState: BootState = BootState.None;
  private _isInited: boolean = false;
  private _autosaveTimeout: NodeJS.Timeout;

  public goBackToMainUrl: string;
  public roles: IRole[] = [];
  public articles: ArticleModel[] = [];
  public articlesLoading: boolean;
  public categories: Category[] = [];
  public editingUserCategory: string;
  public excludedArticlesFromCategoryList: string[] = [];
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

  setExcludedArticlesFromCategoryList = (id: string): void => {
    const hasItem = this.excludedArticlesFromCategoryList.includes(id);

    if (hasItem) {
      this.excludedArticlesFromCategoryList =
        this.excludedArticlesFromCategoryList.filter(item => item !== id);
    } else {
      this.excludedArticlesFromCategoryList.push(id);
    }
  };

  addVebinar = async (data: VebinarModel): Promise<void> =>
    this.firebase.addDocument(FirestoreCollection.Vebinars, data, data.id);

  deleteVebinar = async (id: string): Promise<void> =>
    this.firebase.deleteDocument(FirestoreCollection.Vebinars, id);

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

  setEditingUserCategory = (id: string): void => {
    this.editingUserCategory = id;
  };

  addArticleToUserCategory = async (
    data: CategoryArticle,
    role: UserRole,
    category: Category,
  ): Promise<void> => {
    if (!this.roles.length) {
      await this.fetchRoles();
    }

    if (!this.categories.length) {
      await this.getCategories();
    }

    const roleItem = this.roles.find(item => item.title === role);
    const initialCategories = roleItem!.categories;
    const newArr = initialCategories.map(item => {
      if (item.id === category.id) {
        const newArticles: CategoryArticle[] = [...item.articles, data];
        return { ...item, articles: newArticles };
      }

      return item;
    });

    this.firebase.updateDocument(FirestoreCollection.Roles, role, {
      categories: newArr,
    });
  };

  deleteUserCategory = async (
    categoryId: string,
    role: UserRole,
  ): Promise<void> => {
    if (!this.roles.length) {
      await this.fetchRoles();
    }

    if (!this.categories.length) {
      await this.getCategories();
    }

    const roleItem = this.roles.find(item => item.title === role);
    const roleCategories = roleItem!.categories;

    const newArr = roleCategories.filter(item => item.id !== categoryId);

    this.firebase.updateDocument(FirestoreCollection.Roles, role, {
      categories: newArr,
    });
  };

  setUserCategory = async (
    categoryId: string,
    role: UserRole,
    data: UserCategoriesFormModel,
  ): Promise<void> => {
    if (!this.roles.length) {
      await this.fetchRoles();
    }

    if (!this.categories.length) {
      await this.getCategories();
    }

    const roleItem = this.roles.find(item => item.title === role);
    const roleCategories = roleItem!.categories;
    const hasCurrentCategory = roleCategories?.some(
      item => item.id === categoryId,
    );
    const categoryObj = this.categories.find(item => item.id === categoryId);

    if (!categoryObj) {
      return;
    }

    const listOfArticles: CategoryArticle[] = data.list.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
    }));

    let newArr: Category[] = [];

    if (hasCurrentCategory) {
      newArr = roleCategories!.filter(item => item.id !== categoryId);

      newArr.push({ ...categoryObj, articles: listOfArticles });
    } else {
      roleCategories!.push({ ...categoryObj, articles: listOfArticles });
      newArr = roleCategories;
    }

    this.firebase.updateDocument(FirestoreCollection.Roles, role, {
      categories: newArr,
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

  getArticles = async (): Promise<void> => {
    this.articlesLoading = true;

    this.firebase
      .getDocumentsFormCollection<ArticleModel>(FirestoreCollection.Articles)
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
    try {
      const response = await this.firebase.getDocumentsFormCollection<Category>(
        FirestoreCollection.Categories,
      );

      runInAction(() => {
        this.categories = response;
      });
    } catch (error) {
      console.error(error);
    }
  };

  saveCategory = async (data: Category): Promise<void> => {
    try {
      await this.firebase.addDocument(
        FirestoreCollection.Categories,
        data,
        data.id,
      );
      await this.getCategories();
    } catch (error) {
      console.error(error);
    }
  };

  deleteCategory = async (categoryId: string): Promise<void> => {
    try {
      await this.firebase.deleteDocument(
        FirestoreCollection.Categories,
        categoryId,
      );
      await this.getCategories();
    } catch (error) {
      console.error(error);
    }
  };

  getArticleFromStorage = (): ArticleModel | null => {
    const savedArticle = localStorage.getItem('article');

    if (savedArticle) {
      return JSON.parse(savedArticle);
    }

    return null;
  };

  deleteArticleFromStorage = (): void => {
    localStorage.removeItem('article');
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

  editArticle = (data: ArticleModel, url?: string): void => {
    this.editingArticle = data;
    this.saveArticleToStorage(data);

    if (url) {
      this.goBackToMainUrl = url;
    }
  };

  getUsers = async (): Promise<void> => {
    this.usersLoading = true;

    this.firebase
      .getDocumentsFormCollection<UserModel>(FirestoreCollection.Users)
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
