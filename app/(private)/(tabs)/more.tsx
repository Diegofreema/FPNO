import * as LocalAuthentication from 'expo-local-authentication';

import {LogoutModal} from '@/components/logout-modal';
import {Title} from '@/components/typography/title';
import {Stack} from '@/components/ui/stack';
import {Wrapper} from '@/components/ui/wrapper';
import {colors} from '@/constants';
import {useFingerPrint} from '@/lib/zustand/useFingerPrint';
import {usePassCode} from '@/lib/zustand/usePasscode';

import {AntDesign, Entypo, EvilIcons} from '@expo/vector-icons';
import {openURL} from 'expo-linking';
import {router} from 'expo-router';
import {useState} from 'react';
import {Platform, StyleSheet, Switch, Text, TouchableOpacity} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {toast} from 'sonner-native';
import {Flex} from "@/components/ui/flex";

export const mail = 'mailto:student.ictsupport@fpno.edu.ng';
const More = () => {
  const toggleLock = useFingerPrint((state) => state.toggleLock);
  const [visible, setVisible] = useState(false);
  const passCode = usePassCode((state) => state.passCode);

  const lock = useFingerPrint((state) => state.lock);
  const onLock = async () => {
    const isAvailable = await LocalAuthentication.hasHardwareAsync();
    if (!isAvailable)
      return toast.error('Error', {
        description: 'Finger print not available on this device',
      });
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      toast.error('Error', {
        description: 'Finger print not enrolled on this device',
      });
      return;
    }

    if (lock) {
      router.push('/lock?off=true');
    } else {
      toggleLock();
      toast.success('Success', {
        description: 'Login with finger print enabled',
      });
    }
  };
  const onLogout = () => {
    setVisible(true);
  };

  const onEdit = () => {
    router.push('/check-passcode?action=change');
  };

  // const onTerms = () => {};
  const onSupport = async () => {
    await openURL(mail);
  };
  // const onPrivacy = () => {};
  return (
    <Wrapper styles={{backgroundColor: 'white'}}>
      <LogoutModal visible={visible} onClose={() => setVisible(false)} />
      {Platform.OS === 'android' && <Text style={styles.header}>More</Text>}
      <Stack style={{ marginTop: 30 }}>
        <Flex
            leftContent={
                <Title text={'Finger Print'} textStyle={styles.title} />
            }
            rightContent={
                  <Switch
                      trackColor={{ false: '#767577', true: '#81b0ff' }}
                      thumbColor={lock ? colors.lightblue : '#f4f3f4'}
                      ios_backgroundColor="#3e3e3e"
            // @ts-ignore
                      onChange={onLock}
                      value={lock}
                  />
        }
            styles={styles.container} />




        {passCode && (
          <TouchableOpacity
            onPress={onEdit}
            activeOpacity={0.5}
            style={styles.container}
          >
            <Title text={'Change Pin'} textStyle={styles.title} />
            <EvilIcons
              name="pencil"
              size={RFPercentage(2.5)}
              color={colors.black}
            />
          </TouchableOpacity>
        )}

        {/* <TouchableOpacity
          onPress={onPrivacy}
          activeOpacity={0.5}
          style={styles.container}
        >
          <Title text={'Privacy & Policy'} textStyle={styles.title} />

          <IconLockSquare color={colors.black} size={28} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onTerms}
          activeOpacity={0.5}
          style={styles.container}
        >
          <Title text={'Terms & Conditions'} textStyle={styles.title} />

          <IconNotes color={colors.black} size={28} />
        </TouchableOpacity>
       */}
        <TouchableOpacity
          onPress={onSupport}
          activeOpacity={0.5}
          style={styles.container}
        >
          <Title text={'Support'} textStyle={styles.title} />

          <Entypo
            name="help-with-circle"
            color={colors.black}
            size={RFPercentage(2.5)}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onLogout}
          activeOpacity={0.5}
          style={[styles.container]}
        >
          <Title text={'Logout'} textStyle={styles.title} />

          <AntDesign
            name="logout"
            color={colors.red}
            size={RFPercentage(2.5)}
          />
        </TouchableOpacity>
      </Stack>
    </Wrapper>
  );
};
export default More;

const styles = StyleSheet.create({
  title: { color: colors.black, fontSize: RFPercentage(2.5) },
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 5,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  header: {marginBottom: 20, fontSize: RFPercentage(3), fontFamily: 'NunitoBold', color: colors.black}
});
