import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView
} from 'react-native';

import * as Location from 'expo-location';

const openWeatherKey = "9d9cc3fbd438b682a04282158fd2dd1f";

const BASE_URL = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${openWeatherKey}`;

interface WeatherDescription {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface MainData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

interface WindData {
  speed: number;
  deg: number;
}

interface CloudsData {
  all: number;
}

interface SysData {
  type: number;
  id: number;
  country: string;
  sunrise: number;
  sunset: number;
}

interface ForecastData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: WeatherDescription[]; 
  base: string;
  main: MainData; 
  visibility: number;
  wind: WindData; 
  clouds: CloudsData;
  dt: number;
  sys: SysData; 
  timezone: number;
  id: number;
  name: string; 
  cod: number;
}

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default function App() {
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [displayLocation, setDisplayLocation] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadForecast = useCallback(async () => {
    setRefreshing(true);
    setErrorMsg(null);
    setForecast(null);

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied. Please enable it in your device settings.');
        return; 
      }

      let location = await Location.getCurrentPositionAsync({});

      const response = await fetch(`${BASE_URL}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`);
      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || 'Failed to fetch weather data.';
        Alert.alert('Error', `Algo ha ocurrido: ${errorMessage}`);
        setErrorMsg(errorMessage);
        setForecast(null);
      } else {
        setForecast(data);
        setDisplayLocation(data.name || `${location.coords.latitude.toFixed(2)}, ${location.coords.longitude.toFixed(2)}`);
      }
    } catch (error: any) {
      console.error("Failed to load forecast:", error);
      Alert.alert('Error', `Could not load weather. Please check your internet connection or try again. (${error.message})`);
      setErrorMsg(`Failed to load weather: ${error.message}`);
      setForecast(null);
    } finally {
      setRefreshing(false); 
    }
  }, []); 

  useEffect(() => {
    loadForecast();
  }, [loadForecast]);

  if (!forecast && !errorMsg) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Cargando el clima...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={loadForecast}
              tintColor="#0000ff"
            />
          }
        >
          <Text style={styles.errorText}>{errorMsg}</Text>
          <Text style={styles.tryAgainText}>Tire hacia abajo para intentarlo nuevamente.</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const mainWeather = forecast!.main;
  const currentDescription = forecast!.weather[0];
  const windData = forecast!.wind;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent} 
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadForecast}
            tintColor="#0000ff"
          />
        }
      >
        <Text style={styles.locationText}>
          {displayLocation || 'Obteniendo ubicación...'}
        </Text>

        <View style={styles.currentWeatherContainer}>
          <Text style={styles.temperatureText}>
            {Math.round(mainWeather.temp)}°C
          </Text>
          <Text style={styles.descriptionText}>
            {capitalizeFirstLetter(currentDescription.description)}
          </Text>
          <Text style={styles.feelsLikeText}>
            Se siente como: {Math.round(mainWeather.feels_like)}°C
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Humedad:</Text>
          <Text style={styles.detailValue}>{mainWeather.humidity}%</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Velocidad del viento:</Text>
          <Text style={styles.detailValue}>{windData.speed.toFixed(1)} m/s</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Presión:</Text>
          <Text style={styles.detailValue}>{mainWeather.pressure} hPa</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8', 
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'red',
    marginBottom: 10,
  },
  tryAgainText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
  },
  locationText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  currentWeatherContainer: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  temperatureText: {
    fontSize: 60,
    fontWeight: '300',
    color: '#333',
  },
  descriptionText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#555',
    marginBottom: 10,
  },
  feelsLikeText: {
    fontSize: 18,
    color: '#777',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
});