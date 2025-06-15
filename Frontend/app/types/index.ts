export interface ApiChatMessage {
  role: "human" | "ai" | "tool" | "system" | "unknown";
  content: string;
  name?: string;
  tool_call_id?: string;
}

export interface ChatRequestPayload {
  original_query: string;
  messages_history: ApiChatMessage[];
  session_id?: string;
}

export interface ChatResponseData {
  response_messages: ApiChatMessage[];
  final_state_messages: ApiChatMessage[];
  session_id?: string;
  error?: boolean;
  message?: string;
}

export interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  wind_speed: number;
  icon?: string;
}

export interface DailyForecastData {
  date: string;
  temp_min: number;
  temp_max: number;
  description: string;
  icon?: string;
}

export interface WeeklyForecastResponseData {
  location: string;
  forecasts: DailyForecastData[];
}

export type ModalType =
  | "weatherInfo"
  | "plotSelection"
  | "userProfile"
  | "chatHistory"
  | null;

export interface ModalPayload {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  plotId?: string;
}

export interface ModalState {
  openModal: ModalType;
  payload: ModalPayload | null;
}

export interface ModalContextType extends ModalState {
  showModal: (modalType: ModalType, payload?: ModalPayload) => void;
  hideModal: () => void;
}
