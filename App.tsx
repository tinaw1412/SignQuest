import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform } from 'react-native';
import BottomNav from './src/components/BottomNav';
import Dashboard from './src/screens/Dashboard';
import Daily from './src/screens/Daily';
import Leaderboard from './src/screens/Leaderboard';
import Profile from './src/screens/Profile';
import GreetingsLesson from './src/screens/lessons/GreetingsLesson';
import AnimalLesson from './src/screens/lessons/AnimalLesson';
import Lessons from './src/screens/Lessons';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LessonProgressProvider } from './src/context/LessonProgressContext';
import Auth from './src/screens/Auth';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type RootStackParamList = {
  MainTabs: undefined;
  GreetingsLesson: undefined;
  AnimalLesson: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

type TabKey = 'Home' | 'Learn' | 'Daily' | 'Rank' | 'Profile';

// This is the main tab layout — no navigator nesting needed
function MainTabs() {
  const [active, setActive] = useState<TabKey>('Home');

  const renderScreen = () => {
    switch (active) {
      case 'Home': return <Dashboard />;
      case 'Learn': return <Lessons />;
      case 'Daily': return <Daily />;
      case 'Rank': return <Leaderboard />;
      case 'Profile': return <Profile />;
    }
  };

  return (
    <View style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.content}>
          {renderScreen()}
        </View>
        <BottomNav active={active} onTabPress={setActive} />
        <StatusBar style="light" />
      </View>
    </View>
  );
}

function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="GreetingsLesson" component={GreetingsLesson} />
      <Stack.Screen name="AnimalLesson" component={AnimalLesson} />
    </Stack.Navigator>
  );
}

function AuthGate() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Auth />;
  return <AppNavigator />;
}

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <LessonProgressProvider>
          <AuthGate />
        </LessonProgressProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#23254b',
    paddingTop: Platform.OS === 'android' ? 24 : 44,
  },
  container: { flex: 1, backgroundColor: '#23254b' },
  content: { flex: 1, paddingBottom: 72 },
});