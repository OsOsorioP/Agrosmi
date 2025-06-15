// types/WeatherTypes.ts

// Estructura de la solicitud para obtener el clima (si tuvieras un endpoint en backend)
export interface WeatherRequest {
    location: string;
    days?: number; // Número de días del pronóstico (opcional)
}

// Estructura de la respuesta del pronóstico del clima (simulada)
export interface WeatherResponse {
    location: string;
    current: {
        temperature: number; // en °C
        description: string; // ej. "Soleado", "Nublado"
        humidity: number; // en %
        wind_speed: number; // en km/h
    };
    forecast?: Array<{ // Pronóstico para los próximos días (opcional)
        date: string; // ej. "YYYY-MM-DD"
        temp_max: number;
        temp_min: number;
        description: string;
        rain_probability: number; // en %
    }>;
    // Puedes agregar más campos según la API real
}