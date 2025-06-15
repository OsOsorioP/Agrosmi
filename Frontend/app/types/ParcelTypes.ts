// types/ParcelTypes.ts

export interface Parcel {
    id: string; // ID único de la parcela (ej. generado con uuid)
    plot_id: string; // El ID que usa el usuario o el sistema externo (ej. "A-001")
    name?: string; // Nombre opcional dado por el usuario (ej. "Mi Campo Norte")
    location: string; // Ubicación (ej. "Lat: X, Lon: Y" o "Finca La Esperanza, Sector 3")
    cultivo: string; // Tipo de cultivo (ej. "Maíz", "Trigo")
    etapa_cultivo?: string; // Etapa actual del cultivo (ej. "Siembra", "Floración")
    area?: number; // Área en hectáreas (opcional)
    // Agrega otros campos según necesites
}