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