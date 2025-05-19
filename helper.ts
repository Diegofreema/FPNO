import axios from 'axios';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { ID } from 'react-native-appwrite';
import { BUCKET_ID, PROJECT_ID } from './config';
import { storage } from './db/appwrite';
import { MemberType, userData } from './types';

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
  console.log({ storageId });
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

export const downloadAndSaveImage = async (imageUrl: string) => {
  const fileUri = FileSystem.documentDirectory + `${new Date().getTime()}.jpg`;

  try {
    const res = await FileSystem.downloadAsync(imageUrl, fileUri);
    return saveFile(res.uri);
  } catch (err) {
    console.log('FS Err: ', err);
  }
};

const saveFile = async (fileUri: string) => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status === 'granted') {
    try {
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      const album = await MediaLibrary.getAlbumAsync('Download');
      if (album == null) {
        const result = await MediaLibrary.createAlbumAsync(
          'Download',
          asset,
          false
        );
        if (result) {
          return 'saved';
        }
      } else {
        const result = await MediaLibrary.addAssetsToAlbumAsync(
          [asset],
          album,
          false
        );
        if (result) {
          return 'saved';
        }
      }
    } catch (err) {
      console.log('Save err: ', err);
      throw new Error('Failed to save image');
    }
  } else if (status === 'denied') {
    throw new Error('please allow permissions to download');
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
