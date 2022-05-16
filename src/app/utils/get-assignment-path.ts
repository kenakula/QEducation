import { FirestoreCollection } from 'app/constants/firestore-collections';
import { EntityModel } from 'app/constants/notification-model';
import { UserAssignment } from 'app/constants/user-model';

export const getAssignmentPath = (
  item: UserAssignment,
): FirestoreCollection => {
  switch (item.entity) {
    case EntityModel.Article:
      return FirestoreCollection.UserArticles;
    case EntityModel.Script:
      return FirestoreCollection.Scripts;
    case EntityModel.Test:
      return FirestoreCollection.Tests;
    default:
      return FirestoreCollection.UserChecklists;
  }
};
