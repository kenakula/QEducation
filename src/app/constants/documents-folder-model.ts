import { StorageReference } from 'firebase/storage';

export interface FolderItem {
  name: string;
  fullPath: string;
}

export interface DocumentsFolderModel {
  name: string;
  ref: StorageReference;
  items: FolderItem[];
}
