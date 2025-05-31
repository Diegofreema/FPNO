import axios from 'axios';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { ID, Query } from 'react-native-appwrite';
import {
  BUCKET_ID,
  CHAT_MESSAGES_COLLECTION_ID,
  DATABASE_ID,
  PROJECT_ID,
} from './config';
import { databases, storage } from './db/appwrite';
import { ChatMessageType, MemberType, userData } from './types';
import {Platform} from "react-native";
export const sendEmail = async (email: string, otp: string) => {
  const { data } = await axios.get(
    `https://estate.netpro.software/sendsms.aspx?email=${email}&otp=${otp}`
  );
  return data.result;
};

export const generateFromRandomNumbersOtp = () => {
  const tokenLength = 5;
  let otp = '';
  for (let i = 0; i < tokenLength; i++) {
    const randomNum = Math.floor(Math.random() * 9) + 1;
    otp += randomNum.toString();
  }
  return otp;
};

export const textToRender = (text: string) => {
  let finalText = '';
  if (text === 'totallectures') {
    finalText = 'Total lectures';
  }
  if (text === 'registeredcourse') {
    finalText = 'Registered course';
  }
  if (text === 'upcominglectures') {
    finalText = 'Upcoming lectures';
  }

  if (text === 'outstandingassignment') {
    finalText = 'Outstanding assignment';
  }
  return finalText;
};

export const breakSentenceToAnewLineIfAfterAPoint = (sentence: string) => {
  const words = sentence.match(/\S+/g) || [];

  return words.reduce((result, word, index) => {
    // Check if previous word ends with a period and is followed by multiple spaces
    const lineBreak =
      index > 0 &&
      words[index - 1].endsWith('.') &&
      sentence
        .slice(
          sentence.indexOf(words[index - 1]) + words[index - 1].length,
          sentence.indexOf(word)
        )
        .trim().length > 1
        ? '\n'
        : ' ';

    return result + (index > 0 ? lineBreak : '') + word;
  }, '');
};

export const trimText = (text: string, length: number = 100) => {
  if (text.length > length) {
    return text.slice(0, length) + '...';
  }

  return text;
};

export const uploadDoc = async (
  url: string,
  generateUploadUrl: any
): Promise<{ storageId: string; uploadUrl: string }> => {
  const uploadUrl = await generateUploadUrl();

  const response = await fetch(url);
  const blob = await response.blob();
  const result = await fetch(uploadUrl, {
    method: 'POST',
    body: blob,
    headers: { 'Content-Type': 'pdf' },
  });
  const { storageId } = await result.json();

  return { storageId, uploadUrl };
};
export const uploadProfilePicture = async (
  selectedImage: string,
  generateUploadUrl: any
): Promise<{ storageId: string; uploadUrl: string }> => {
  const uploadUrl = await generateUploadUrl();

  const response = await fetch(selectedImage);
  const blob = await response.blob();

  const result = await fetch(uploadUrl, {
    method: 'POST',
    body: blob,
    headers: { 'Content-Type': 'image/jpeg' },
  });
  const { storageId } = await result.json();

  return { storageId, uploadUrl };
};

export const downloadPdf = async (fileUrl: string) => {
  const filename = `${new Date().getTime()}.pdf`;
  const fileType = 'pdf';
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      throw new Error(
        status === 'denied'
          ? 'Please allow permissions to save files'
          : 'Permission request failed'
      );
    }
    const result = await FileSystem.downloadAsync(
      fileUrl,
      FileSystem.documentDirectory + filename
    );
    if (result.status !== 200) {
      throw new Error(
        `Download failed with status ${result.status}: ${
          result.headers['Status-Message'] || 'Unknown error'
        }`
      );
    }
    await save(result.uri, filename, 'application/pdf')
    return 'saved' ;
  } catch (error) {
    console.error(`Download Error (${fileType}):`, error);
    throw new Error(
      `Failed to download ${fileType}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
};

const save = async (uri: string, filename: string, mimeType: string) => {
  if (Platform.OS === 'android') {
    try {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64
        });

        const newFileUri = await FileSystem.StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            filename,
            mimeType
        );

        // Write the base64 content to the NEW file URI, not the original URI
        await FileSystem.writeAsStringAsync(
            newFileUri,
            base64,
            { encoding: FileSystem.EncodingType.Base64 }
        );
      }
    } catch (error) {
      console.error('Error saving file:', error);
    }
  } else {
    await Sharing.shareAsync(uri);
  }
};

export const downloadAndSaveFile = async (
  fileUrl: string,
  fileType: 'image' | 'pdf'
): Promise<string> => {
  const extension = fileType === 'image' ? 'jpg' : 'pdf';
  const mimeType = fileType === 'image' ? 'image/jpeg' : 'application/pdf';
  const fileName = `${new Date().getTime()}.${extension}`;
  const fileUri = `${FileSystem.cacheDirectory}${fileName}`; // Use cache for temporary storage

  // Remove mode=admin from URL
  const cleanUrl = fileUrl.replace(/&mode=admin/, '');

  try {
    // Request permissions for both image and PDF
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      throw new Error(
        status === 'denied'
          ? 'Please allow permissions to save files'
          : 'Permission request failed'
      );
    }

    // Download the file
    const res = await FileSystem.downloadAsync(cleanUrl, fileUri, {
      headers: {
        // Add headers if needed for Appwrite authentication
        // 'Authorization': 'Bearer YOUR_TOKEN',
      },
    });

    console.log('Download Response:', {
      status: res.status,
      headers: res.headers,
      uri: fileUri,
    });

    if (res.status !== 200) {
      throw new Error(
        `Download failed with status ${res.status}: ${
          res.headers['Status-Message'] || 'Unknown error'
        }`
      );
    }

    // Verify file exists and has content
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    console.log('File Info:', fileInfo);
    if (!fileInfo.exists || fileInfo.size === 0) {
      throw new Error(`Downloaded file is empty or missing: ${fileUri}`);
    }

    // Verify MIME type
    if (
      fileType === 'pdf' &&
      res.headers['Content-Type'] &&
      !res.headers['Content-Type'].includes('application/pdf')
    ) {
      throw new Error(
        `Downloaded file is not a PDF: Content-Type=${res.headers['Content-Type']}`
      );
    } else if (
      fileType === 'image' &&
      res.headers['Content-Type'] &&
      !res.headers['Content-Type'].includes('image/jpeg')
    ) {
      throw new Error(
        `Downloaded file is not an image: Content-Type=${res.headers['Content-Type']}`
      );
    }

    // Save the file to the device
    const result = await saveFile(fileUri, mimeType, fileType, fileName);

    // Optionally open the file
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(fileUri, {
        mimeType,
        dialogTitle: `Open ${fileType}`,
        UTI: fileType === 'pdf' ? 'com.adobe.pdf' : 'public.jpeg', // iOS-specific UTI
      });
    }

    return result;
  } catch (err) {
    console.error(`Download Error (${fileType}):`, err);
    throw new Error(
      `Failed to download ${fileType}: ${
        err instanceof Error ? err.message : 'Unknown error'
      }`
    );
  }
};

const saveFile = async (
  tempUri: string,
  mimeType: string,
  fileType: 'image' | 'pdf',
  fileName: string
): Promise<string> => {
  try {
    if (fileType === 'image') {
      // Save images to MediaLibrary
      const assetUri = tempUri.startsWith('file://')
        ? tempUri
        : `file://${tempUri}`;
      const asset = await MediaLibrary.createAssetAsync(assetUri);
      console.log('Asset Created:', asset);

      const albumName = 'MyAppImages';
      let album = await MediaLibrary.getAlbumAsync(albumName);

      if (album == null) {
        await MediaLibrary.createAlbumAsync(albumName, asset, false);
        console.log('Album Created:', albumName);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        console.log('Asset Added to Album:', albumName);
      }

      console.log(`Image saved to ${albumName}: ${fileName}`);
      return 'saved';
    } else {
      // Save PDFs to documentDirectory (Downloads folder)
      const downloadsDir = `${FileSystem.documentDirectory}Downloads/`;

      // Create Downloads folder if it doesn't exist
      await FileSystem.makeDirectoryAsync(downloadsDir, {
        intermediates: true,
      });

      const targetUri = `${downloadsDir}${fileName}`;
      await FileSystem.moveAsync({
        from: tempUri,
        to: targetUri,
      });

      // Verify the file was moved
      const targetInfo = await FileSystem.getInfoAsync(targetUri);
      console.log('Target File Info:', targetInfo);
      if (!targetInfo.exists || targetInfo.size === 0) {
        throw new Error(`Failed to move PDF to ${targetUri}`);
      }

      console.log(`PDF saved to ${downloadsDir}: ${fileName}`);
      return 'saved';
    }
  } catch (err) {
    console.error(`Save Error (${fileType}):`, err);
    throw new Error(
      `Failed to save ${fileType}: ${
        err instanceof Error ? err.message : 'Unknown error'
      }`
    );
  }
};
export function getName(user: userData): string {
  if (user.variant === 'STUDENT') {
    return `${user.fname} ${user.lname}`; // TypeScript knows user is StudentData here
  }

  return user.fullname;
}

export const getStudentData = (user: userData) => {
  if (user.variant === 'STUDENT') {
    return user;
  }
  return null;
};

export const getLecturerData = (user: userData) => {
  if (user.variant === 'LECTURER') {
    return user;
  }
  return null;
};

export const formatNumber = (num: number): string => {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(0)}M`;
  } else if (num >= 1_000) {
    return `${(num / 1_000).toFixed(0)}K`;
  }
  return num.toString();
};

export function trimTextByWidth(
  text: string,
  availableWidth: number,
  fontSize: number
): string {
  // Average character width is approximately 0.5 * fontSize in pixels (heuristic)
  const avgCharWidth = fontSize * 0.5;
  // Calculate max characters that fit in availableWidth, reserving space for '...'
  const ellipsisWidth = avgCharWidth * 3; // Approximate width of '...'
  const maxWidth = availableWidth - ellipsisWidth;
  const maxChars = Math.floor(maxWidth / avgCharWidth);

  if (text.length <= maxChars || maxWidth <= 0) {
    return text;
  }

  // Trim text to fit within maxChars and append '...'
  return `${text.substring(0, maxChars)}...`;
}

export const generateErrorMessage = (
  error: unknown,
  message: string
): string => {
  const errorMessage = error instanceof Error ? error.message : message;

  return errorMessage;
};

export const checkIfIsMember = (members: string[], userId: string) => {
  return members.includes(userId);
};

export const checkIfIsInPending = (
  pendingMembers: MemberType[] = [],
  userId: string
) => {
  if (!pendingMembers?.length) return false;
  return pendingMembers?.some((item) => item.member_id === userId);
};

export const formatMessageTime = (timestamp: string | Date): string => {
  try {
    // Parse timestamp if it's a string
    const date =
      typeof timestamp === 'string' ? parseISO(timestamp) : timestamp;

    if (isToday(date)) {
      // Today: Show time like "12:34 PM"
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      // Yesterday: Show "Yesterday"
      return 'Yesterday';
    } else {
      // Older: Show date like "MM/DD/YY"
      return format(date, 'MM/dd/yy');
    }
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return 'Invalid date';
  }
};

export const generateImageUrl = async (image: {
  name: string;
  type: string;
  size: number;
  uri: string;
}) => {
  const file = await storage.createFile(BUCKET_ID, ID.unique(), image);
  const id = file.$id;
  const link = `https://fra.cloud.appwrite.io/v1/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}&mode=admin`;

  return { link, id };
};

export const findAndDeleteReplies = async (messageId: string) => {
  const isReplyTo = await databases.listDocuments<ChatMessageType>(
    DATABASE_ID,
    CHAT_MESSAGES_COLLECTION_ID,
    [Query.equal('replyTo', messageId)]
  );
  if (isReplyTo.total > 0) {
    isReplyTo.documents.forEach(
      async (r) =>
        await databases.updateDocument(
          DATABASE_ID,
          CHAT_MESSAGES_COLLECTION_ID,
          r.$id,
          { replyTo: null }
        )
    );
  }
};

export const deleteMessageHelpFn = async (
  messageId: string,
  loggedInUser: string
) => {
  const messageToDelete = await databases.getDocument<ChatMessageType>(
    DATABASE_ID,
    CHAT_MESSAGES_COLLECTION_ID,
    messageId
  );

  if (!messageToDelete) {
    throw new Error('Message not found');
  }

  if (messageToDelete.sender_id !== loggedInUser) {
    throw new Error('You are not authorized to delete this message');
  }
  if (messageToDelete.fileId) {
    await storage.deleteFile(BUCKET_ID, messageToDelete.fileId);
  }
  await findAndDeleteReplies(messageToDelete.$id);

  await databases.deleteDocument(
    DATABASE_ID,
    CHAT_MESSAGES_COLLECTION_ID,
    messageToDelete.$id
  );
};
