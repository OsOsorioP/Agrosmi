// screens/WeatherScreen.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getWeatherForecast } from '../services/weatherService'; // Importa el servicio del clima
import { WeatherResponse } from '../types/WeatherTypes'; // Importa los tipos del clima
import Feather from 'react-native-vector-icons/Feather'; // Para iconos (opcional)

const WeatherScreen: React.FC = () => {
    const [location, setLocation] = useState<string>('');
    const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGetWeather = async () => {
        if (!location.trim()) {
            setError("Por favor, ingresa una ubicación.");
            setWeatherData(null);
            return;
        }

        setLoading(true);
        setError(null);
        setWeatherData(null); // Limpia datos anteriores

        try {
            // Llama al servicio para obtener el pronóstico
            const data = await getWeatherForecast({ location: location.trim(), days: 5 }); // Solicita 5 días
            setWeatherData(data);
        } catch (err: any) {
            console.error("Error fetching weather:", err);
            setError(`No se pudo obtener el pronóstico para ${location}. ${err.message || ''}`);
        } finally {
            setLoading(false);
        }
    };

    // Función auxiliar para obtener un icono basado en la descripción (ejemplo simple)
    const getWeatherIcon = (description: string) => {
        const lowerDesc = description.toLowerCase();
        if (lowerDesc.includes('soleado')) return 'sun';
        if (lowerDesc.includes('nublado')) return 'cloud';
        if (lowerDesc.includes('lluvioso')) return 'cloud-rain';
        if (lowerDesc.includes('parcialmente')) return 'cloud-sun';
        return 'circle'; // Icono por defecto
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Si tienes un Header fijo en esta pantalla, renderízalo aquí */}
            {/* <Header title="Pronóstico del Clima" /> */}

            <View style={styles.content}>
                <Text style={styles.title}>Pronóstico del Clima</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={location}
                        onChangeText={setLocation}
                        placeholder="Ingresa la ubicación (ej. Madrid, España)"
                        onSubmitEditing={handleGetWeather} // Permite buscar con Enter
                        editable={!loading}
                    />
                    <Button title="Buscar" onPress={handleGetWeather} disabled={loading || !location.trim()} />
                </View>

                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0000ff" />
                        <Text style={styles.loadingText}>Obteniendo pronóstico...</Text>
                    </View>
                )}

                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                {weatherData && (
                    <ScrollView style={styles.weatherDataContainer}>
                        <Text style={styles.locationText}>Clima actual en {weatherData.location}:</Text>
                        <View style={styles.currentWeather}>
                            <Feather name={getWeatherIcon(weatherData.current.description)} size={40} color="#333" />
                            <View>
                                <Text style={styles.currentTemp}>{weatherData.current.temperature}°C</Text>
                                <Text style={styles.currentDesc}>{weatherData.current.description}</Text>
                            </View>
                            <View style={styles.currentDetails}>
                                <Text>Humedad: {weatherData.current.humidity}%</Text>
                                <Text>Viento: {weatherData.current.wind_speed} km/h</Text>
                            </View>
                        </View>

                        {weatherData.forecast && weatherData.forecast.length > 0 && (
                            <View style={styles.forecastContainer}>
                                <Text style={styles.forecastTitle}>Pronóstico para los próximos días:</Text>
                                {weatherData.forecast.map((day, index) => (
                                    <View key={index} style={styles.forecastDay}>
                                        <Text style={styles.forecastDate}>{day.date}</Text>
                                        <Feather name={getWeatherIcon(day.description)} size={20} color="#555" />
                                        <Text style={styles.forecastTemp}>{day.temp_max}°C / {day.temp_min}°C</Text>
                                        <Text style={styles.forecastDesc}>{day.description}</Text>
                                        <Text style={styles.forecastRain}>Lluvia: {day.rain_probability}%</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </ScrollView>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 10,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },
    errorContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#ffcccc',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
    weatherDataContainer: {
        flex: 1, // Permite que el ScrollView ocupe el espacio restante
    },
    locationText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    currentWeather: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    currentTemp: {
        fontSize: 32,
        fontWeight: 'bold',
        marginRight: 10,
    },
    currentDesc: {
        fontSize: 18,
        color: '#555',
    },
    currentDetails: {
        marginLeft: 'auto', // Empuja los detalles a la derecha
        alignItems: 'flex-end',
    },
    forecastContainer: {
        marginTop: 20,
    },
    forecastTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    forecastDay: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Distribuye los elementos
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    forecastDate: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1.5, // Da más espacio a la fecha
    },
    forecastTemp: {
        fontSize: 16,
        flex: 1, // Espacio para temperaturas
        textAlign: 'center',
    },
    forecastDesc: {
        fontSize: 16,
        color: '#555',
        flex: 2, // Espacio para descripción
        textAlign: 'right',
    },
    forecastRain: {
        fontSize: 14,
        color: '#007bff',
        flex: 1, // Espacio para lluvia
        textAlign: 'right',
    },
});

export default WeatherScreen;