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
      if (!userData?.id) return;
      let user: UserType;
      const users = await databases.listDocuments<UserType>(
        DATABASE_ID,
        USER_COLLECTION_ID,
        [Query.equal('userId', userData?.id)]
      );
      if (users.documents.length === 0) {
        user = await databases.createDocument<UserType>(
          DATABASE_ID,
          USER_COLLECTION_ID,
          ID.unique(),
          {
            email: userData?.email,
            userId: userData?.id,
            name,
            faculty: studentData?.Faculty,
            matriculation_number: studentData?.matricnumber,
            program_type: studentData?.programtype,
            department: studentData?.Department,
            image_url: `https://fpn.netpro.software/Uploads/${studentData?.id}.jpeg`,
            is_online: true,
          }
        );
      } else {
        user = await databases.updateDocument<UserType>(
          DATABASE_ID,
          USER_COLLECTION_ID,
          users.documents[0].$id,
          {
            is_online: true,
          }
        );
      }

      user = users.documents[0];
      return user;
    },
  });
};
