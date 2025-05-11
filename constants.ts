import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const colors = {
  white: '#fff',
  black: '#000',
  lightblue: '#007CB6',
  gray: 'gray',
  border: '#D4D4D4',
  textGray: '#565656',
  red: 'red',
  green: '#009b50',
  lightGray: '#f8f8f8',
};

export const borderRadius = 8;

export const avatarSize = 50;

export const mail = 'mailto:student.ictsupport@fpno.edu.ng';
export const OFFSET = 20;
export const TIME = 80;
export const dialPads = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'];
export const pinLength = 5;
export const pinContainerSize = width / 2;
export const pinMaxSize = pinContainerSize / pinLength;
export const spacing = 20;
export const pinSpacing = 10;
export const pinSize = pinMaxSize - pinSpacing * 2;
export const dialPadSize = width * 0.18;
export const dialPadItemSize = dialPadSize * 0.3;

export const itemSize = avatarSize + spacing * 3;
