import { DashBoardType } from '@/types';
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
