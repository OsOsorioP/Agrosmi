import { View, Text, Image, StyleSheet, SafeAreaView } from 'react-native';
import logo from '../../assets/images/logo.png'; 

const HEADER_HEIGHT = 60;

const Header = () => {
    return (
        <SafeAreaView style={styles.appHeader}>
            <View style={styles.title}>
                <Image source={logo} style={styles.logo} />
                <Text style={styles.titleText}>Agrosmi</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  appHeader: {
    flex: 1,
    height: HEADER_HEIGHT,
    alignItems: 'center',
    backgroundColor: '#242424',
    width: '100%',
  },

  title: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  logo: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },

  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default Header;