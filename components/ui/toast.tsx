// import { colors } from '@/constants';
// //
// import { AntDesign, FontAwesome } from '@expo/vector-icons';
// import { AnimatePresence, Text, View } from 'moti';
// import { StyleSheet } from 'react-native';
// import { RFPercentage } from 'react-native-responsive-fontsize';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// export const Toast = () => {
//   const { top } = useSafeAreaInsets();
//   const { isOpen, message, description, type } = useShowToast();
//   const color = type === 'success' ? 'green' : 'red';
//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <View
//           from={{
//             transform: [{ translateY: -30 }],
//             opacity: 0,
//           }}
//           animate={{
//             transform: [{ translateY: 0 }],
//             opacity: 1,
//           }}
//           transition={{
//             damping: 80,
//             stiffness: 200,
//           }}
//           exit={{
//             transform: [{ translateY: -30 }],
//             opacity: 0,
//           }}
//           exitTransition={{
//             type: 'timing',
//             duration: 250,
//           }}
//           style={[styles.container, { marginTop: top }]}
//         >
//           <View style={[styles.icon, { backgroundColor: color }]}>
//             {type === 'success' ? (
//               <AntDesign
//                 name="checkcircle"
//                 size={20}
//                 strokeWidth={2}
//                 color={colors.white}
//               />
//             ) : (
//               <FontAwesome
//                 name="times-circle"
//                 size={20}
//                 strokeWidth={2}
//                 color={colors.white}
//               />
//             )}
//           </View>
//           <View style={{ paddingRight: 5 }}>
//             <Text style={[styles.text1, { color: color }]}>{message}</Text>
//             {description?.length > 0 && (
//               <Text style={[styles.text2, { color: color }]}>
//                 {description}
//               </Text>
//             )}
//           </View>
//         </View>
//       )}
//     </AnimatePresence>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     left: 0,
//     zIndex: 666,
//     marginHorizontal: 20,
//     borderRadius: 10,
//     backgroundColor: 'white',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     flexDirection: 'row',
//     gap: 5,
//     alignItems: 'flex-start',
//     borderWidth: 1,
//     borderColor: colors.border,
//   },
//   text1: {
//     fontFamily: 'NunitoRegular',
//     fontSize: RFPercentage(1.6),
//   },
//   text2: {
//     fontFamily: 'NunitoBold',
//     fontSize: RFPercentage(1.8),
//     flex: 1,
//   },
//   icon: {
//     borderRadius: 100,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });
