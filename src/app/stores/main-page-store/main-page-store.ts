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
import { VebinarModel } from 'app/constants/vebinar-model';
import { StorageFolder } from 'app/constants/storage-folder';
import { NotificationModel } from 'app/constants/notification-model';
import { PageContentType } from 'app/constants/page-content-type';
import {
  DocumentsFolderModel,
  FolderItem,
} from 'app/constants/documents-folder-model';
import { StorageReference } from 'firebase/storage';

export interface MainPageParams {
  role?: UserRole;
  content?: PageContentType;
}

export interface ArtilcesPageParams {
  role?: UserRole;
  article?: string;
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

  public userCategoryArticles: CategoryArticle[] = [];
  public selectedContentTab: PageContentType = PageContentType.Categories;
  public selectedRole: UserRole = UserRole.Doctor;
  public profileInfo: UserModel;
  public notifications: NotificationModel[] = [];
  public profileImageUrl: string = '';
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
  public vebinars: VebinarModel[] = [];
  public vebinarsLoadState: BootState = BootState.None;
  public documents: DocumentsFolderModel[] = [];
  public documentsLoadState: BootState = BootState.None;

  constructor(private firebase: FirebaseStore, private auth: Auth = getAuth()) {
    makeAutoObservable(this);
  }

  setProfileImageUrl = (url: string): void => {
    this.profileImageUrl = url;
  };

  setSelectedRole = (role: UserRole): void => {
    this.selectedRole = role;
  };

  setSelectedContentTab = (tab: PageContentType): void => {
    this.selectedContentTab = tab;
  };

  fetchDocumentsFolders = async (): Promise<void> => {
    this.documentsLoadState = BootState.Loading;

    try {
      const list = await this.firebase.getFolderContents(
        StorageFolder.Documents,
      );

      const result: DocumentsFolderModel[] = list.prefixes.map(
        (prefix: StorageReference) => ({
          name: prefix.name,
          ref: prefix,
          items: [],
        }),
      );

      runInAction(() => {
        this.documents = result;
      });

      this.fetchFolderDocuments();
    } catch (err) {
      runInAction(() => {
        this.documentsLoadState = BootState.Error;
      });
    }
  };

  fetchFolderDocuments = async (): Promise<void> => {
    try {
      for (let i = 0; i < this.documents.length; i++) {
        const list = await this.firebase.getFolderContents(
          this.documents[i].ref.fullPath,
        );

        const result: FolderItem[] = list.items.map(item => ({
          name: item.name,
          fullPath: item.fullPath,
        }));

        runInAction(() => {
          this.documents[i].items = result;
        });
      }

      runInAction(() => {
        this.documentsLoadState = BootState.Success;
      });
    } catch (err) {
      runInAction(() => {
        this.documentsLoadState = BootState.Error;
      });
    }
  };

  fetchVebinars = async (): Promise<void> => {
    this.vebinarsLoadState = BootState.Loading;

    try {
      const response =
        await this.firebase.getDocumentsFormCollection<VebinarModel>(
          FirestoreCollection.Vebinars,
        );

      runInAction(() => {
        this.vebinars = response;
        this.vebinarsLoadState = BootState.Success;
      });
    } catch (err) {
      console.error(err);
      this.vebinarsLoadState = BootState.Error;
    }
  };

  fetchUserInfo = async (): Promise<void> => {
    if (this.auth.currentUser) {
      await this.firebase
        .readDocument(FirestoreCollection.Users, this.auth.currentUser.uid)
        .then(val => {
          if (val) {
            runInAction(() => {
              this.profileInfo = val.data();

              this.fetchUserNotifications(this.profileInfo.uid);

              if (this.profileInfo.isSuperAdmin) {
                this.isSuperAdmin = true;
              }
            });
          }
        });

      await this.getUserImage();
    }
  };

  fetchUserNotifications = async (uid: string): Promise<void> => {
    const notifications =
      await this.firebase.getDocumentsFromDeepCollection<NotificationModel>(
        FirestoreCollection.Users,
        [uid, FirestoreCollection.Notifications],
      );

    runInAction(() => {
      this.notifications = notifications;
    });
  };

  readNotification = async (id: string): Promise<void> => {
    this.firebase
      .updateDeepDocument(
        FirestoreCollection.Users,
        [this.profileInfo.uid, FirestoreCollection.Notifications],
        id,
        { read: true },
      )
      .then(() => {
        this.fetchUserNotifications(this.profileInfo.uid);
      });
  };

  removeNotification = async (id: string): Promise<void> => {
    this.firebase
      .deleteDeepDocument(
        FirestoreCollection.Users,
        [this.profileInfo.uid, FirestoreCollection.Notifications],
        id,
      )
      .then(() => {
        this.fetchUserNotifications(this.profileInfo.uid);
      });
  };

  getUserImage = async (): Promise<void> => {
    this.firebase
      .getFileUrl(`${StorageFolder.UserAvatars}/${this.profileInfo.uid}`)
      .then(url => {
        runInAction(() => {
          this.profileImageUrl = url;
        });
      });
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
    await this.fetchRoles();

    const currentRole = this.roles.find(
      item => item.title === (role ?? this.selectedRole),
    );

    if (!currentRole) {
      return;
    }

    const arr = await this.firebase.getDocumentsFromDeepCollection<Category>(
      FirestoreCollection.Roles,
      [currentRole.title, FirestoreCollection.RoleCategories],
    );

    runInAction(() => {
      this.roleCategories = arr;
    });
  };

  getArticlesFromUserCategory = async (categoryId: string): Promise<void> => {
    const category = this.roleCategories.find(item => item.id === categoryId);

    if (!category) {
      return;
    }

    runInAction(() => {
      this.userCategoryArticles = category.articles;
    });
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
      runInAction(() => {
        this.selectedCategory = selectedCategory;
      });
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
      await this.getUserCategories(
        this.isSuperAdmin ? this.selectedRole : this.profileInfo.role,
      );

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
    this.profileImageUrl = '';
  };
}

export const MainPageStoreContext = React.createContext<
  MainPageStore | undefined
>(undefined);
export const useMainPageStore = (): MainPageStore =>
  React.useContext(MainPageStoreContext)!;
