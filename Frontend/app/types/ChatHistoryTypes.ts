// types/ChatHistoryTypes.ts

import { UIMessage } from './AgentTypes'; // Reutiliza el tipo de mensaje UI

// Estructura de una conversación guardada
export interface ChatConversation {
    id: string; // ID único de la conversación (el thread_id de LangGraph)
    title: string; // Título para identificar la conversación (ej. "Consulta sobre humedad A-001")
    messages: UIMessage[]; // Lista de mensajes en esta conversación
    timestamp: string; // Marca de tiempo del último mensaje o inicio
}