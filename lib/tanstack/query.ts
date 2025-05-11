import { DashBoardType, LecturesType, NewsTypes } from '@/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useGetDashboard = (id: string) => {
  const getDashboard = async () => {
    const { data } = await axios.get(
      `https://estate.netpro.software/api.aspx?api=dashboard&studentid=${id}`
    );
    return data;
  };

  return useQuery<DashBoardType>({
    queryKey: ['dashboard'],
    queryFn: getDashboard,
  });
};

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

export const useGetNews = () => {
  const getNews = async () => {
    const response = await axios.get(
      `https://estate.netpro.software/api.aspx?api=news`
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

  return useQuery<NewsTypes[]>({
    queryKey: ['news'],
    queryFn: getNews,
  });
};
