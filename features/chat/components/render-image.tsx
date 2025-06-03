import {Image} from 'expo-image';
import {useCallback, useState} from 'react';
import {StyleSheet} from 'react-native';
import {IMessage, MessageImageProps} from 'react-native-gifted-chat';

import {CustomPressable} from '@/components/ui/custom-pressable';
import {ActionSheetOptions} from '@expo/react-native-action-sheet';
import {PreviewModal} from './preview-modal';
import {Id} from "@/convex/_generated/dataModel";

type Props = MessageImageProps<IMessage> & {
  showActionSheetWithOptions(
    options: ActionSheetOptions,
    callback: (i?: number) => void | Promise<void>
  ): void;
  onDelete: (messageId: Id<'messages'>) => void;
};
export const RenderImage = ({
  onDelete,
  showActionSheetWithOptions,
  ...props
}: Props) => {
  const [showPreview, setShowPreview] = useState(false);
  const onClose = useCallback(() => setShowPreview(false), []);
  const onPress = () => {
    const options = ['Delete', 'Cancel'];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (selectedIndex?: number) => {
        console.log(selectedIndex);
        switch (selectedIndex) {
          case destructiveButtonIndex:
            onDelete(props.currentMessage._id as Id<'messages'>);
            break;

          case cancelButtonIndex:
          // Canceled
        }
      }
    );
  };
  return (
    <>
      <PreviewModal
        visible={showPreview}
        hideModal={onClose}
        url={props.currentMessage.image!}
        type="image"
      />
      <CustomPressable
        onPress={() => setShowPreview(true)}
        onLongPress={onPress}
        style={styles.imageContainer}
      >
        <Image
          source={{ uri: props.currentMessage.image }}
          style={styles.image}
          placeholder={require('@/assets/images/place.webp')}
          placeholderContentFit="cover"
          contentFit="cover"
        />
      </CustomPressable>
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    width: 120,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
