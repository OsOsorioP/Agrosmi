import { Pressable,GestureResponderEvent, StyleSheet  } from "react-native"
import icon from "@/constants/icon"
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { useEffect } from "react";

interface TabBarButtonProps {
    onPress: (event: GestureResponderEvent) => void;
    onLongPress: (event: GestureResponderEvent) => void;
    isFocused: boolean;
    routeName: string;
    color: string;
    label: string;
}

const TabBarButton = ({ onPress, onLongPress, isFocused, routeName, color, label }: TabBarButtonProps) => {

    const scale = useSharedValue(0);

    useEffect(() => {
        scale.value = withSpring(typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused, { duration: 350 });
    }, [scale, isFocused])

    const AnimatedIconStyle = useAnimatedStyle(()=>{
        const scaleValue = interpolate(scale.value, [0,1],[1,1.2])
        
        const top = interpolate(scale.value, [0,1],[0,9]);
        
        return {
            transform: [
                {scale:scaleValue}
            ],
            top
        }
    })

    const animatedTextStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scale.value, [0, 1], [1, 0]);
        return {
            opacity,
        }
    })

    return (
        <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarItem}
        >
            <Animated.View style={AnimatedIconStyle}>
                {icon[routeName]({
                color: isFocused ? "white" : "#222"
            })}
            </Animated.View>
            <Animated.Text
                style={[{ color: isFocused ? "#673ab7" : "#222" }, animatedTextStyle]}
            >
                {label}
            </Animated.Text>
        </Pressable>
    )
};

const styles = StyleSheet.create({
    tabBar: {
        height: 56,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        margin: 10,
        paddingVertical: 5,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 5,
        shadowOpacity: 0.1
    },
    tabBarItem: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
})

export default TabBarButton;