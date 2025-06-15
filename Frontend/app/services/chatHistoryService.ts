import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatConversation } from '../types/ChatHistoryTypes';
import { UIMessage } from '../types/AgentTypes';

const CHAT_HISTORY_STORAGE_KEY = '@agrosmi_chat_history';

export async function loadChatHistory(): Promise<ChatConversation[]> {
    try {
        const jsonValue = await AsyncStorage.getItem(CHAT_HISTORY_STORAGE_KEY);
        const history = jsonValue != null ? JSON.parse(jsonValue) : [];
        console.log("Historial de chat cargado:", history.length, "conversaciones");
        return history;
    } catch (e) {
        console.error("Error loading chat history:", e);
        return [];
    }
}

async function saveChatHistory(history: ChatConversation[]): Promise<void> {
    try {
        const jsonValue = JSON.stringify(history);
        await AsyncStorage.setItem(CHAT_HISTORY_STORAGE_KEY, jsonValue);
        console.log("Historial de chat guardado:", history.length, "conversaciones");
    } catch (e) {
        console.error("Error saving chat history:", e);
    }
}

export async function saveConversation(conversation: ChatConversation): Promise<void> {
    const history = await loadChatHistory();
    const existingIndex = history.findIndex(chat => chat.id === conversation.id);

    if (existingIndex > -1) {
        history[existingIndex] = conversation;
    } else {
        history.push(conversation);
    }

    history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    await saveChatHistory(history);
}

export async function deleteConversation(conversationId: string): Promise<void> {
    const history = await loadChatHistory();
    const updatedHistory = history.filter(chat => chat.id !== conversationId);
    await saveChatHistory(updatedHistory);
}

export async function loadConversationById(conversationId: string): Promise<ChatConversation | undefined> {
    const history = await loadChatHistory();
    return history.find(chat => chat.id === conversationId);
}

export async function loadMessagesByConversationId(conversationId: string): Promise<UIMessage[]> {
    const conversation = await loadConversationById(conversationId);
    return conversation ? conversation.messages : [];
}