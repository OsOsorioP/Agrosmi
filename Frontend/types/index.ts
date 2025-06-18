export interface ApiChatMessage {
  role: "human" | "ai" | "system" | "tool" | "unknown";
  content: string;
  name?: string;
  tool_call_id?: string;
}

export interface ChatRequestPayload {
  user_input: string;
  messages_history: ApiChatMessage[];
  thread_id: string;
}

export interface ChatResponseData {
  response_messages: ApiChatMessage[];    
  final_state_messages: ApiChatMessage[]; 
  session_id: string;                    
  error: boolean;                         
  message: string;                     
  // tool_results?: any;
  // last_agent?: string;
}

// src/types.ts

// Coordenadas básicas de latitud/longitud
export interface LatLng {
  latitude: number;
  longitude: number;
}

// Región del mapa
export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

// Tipos GeoJSON (simplificados para este caso)
// Un punto GeoJSON es [longitude, latitude]
export type GeoJSONPointCoordinates = [number, number];
// Un anillo de polígono GeoJSON es un array de puntos, donde el primero y el último son iguales
export type GeoJSONLinearRing = GeoJSONPointCoordinates[];
// Un polígono GeoJSON es un array de anillos (el primero es el exterior, los siguientes son agujeros)
export type GeoJSONPolygonCoordinates = GeoJSONLinearRing[];

// Estructura de la geometría GeoJSON para un polígono
export interface GeoJSONPolygon {
  type: 'Polygon';
  coordinates: GeoJSONPolygonCoordinates;
}

// Datos de la parcela para enviar al backend
export interface ParcelCreate {
  name: string;
  description?: string; // Opcional
  geometry: GeoJSONPolygon;
}

// Datos de la parcela recibidos del backend (con ID y fecha)
export interface ParcelResponse extends ParcelCreate {
  id: number;
  created_at: string; // O Date si lo parseas
}