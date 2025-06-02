import {StyleProp, View, ViewStyle} from "react-native";
import {ReactNode} from "react";


type Props = {
    leftContent?: ReactNode;
    rightContent?: ReactNode;
    styles?: StyleProp<ViewStyle>;
}
export const Flex = ({leftContent,rightContent,styles}: Props) => {
  return (
    <View style={[{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}, styles]}>
        {leftContent}
        {rightContent}
    </View>
  );
};


