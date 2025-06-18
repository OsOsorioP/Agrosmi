import ParcelMap from '@/components/ParcelMap';
import { StyleSheet } from 'react-native';

export default function Tab() {
  return (
    <ParcelMap />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
