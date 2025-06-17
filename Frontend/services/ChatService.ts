import axios from "axios";
import type {
  ChatRequestPayload,
  ChatResponseData,
  ApiChatMessage,
} from "../types";

const YOUR_LOCAL_IP = '192.168.80.10';
const API_PORT = '8000';

const API_BASE_URL = `http://${YOUR_LOCAL_IP}:${API_PORT}/api/v1`;

export const postChatMessage = async (
  originalQuery: string,
  messagesHistory: ApiChatMessage[],
  threadId: string 
): Promise<ChatResponseData> => {
  const payload: ChatRequestPayload = {
    user_input: originalQuery,
    messages_history: messagesHistory,
    thread_id: threadId,
  };
  console.log("Frontend: Enviando payload a /chat:", payload);

  try {
    const response = await axios.post<ChatResponseData>(
      `${API_BASE_URL}/chat`,
      payload
    );
    console.log("Frontend: Respuesta de API recibida:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Frontend: Error al enviar mensaje a la API:",
      error.response ? error.response.data : error.message
    );
    return {
      error: true,
      message:
        error.response?.data?.detail || "Error de conexión con el servidor.",
      response_messages: [],
      final_state_messages: messagesHistory,
      session_id: threadId,
    };
  }
};