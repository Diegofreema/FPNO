import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

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
