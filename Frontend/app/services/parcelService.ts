import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { Parcel } from '../types/ParcelTypes';
import { v4 as uuidv4 } from 'uuid';

const PARCELS_STORAGE_KEY = '@agrosmi_parcels';

export async function loadParcels(): Promise<Parcel[]> {
    try {
        const jsonValue = await AsyncStorage.getItem(PARCELS_STORAGE_KEY);
        const parcels = jsonValue != null ? JSON.parse(jsonValue) : [];
        console.log("Parcelas cargadas:", parcels);
        return parcels;
    } catch (e) {
        console.error("Error loading parcels:", e);
        return [];
    }
}

async function saveParcels(parcels: Parcel[]): Promise<void> {
    try {
        const jsonValue = JSON.stringify(parcels);
        await AsyncStorage.setItem(PARCELS_STORAGE_KEY, jsonValue);
        console.log("Parcelas guardadas:", parcels);
    } catch (e) {
        console.error("Error saving parcels:", e);
    }
}

export async function addParcel(newParcelData: Omit<Parcel, 'id'>): Promise<Parcel[]> {
    const currentParcels = await loadParcels();
    const parcelToAdd: Parcel = {
        id: uuidv4(),
        ...newParcelData,
    };
    const updatedParcels = [...currentParcels, parcelToAdd];
    await saveParcels(updatedParcels);
    return updatedParcels;
}

export async function deleteParcel(parcelId: string): Promise<Parcel[]> {
    const currentParcels = await loadParcels();
    const updatedParcels = currentParcels.filter(parcel => parcel.id !== parcelId);
    await saveParcels(updatedParcels);
    return updatedParcels;
}

export async function getParcelById(parcelId: string): Promise<Parcel | undefined> {
    const parcels = await loadParcels();
    return parcels.find(parcel => parcel.id === parcelId);
}