// types/AgentTypes.ts

// Estructura de la solicitud que se envía a FastAPI /chat
export interface ChatRequest {
    consulta: string;
    thread_id: string;
}

// Estructura de la respuesta que se recibe de FastAPI /chat
export interface ChatResponse {
    response: string; // La respuesta del agente
    thread_id: string; // El ID del hilo de conversación (para mantener el estado)
    tool_results?: string; // Resultados de herramientas (opcional)
    last_agent?: string; // Último agente que procesó (opcional)
    validation_passed?: boolean; // Si la respuesta pasó validación (opcional)
    error?: string; // Mensaje de error si ocurrió uno (opcional)
}

// Define tipos para los mensajes en el frontend (para mostrar en la UI)
export interface UIMessage {
    id: string; // ID único para la clave de React
    text: string;
    sender: 'user' | 'bot' | 'system'; // Quién envió el mensaje
    timestamp: string; // Marca de tiempo para mostrar
    status?: 'sending' | 'sent' | 'error'; // Estado del mensaje (enviando, enviado, error)
}