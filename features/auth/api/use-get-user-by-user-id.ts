import { DATABASE_ID, USER_COLLECTION_ID } from '@/config';
import { databases } from '@/db/appwrite';
import { getLecturerData, getStudentData } from '@/helper';
import { useAuth } from '@/lib/zustand/useAuth';
import { UserType } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { ID, Query } from 'react-native-appwrite';

export const useGetUserByUserId = () => {
  const userData = useAuth((state) => state.user);
  const studentData = getStudentData(userData!);
  const lecturerData = getLecturerData(userData!);
  const name =
    studentData?.fname + ' ' + studentData?.lname || lecturerData?.fullname;
  return useQuery({
    queryKey: ['get-user', userData?.id],
    queryFn: async () => {
      const response = await databases.listDocuments<UserType>(
        DATABASE_ID,
        USER_COLLECTION_ID,
        [Query.equal('userId', userData?.id!)]
      );

      let user: UserType;

      if (response.documents.length === 0) {
        // Create a new user document
        user = await databases.createDocument<UserType>(
          DATABASE_ID,
          USER_COLLECTION_ID,
          ID.unique(),
          {
            userId: userData?.id,
            email: userData?.email,
            name,
            faculty: studentData?.Faculty,
            matriculation_number: studentData?.matricnumber,
            program_type: studentData?.programtype,
            department: studentData?.Department,
            image_url: studentData?.id
              ? `https://fpn.netpro.software/Uploads/${studentData.id}.jpeg`
              : undefined,
            is_online: true,
          }
        );
      } else {
        // Update existing user document to set is_online: true
        user = await databases.updateDocument<UserType>(
          DATABASE_ID,
          USER_COLLECTION_ID,
          response.documents[0].$id,
          { is_online: true }
        );
      }

      return user;
    },
    enabled: !!userData?.id,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};
