export const useIsMember = ({
  members,
  userId,
}: {
  members: string[];
  userId: string;
}) => {
  const isMember = members.some((member) => member === userId);
  return { isMember };
};
