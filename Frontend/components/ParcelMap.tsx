// components/ParcelMap.tsx
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Button, Alert, ActivityIndicator, TextInput } from 'react-native';
import MapView, { Polygon, Marker, MapPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { LatLng, MapRegion, ParcelCreate, ParcelResponse, GeoJSONPolygonCoordinates, GeoJSONPointCoordinates } from '../types'; // Importa tus tipos
import { SafeAreaView } from 'react-native-safe-area-context';

// Asegúrate de que esta IP sea la de tu máquina local donde corre el backend
// Si estás en un emulador Android, '10.0.2.2' suele ser la IP del host.
// Si estás en un dispositivo físico, usa la IP de tu máquina en la red local (ej. '192.168.1.100').
const API_URL = 'http://TU_IP_LOCAL:8000/api/parcels';

export default function ParcelMap() {
    const [currentLocation, setCurrentLocation] = useState<MapRegion | null>(null);
    const [polygonCoordinates, setPolygonCoordinates] = useState<LatLng[]>([]);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [parcelName, setParcelName] = useState<string>('');
    const [parcelDescription, setParcelDescription] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const mapRef = useRef<MapView>(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso de ubicación denegado', 'Necesitamos acceso a tu ubicación para mostrar el mapa.');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setCurrentLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            });
        })();
    }, []);

    const handleMapPress = (e: MapPressEvent) => {
        if (isDrawing) {
            setPolygonCoordinates([...polygonCoordinates, e.nativeEvent.coordinate]);
        }
    };

    const startDrawing = () => {
        setPolygonCoordinates([]);
        setIsDrawing(true);
        Alert.alert('Modo Dibujo', 'Toca el mapa para añadir vértices de tu parcela. Toca "Terminar Dibujo" cuando hayas terminado.');
    };

    const finishDrawing = () => {
        if (polygonCoordinates.length < 3) {
            Alert.alert('Error', 'Necesitas al menos 3 puntos para formar un polígono.');
            return;
        }
        setIsDrawing(false);
        Alert.alert('Dibujo Terminado', 'Ahora puedes guardar tu parcela.');
    };

    const saveParcel = async () => {
        if (polygonCoordinates.length < 3) {
            Alert.alert('Error', 'No hay un polígono válido para guardar.');
            return;
        }
        if (!parcelName.trim()) {
            Alert.alert('Error', 'Por favor, ingresa un nombre para la parcela.');
            return;
        }

        setIsLoading(true);
        try {
            // Convertir LatLng[] a GeoJSONPolygonCoordinates
            // GeoJSON usa [longitude, latitude] y el primer/último punto deben ser iguales
            const geoJsonCoords: GeoJSONPolygonCoordinates = [
                [
                    ...polygonCoordinates.map(coord => [coord.longitude, coord.latitude] as GeoJSONPointCoordinates),
                    [polygonCoordinates[0].longitude, polygonCoordinates[0].latitude] // Cerrar el polígono
                ]
            ];

            const parcelData: ParcelCreate = {
                name: parcelName,
                description: parcelDescription,
                geometry: {
                    type: 'Polygon',
                    coordinates: geoJsonCoords,
                },
            };

            const response = await axios.post<ParcelResponse>(API_URL, parcelData);
            Alert.alert('Éxito', 'Parcela guardada correctamente!');
            console.log('Parcela guardada:', response.data);
            setPolygonCoordinates([]);
            setParcelName('');
            setParcelDescription('');
        } catch (error: any) {
            console.error('Error al guardar la parcela:', error.response ? error.response.data : error.message);
            Alert.alert('Error', 'No se pudo guardar la parcela. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                {currentLocation ? (
                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        initialRegion={currentLocation}
                        onPress={handleMapPress}
                        showsUserLocation={true}
                        mapType='satellite'
                    >
                        {polygonCoordinates.map((coord, index) => (
                            <Marker
                                key={index}
                                coordinate={coord}
                                pinColor="green"
                            />
                        ))}
                        {polygonCoordinates.length >= 2 && (
                            <Polygon
                                coordinates={polygonCoordinates}
                                strokeColor="#fff"
                                fillColor="rgba(58, 255, 68, 0.43)"
                                strokeWidth={2}
                            />
                        )}
                    </MapView>
                ) : (
                    <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
                )}

                <View style={styles.controls}>
                    {!isDrawing ? (
                        <Button title="Empezar a Dibujar Parcela" onPress={startDrawing} />
                    ) : (
                        <Button title="Terminar Dibujo" onPress={finishDrawing} color="orange" />
                    )}

                    {polygonCoordinates.length >= 3 && !isDrawing && (
                        <>
                            <TextInput
                                style={styles.input}
                                placeholder="Nombre de la Parcela"
                                value={parcelName}
                                onChangeText={setParcelName}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Descripción (opcional)"
                                value={parcelDescription}
                                onChangeText={setParcelDescription}
                                multiline
                            />
                            <Button
                                title={isLoading ? "Guardando..." : "Guardar Parcela"}
                                onPress={saveParcel}
                                disabled={isLoading}
                            />
                        </>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1, 
        padding:5,
    },
    container: {
        flex: 1,
        gap: 5,
        width: "100%"
    },
    map: {
        flex: 3,
    },
    controls: {
        padding: 10,
        backgroundColor: 'transparent',
        gap:5,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
});