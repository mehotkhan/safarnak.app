import MapView from '@components/MapView';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Permission to access location was denied'
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <MapView location={location} />
    </View>
  );
}
