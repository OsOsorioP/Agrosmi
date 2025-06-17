import { useHeaderHeight } from '@react-navigation/elements';
import { useState } from 'react';
import { Text, StyleSheet, View, StatusBar, TextInput, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LegendList } from "@legendapp/list";
import { IconSymbol } from '@/components/ui/IconSymbol';
import { postChatMessage } from '@/services/ChatService';
import { ApiChatMessage } from '@/types';


export default function Tab() {
  const [threadId, setThreadId] = useState<string>("1");
  const [messages, setMessages] = useState<ApiChatMessage[]>([])
  const [userInput, setUserInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const headerHeight = Platform.OS === 'ios' ? useHeaderHeight() : 0;

  const sendMessage = async (newMessage: string) => {
    setIsLoading(true);
    if (newMessage.trim() === "") {
      setIsLoading(false)
      return;
    }
    try {

      const newUserMessage: ApiChatMessage = {
        role: "human",
        content: newMessage,
      };

      const updatedHistoryForAPI = [...messages, newUserMessage];

      setMessages(updatedHistoryForAPI)

      setUserInput("")

      const apiResponse = await postChatMessage(
        newMessage,
        updatedHistoryForAPI,
        threadId
      );

      setMessages(apiResponse.final_state_messages)

    } catch (error) {
      console.error(error);
      const errorMessage: ApiChatMessage = {
        role: 'ai',
        content: 'Error al conectar con el servidor. Inténtalo de nuevo.'
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  const startNewConversation = () => {
    setMessages([]);
    setUserInput("");
    setThreadId("2");
  }

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior='padding'
        keyboardVerticalOffset={headerHeight}
      >
        <LegendList
          data={messages}
          renderItem={({ item }) => (
            <View style={[styles.message, item.role === 'human' ? styles.messageHuman : styles.messageAi]}>
              <Text style={[item.role === 'human' ? {color:'white'} : {color:'black'}]}>{item.content}</Text>
            </View>
          )}
          contentContainerStyle={{padding:10}}
          recycleItems={true}
          initialScrollIndex={messages.length - 1}
          alignItemsAtEnd
          maintainScrollAtEnd
          maintainScrollAtEndThreshold={0.5}
          estimatedItemSize={100}
        >
        </LegendList>
        <View
          style={styles.chatInput}
        >
          <TextInput
            onChangeText={setUserInput}
            value={userInput}
            placeholder='Message...'
            style={styles.input}
            multiline
            placeholderTextColor={"gray"}
          />
          <Pressable
            onPress={() => sendMessage(userInput)}
            disabled={userInput === "" || isLoading}
            style={{
              width: 50,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <IconSymbol
              name='enviar.fill'
              color={userInput === "" ? "gray" : "green"}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    paddingTop: StatusBar.currentHeight,
  },
  message: {
    flex:1,
    padding:10,
    borderRadius:10,
    color:'white',
    borderWidth:1,
    borderColor:"gray",
    marginVertical:5,
  },
  messageHuman: {
    backgroundColor: "green",
    alignSelf: "flex-end",
    color:'white',
  },
  messageAi: {
    backgroundColor: "transparent",
    alignSelf: "flex-start",
  },
  chatInput: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 8,
    marginBottom: 8,
    marginHorizontal: 10,
  },
  input: {
    minHeight: 40,
    maxHeight: 150,
    flexGrow: 1,
    flexShrink: 1,
    padding: 10
  }
});