import { Stack } from '@/components/ui/stack';

import { useAuth } from '@/lib/zustand/useAuth';

import { Href } from 'expo-router';

import { ArticleSkeleton } from '@/components/skeletons/article-skeleton';
import { ErrorComponent } from '@/components/ui/error-component';
import { useGetLectures } from '../api/use-get-lectures';
import { useGetNews } from '../api/use-get-news';
import { LectureNoScroll } from './lecture-no-scroll';
import { NewsFlatList } from './news-flatlist';

export const Data = () => {
  const id = useAuth((state) => state?.user?.id!);

  const {
    data: lectures,
    isPending: isPendingLectures,
    isError: isErrorLectures,
    refetch: refetchLectures,
    isRefetching: isRefetchingLectures,
  } = useGetLectures(id);
  const {
    data: news,
    isPending: isPendingNews,
    isError: isErrorNews,
    refetch: newsRefetch,
    isRefetching: isRefetchNews,
  } = useGetNews();
  const onRefresh = async () => {
    await refetchLectures();
    await newsRefetch();
  };
  if (isErrorNews || isErrorLectures) {
    return (
      <ErrorComponent
        onPress={onRefresh}
        title={'Failed to load lectures'}
        height={300}
      />
    );
  }
  if (
    isPendingLectures ||
    isPendingNews ||
    isRefetchingLectures ||
    isRefetchNews
  ) {
    return <ArticleSkeleton showHeader />;
  }
  const link = lectures.length > 5 ? '/lectures' : '';
  const link2 = news.length > 5 ? '/notice' : '';

  return (
    <Stack style={{ gap: 30 }}>
      <LectureNoScroll
        index={0}
        data={lectures}
        title="Upcoming Lectures"
        link={link as Href}
      />
      <NewsFlatList
        index={1}
        data={news}
        title="Notice board"
        link={link2 as Href}
      />
    </Stack>
  );
};
