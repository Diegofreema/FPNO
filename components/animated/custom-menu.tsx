import React, {useRef, useState} from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    MeasureOnSuccessCallback,
    Platform,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    ViewStyle,
} from 'react-native';

type MenuItem = {
    text: string;
    onSelect: () => void;
};

type PopupMenuProps = {
    items: MenuItem[];
    buttonStyle?: StyleProp<ViewStyle>;
    buttonTextStyle?: StyleProp<TextStyle>;
    menuStyle?: StyleProp<ViewStyle>;
    menuItemStyle?: StyleProp<ViewStyle>;
    menuItemTextStyle?: StyleProp<TextStyle>;
    buttonContent?: React.ReactNode;
};

type MenuPosition = {
    top: number;
    left: number;
};

const PopupMenu: React.FC<PopupMenuProps> = ({
                                                 items,

                                                 buttonStyle,
                                                 buttonTextStyle,
                                                 menuStyle,
                                                 menuItemStyle,
                                                 menuItemTextStyle,
                                                 buttonContent,
                                             }) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [menuPosition, setMenuPosition] = useState<MenuPosition>({ top: 0, left: 0 });
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const buttonRef = useRef<any>(null);

    const toggleMenu = (): void => {
        const measureCallback: MeasureOnSuccessCallback = (x, y, width, height) => {
            const windowWidth = Dimensions.get('window').width;
            const menuWidth = 150; // Approximate menu width
            const left = x + width > windowWidth - menuWidth ? x - menuWidth + width : x;

            setMenuPosition({
                top: y + height + (Platform.OS === 'ios' ? 8 : 4),
                left,
            });
        };

        if (buttonRef.current) {
            buttonRef.current.measureInWindow(measureCallback);
        }

        if (!visible) {
            setVisible(true);
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 150,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 150,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 100,
                    easing: Easing.in(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.8,
                    duration: 100,
                    easing: Easing.in(Easing.quad),
                    useNativeDriver: true,
                }),
            ]).start(() => setVisible(false));
        }
    };

  

    const backdropPress = (): void => {
        if (visible) {
            toggleMenu();
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                ref={buttonRef}
                onPress={toggleMenu}
                style={[styles.button, buttonStyle]}
                activeOpacity={0.7}
            >
                {buttonContent || <Text style={[styles.buttonText, buttonTextStyle]}>⋮</Text>}
            </TouchableOpacity>

            {visible && (
                <TouchableWithoutFeedback onPress={backdropPress}>
                    <View style={StyleSheet.absoluteFill} />
                </TouchableWithoutFeedback>
            )}

            {visible && (
                <Animated.View
                    style={[
                        styles.menu,
                        menuStyle,
                        {
                            top: menuPosition.top,
                            left: menuPosition.left,
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }],
                            ...Platform.select({
                                ios: {
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 4,
                                },
                                android: {
                                    elevation: 4,
                                },
                            }),
                        },
                    ]}
                >
                    {items.map((item, index) => (
                        <TouchableOpacity
                            key={`${item.text}-${index}`}
                            style={[styles.menuItem, menuItemStyle]}
                            onPress={() => {
                                item.onSelect()
                                toggleMenu()
                            }}
                            activeOpacity={0.5}
                        >
                            <Text style={[styles.menuItemText, menuItemTextStyle]}>{item.text}</Text>
                        </TouchableOpacity>
                    ))}
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    button: {
        padding: 8,
    },
    buttonText: {
        fontSize: 24,
        color: '#333',
    },
    menu: {
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: 8,
        minWidth: 150,
        paddingVertical: 4,
        zIndex: 1000,
    },
    menuItem: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    menuItemText: {
        fontSize: 16,
        color: '#333',
    },
});

export default PopupMenu;