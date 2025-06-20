import { Tabs } from 'expo-router';
import { IconSymbol, MAPPING } from '@/components/ui/IconSymbol';
import { TabBar } from '@/components/TabBar';

interface props {
  name: string;
  title: string;
  icon: keyof typeof MAPPING;
}

export default function TabLayout() {

  const tabsScreens: props[] = [
    { name: "index", title: "Chat", icon: "message.fill" },
    { name: "clima", title: "Clima", icon: "cloud.fill" },
    { name: "parcelas", title: "Parcelas", icon: "map.fill" },
    { name: "chats", title: "Chats", icon: "archive.fill" },
    { name: "usuario", title: "Usuario", icon: "user.fill" },
  ]

  return (
    <Tabs
    tabBar={props => <TabBar {...props}/>}
      screenOptions={{ 
        headerShown:false,
        tabBarActiveTintColor: 'green', 
        tabBarInactiveTintColor:"black",
        tabBarBadgeStyle: {
          backgroundColor:"#333",
          color:"#fff"
        },
        animation: "fade",
        tabBarStyle: {
          margin:5,
          borderRadius:16,
          height:70,
          boxShadow:"",
        }
      }}
    >
      {tabsScreens.map((screen, index) => (
        <Tabs.Screen
          key={index}
          name={screen.name}
          options={{
            title: `${screen.title}`,
            tabBarIcon: ({ color, size }) => <IconSymbol size={size} name={`${screen.icon}`} color={color} />,
          }}
        />
      ))}
      <Tabs.Screen name='+not-found' options={{ href: null }} />
    </Tabs>
  );
}
