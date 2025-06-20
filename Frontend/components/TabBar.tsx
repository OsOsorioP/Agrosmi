import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import TabBarButton from './TabBarButton';
import { useState } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const [dimensions, setDimensions] = useState({heigth:20,width:100})

  const buttonWidth = dimensions.width / state.routes.length;

  const onTabbarLayout = (e:LayoutChangeEvent)=>{
    setDimensions({
      heigth:e.nativeEvent.layout.height,
      width:e.nativeEvent.layout.width,
    })
  }

  const tabPositionX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(()=>{
    return{
      transform:[{translateX:tabPositionX.value}]
    }
  })

  return (
    <View onLayout={onTabbarLayout} style={styles.tabBar}>
      <Animated.View style={[{position:"absolute", backgroundColor:"green",borderRadius:10, marginHorizontal:10,height:dimensions.heigth-15,width:buttonWidth-20},animatedStyle]}/>      
        {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          tabPositionX.value = withSpring(buttonWidth * index, {duration:1500});
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName = {route.name}
            color={isFocused ? "#67ab7" : "#222"}
            label={String(label)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
    tabBar:{
        height:56,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        backgroundColor:"#fff",
        margin:10,
        paddingVertical:5,
        borderRadius:10,
        shadowColor:"#000",
        shadowOffset:{width:0,height:10},
        shadowRadius:5,
        shadowOpacity:0.1
    },
})