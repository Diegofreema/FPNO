import { DATABASE_ID, USER_COLLECTION_ID } from '@/config';
import { databases } from '@/db/appwrite';
import { UserType } from '@/types';
import { Query } from 'react-native-appwrite';

export const fetchOtherUsers = async ({
  userId,
  query,
}: {
  userId: string;
  query?: string;
}) => {
  const fetchQuery = [Query.notEqual('userId', userId)];

  if (query) {
    fetchQuery.push(Query.search('name', query));
  }

  const users = await databases.listDocuments<UserType>(
    DATABASE_ID,
    USER_COLLECTION_ID,
    fetchQuery
  );

  return users;
};
