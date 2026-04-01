import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Platform } from 'react-native';
import BottomNav from './src/components/BottomNav';
import Dashboard from './src/screens/Dashboard';
import Lessons from './src/screens/Lessons';
import Daily from './src/screens/Daily';
import Leaderboard from './src/screens/Leaderboard';
import Profile from './src/screens/Profile';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import Auth from './src/screens/Auth';

type TabKey = 'Home' | 'Learn' | 'Daily' | 'Rank' | 'Profile';

function AuthGate() {
  const { user, loading } = useAuth();
  const [active, setActive] = useState<TabKey>('Home');

  if (loading) return null;
  if (!user) return <Auth />;

  return (
    <View style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.content}>
          {active === 'Home' ? (
            <Dashboard />
          ) : active === 'Learn' ? (
            <Lessons />
          ) : active === 'Daily' ? (
            <Daily />
          ) : active === 'Rank' ? (
            <Leaderboard />
          ) : active === 'Profile' ? (
            <Profile />
          ) : (
            <>
              <Text style={styles.title}>SignQuest</Text>
              <Text style={styles.subtitle}>Current tab: {active}</Text>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>{active} Screen</Text>
                <Text style={styles.cardBody}>This is a placeholder for the {active} screen.</Text>
              </View>
            </>
          )}
        </View>

        <BottomNav active={active} onTabPress={(t) => setActive(t)} />
        <StatusBar style="light" />
      </View>
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AuthGate>
        {/* children not used in gate, kept for structure */}
      </AuthGate>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  // Add extra top padding so content is visually separated from the device status area
  safe: { flex: 1, backgroundColor: '#23254b', paddingTop: Platform.OS === 'android' ? 24 : 44 },
  container: { flex: 1, backgroundColor: '#23254b' },
  content: { flex: 1, padding: 20, paddingBottom: 92 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginTop: 8 },
  subtitle: { color: '#cbd5ff', fontSize: 14, marginTop: 6 },
  card: {
    marginTop: 20,
    backgroundColor: '#e6e6ee',
    borderRadius: 12,
    padding: 16,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  cardBody: { marginTop: 8, color: '#333' },
});
