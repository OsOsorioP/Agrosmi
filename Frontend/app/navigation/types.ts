import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<RootTabParamList>; 
};

export type RootTabParamList = {
  Chat: undefined;
  Clima: undefined;
  Parcelas: undefined;
  Chats: NavigatorScreenParams<ChatHistoryStackParamList>; 
};

export type ChatHistoryStackParamList = {
  ChatHistoryList: undefined;
  ChatDetail: { conversationId: string; title: string };
};