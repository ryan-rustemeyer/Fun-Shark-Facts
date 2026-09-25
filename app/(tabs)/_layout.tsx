import { Redirect, Tabs } from 'expo-router'
import { Text, View } from 'react-native'
import { useAuth } from '../_layout'

export default function TabsLayout() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
        <Text>Loading...</Text>
      </View>
    )
  }

  if (!session) {
    return <Redirect href="/login" />
  }

  return (
    
    <Tabs screenOptions={{tabBarStyle: {display: 'none'}}}>
      <Tabs.Screen name="index" options={{ title: 'Home', 
        headerShown: false,
       }} />
       <Tabs.Screen name="whale" options={{  
        headerShown: false,
       }} />
       <Tabs.Screen name="thresher" options={{  
        headerShown: false,
       }} />
       <Tabs.Screen name="nurse" options={{  
        headerShown: false,
       }} />
       <Tabs.Screen name="bookmarks" options={{  
        headerShown: false,
       }} />
       <Tabs.Screen name="account" options={{  
        headerShown: false,
       }} />
       <Tabs.Screen name="template" options={{  
        headerShown: false,
       }} />
       
    </Tabs>
  )
}