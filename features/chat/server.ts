import { DATABASE_ID, USER_COLLECTION_ID } from '@/config';
import { databases } from '@/db/appwrite';
import { UserType } from '@/types';
import { Query } from 'react-native-appwrite';

export const fetchOtherUsers = async ({
  userId,
  query,
  offSet,
}: {
  userId: string;
  query?: string;
  offSet: number;
}) => {
  const fetchQuery = [
    Query.notEqual('userId', userId),
    Query.limit(50 + offSet),
  ];

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
