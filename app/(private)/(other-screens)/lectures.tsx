import { ArticleSkeleton } from '@/components/skeletons/article-skeleton';
import { ErrorComponent } from '@/components/ui/error-component';
import { LecturesAnimated } from '@/components/ui/lectures-animated';
import { NavHeader } from '@/components/ui/nav-header';
import { Wrapper } from '@/components/ui/wrapper';
import { useGetLectures } from '@/features/home/api/use-get-lectures';
import { useAuth } from '@/lib/zustand/useAuth';

const Lectures = () => {
  const id = useAuth((state) => state?.user?.id!);
  const {
    data: lectures,
    isPending: isPendingLectures,
    isError: isErrorLectures,
    isRefetching,
    refetch,
  } = useGetLectures(id);

  if (isErrorLectures) {
    return <ErrorComponent onPress={refetch} />;
  }
  if (isPendingLectures) {
    return <ArticleSkeleton arrayLength={10} />;
  }
  const onRefresh = () => {
    refetch();
  };
  return (
    <Wrapper>
      <NavHeader title="Lectures" />
      <LecturesAnimated
        data={lectures}
        onRefresh={onRefresh}
        refreshing={isRefetching}
      />
    </Wrapper>
  );
};
export default Lectures;
