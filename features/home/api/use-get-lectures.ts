import { LecturesType } from '@/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useGetLectures = (id: string) => {
  const getLectures = async () => {
    const response = await axios.get(
      `https://estate.netpro.software/api.aspx?api=upcominglectures&studentid=${id}`
    );
    let data = [];
    if (Object.prototype.toString.call(response.data) === '[object Object]') {
      data.push(response?.data);
    } else if (
      Object.prototype.toString.call(response.data) === '[object Array]'
    ) {
      data = [...response?.data];
    }
    return data;
  };
  return useQuery<LecturesType[]>({
    queryKey: ['lectures'],
    queryFn: getLectures,
  });
};
