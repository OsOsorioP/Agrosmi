import { post } from './api';
import { ChatRequest, ChatResponse } from '../types/AgentTypes'; 

export async function sendMessageToAgent(consulta: string, threadId: string): Promise<ChatResponse> {
    const endpoint = '/chat'; 
    const requestBody: ChatRequest = {
        consulta: consulta,
        thread_id: threadId,
    };
    const response = await post<ChatResponse>(endpoint, requestBody);

    return response;
}