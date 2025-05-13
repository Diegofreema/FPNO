import { NavHeader } from '@/components/ui/nav-header';
import { colors } from '@/constants';
import { IconSearch } from '@tabler/icons-react-native';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';

type Props = {
  title?: string;
  onPress?: () => void;
};

export const SearchHeader = ({ title = 'Select student', onPress }: Props) => {
  return (
    <NavHeader
      title={title}
      onPress={onPress}
      leftContent={() => (
        <LeftContent onPress={() => router.push('/search-conversation')} />
      )}
    />
  );
};

const LeftContent = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <IconSearch color={colors.black} size={25} />
    </TouchableOpacity>
  );
};
