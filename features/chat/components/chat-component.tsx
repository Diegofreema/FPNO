import {colors} from '@/constants';
import {useAuth} from '@/lib/zustand/useAuth';
import {EditType, EditType2, IMessage} from '@/types';
import {ActionSheetOptions} from '@expo/react-native-action-sheet';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {KeyboardAvoidingView, Platform, StyleSheet, Text, View,} from 'react-native';
import {GiftedChat, SystemMessage, Time} from 'react-native-gifted-chat';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {SwipeableMethods} from 'react-native-gesture-handler/lib/typescript/components/ReanimatedSwipeable';
import {RenderComposer} from './message-input';
import {RenderActions} from './render-action';
import {RenderBubble} from './render-bubble';
import {RenderImage} from './render-image';
import ReplyMessageBar from './render-message';
import {RenderSend} from './render-send';

type Props = {
  messages: IMessage[];
  loadEarlier: boolean;
  onLoadMore: () => void;
  editText: EditType | null;
  setEditText: (value: EditType | null) => void;
  onSend: (messages: IMessage[]) => void;
  setText: (text: string) => void;
  text: string;

  sending: boolean;
  setSending: (sending: boolean) => void;
  isAttachImage: boolean;
  setIsAttachImage: (isAttachImage: boolean) => void;
  replyMessage: IMessage | null;
  setReplyMessage: (message: IMessage | null) => void;
  onOpenCamera: () => void;
  onPickImage: () => void;
  showActionSheetWithOptions: (
    options: ActionSheetOptions,
    callback: (i?: number) => void | Promise<void>
  ) => void;
  onEdit: (value: EditType2) => Promise<void>;
  onDelete: (messageId: string) => Promise<void>;
  onCopy: (textToCopy: string) => Promise<void>;
  handlePhotTaken: (message: IMessage) => void;
  onPickDocument: () => void;
};

const ChatComponent = ({
  messages,
  loadEarlier,
  onLoadMore,
  onSend,
  setText,
  sending,
  text,
  isAttachImage,
  onOpenCamera,
  onPickImage,
  onDelete,
  onEdit,
  showActionSheetWithOptions,
  onCopy,
  handlePhotTaken,
  replyMessage,
  setReplyMessage,
  onPickDocument,
  editText,
  setEditText,
}: Props) => {
  const loggedInUserId = useAuth((state) => state.user?.id!);
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const disabled = sending || text.length === 0;

  const swipeableRowRef = useRef<SwipeableMethods | null>(null);
  const updateRowRef = useCallback(
    (ref: any) => {
      if (
        ref &&
        replyMessage &&
        ref.props.children.props.currentMessage?._id === replyMessage?._id
      ) {
        swipeableRowRef.current = ref;
        if (editText) {
          setEditText(null);
        }
      }
    },
    [replyMessage, editText, setEditText]
  );
  useEffect(() => {
    if (replyMessage && swipeableRowRef.current) {
      swipeableRowRef.current.close();
      swipeableRowRef.current = null;
    }
  }, [replyMessage]);

  return (
    <>
      <View style={{ flex: 1 }}>
        <GiftedChat
          text={text}
          messages={messages}
          loadEarlier={loadEarlier}
          onLoadEarlier={onLoadMore}
          keyboardShouldPersistTaps={'always'}
          onSend={(messages: any) => onSend(messages)}
          onInputTextChanged={setText}
          user={{
            _id: loggedInUserId,
          }}
          renderSystemMessage={(props) => (
            <SystemMessage {...props} textStyle={{ color: colors.gray }} />
          )}
          bottomOffset={insets.bottom}
          renderAvatar={null}
          maxComposerHeight={100}
          textInputProps={styles.composer}
          renderUsernameOnMessage={true}
          isScrollToBottomEnabled
          renderMessageImage={(props) => (
            <RenderImage
              {...props}
              showActionSheetWithOptions={showActionSheetWithOptions}
              onDelete={onDelete}
            />
          )}
          renderUsername={(user) => (
            <Text style={{ fontSize: 10, color: 'white', paddingLeft: 7 }}>
              {user.name}
            </Text>
          )}
          renderBubble={(props) => (
            <RenderBubble
              {...props}
              onCopy={onCopy}
              showActionSheetWithOptions={showActionSheetWithOptions}
              onEdit={onEdit}
              onDelete={onDelete}
              loggedInUserId={loggedInUserId}
              updateRowRef={updateRowRef}
              setReplyOnSwipeOpen={setReplyMessage}
            />
          )}
          renderActions={(props) => (
            <RenderActions
              disable={sending}
              {...props}
              onPickDocument={() => setVisible(true)}
            />
          )}
          renderTime={(props) => (
            <Time
              {...props}
              timeTextStyle={{
                right: {
                  color: colors.lightblue,
                },
                left: {
                  color: colors.white,
                },
              }}
            />
          )}
          renderComposer={(props) => (
            <RenderComposer
              {...props}
              onPickImage={onPickImage}
              onOpenCamera={onOpenCamera}
              onClose={() => setVisible(false)}
              onPickDocument={onPickDocument}
              showFilePicker={visible}
            />
          )}
          renderChatFooter={() => (
            <ReplyMessageBar
              clearReply={() => setReplyMessage(null)}
              message={replyMessage}
              editText={editText}
              clearEdit={() => setEditText(null)}
            />
          )}
          renderSend={(props) => (
            <RenderSend
              disabled={disabled || sending}
              image={isAttachImage}
              {...props}
              sending={sending}
            />
          )}
          alwaysShowSend
        />
        {Platform.OS === 'android' && (
          <KeyboardAvoidingView behavior="height" />
        )}
      </View>
    </>
  );
};

export default ChatComponent;

const styles = StyleSheet.create({
  composer: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    height: 44,
    marginVertical: 10,
  },
  paperClip: {
    marginTop: 8,
    marginHorizontal: 5,
    transform: [{ rotateY: '180deg' }],
  },
  sendButton: { marginBottom: 10, marginRight: 10 },
  sendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  fileContainer: {
    flex: 1,
    maxWidth: 300,
    marginVertical: 2,
    borderRadius: 15,
  },
  fileText: {
    marginVertical: 5,
    fontSize: 16,
    lineHeight: 20,
    marginLeft: 10,
    marginRight: 5,
  },
  textTime: {
    fontSize: 10,
    color: 'gray',
    marginLeft: 2,
  },
  buttonFooterChat: {
    width: 20,
    height: 20,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderColor: 'black',
    right: 3,
    top: -2,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 2,
  },
  buttonFooterChatImg: {
    width: 25,
    height: 25,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderColor: 'black',
    left: 55,
    top: -4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 5,
  },
  textFooterChat: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'gray',
  },
  chatFooter: {
    shadowColor: '#1F2687',
    flexGrow: 1,
    shadowOpacity: 0.37,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    flexDirection: 'row',
    padding: 5,
    backgroundColor: colors.lightblue,
    gap: 10,
  },
});
