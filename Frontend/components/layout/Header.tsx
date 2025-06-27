import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, Image } from 'react-native';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  headerStyle?: ViewStyle;
  titleStyle?: TextStyle; 
}

const Header = ({ title, headerStyle, titleStyle }: HeaderProps) => {
  return (
    <View style={[styles.header, headerStyle]}>
      <Image style={styles.logo} source={require('../../assets/images/logo.png')}/>
      <Text style={[styles.title, titleStyle]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#333',
    paddingHorizontal: 15,
    paddingVertical:10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:"flex-start",
    height:"auto",
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 8,
    resizeMode: 'contain', 
  }
});

export default Header;