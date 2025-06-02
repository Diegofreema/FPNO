import {useState} from "react";
import {dialPads, pinLength} from "@/constants";
import {useAnimatedStyle, useSharedValue} from "react-native-reanimated";


export const useOtpCodes = () => {
    const [code, setCode] = useState<number[]>([]);
    const offset = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        return { transform: [{ translateX: offset.value }] };
    });
    const onPress = (item: (typeof dialPads)[number]) => {
        if (item === 'del' && code.length > 0) {
            setCode((prev) => prev?.slice(0, prev?.length - 1));
        } else if (typeof item === 'number') {
            if (code.length === pinLength) return;
            setCode((prev) => [...prev, item]);
        }
    };


    return {code, setCode, onPress, animatedStyle, offset}
};