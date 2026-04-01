import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, signOut } = useAuth();

  const name = user ? `${user.firstName} ${user.lastName}` : 'Guest';

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.nameRow}>
        <Text style={styles.avatar}>👤</Text>
        <Text style={styles.name}>{user ? user.firstName : 'User'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardText}>Level 4</Text>
        <Text style={styles.cardText}>XP: 2800</Text>
        <Text style={styles.cardText}>🔥 Streak: 5 days</Text>
      </View>

      <View style={styles.card}>
        <Text style={[styles.cardText, { fontWeight: '700' }]}>Stats:</Text>
        <Text style={styles.cardText}>Lessons Completed: 2</Text>
        <Text style={styles.cardText}>Challenges Done: 1</Text>
      </View>

      <View style={styles.card}>
        <Text style={[styles.cardText, { fontWeight: '700' }]}>Achievements:</Text>
        <View style={{ marginTop: 8 }}>
          <Text style={styles.bullet}>• 5 Day Streak</Text>
          <Text style={styles.bullet}>• First Lesson</Text>
          <Text style={styles.bullet}>• Second Lesson</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logout} accessibilityRole="button" onPress={() => signOut()}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={{ height: 160 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 140,
    backgroundColor: '#23254b',
  },
  title: { color: '#fff', fontSize: 32, fontWeight: '600', textAlign: 'center', marginTop: 8, marginBottom: 12 },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { fontSize: 28, color: '#9fc7ff', marginRight: 8 },
  name: { color: '#fff', fontSize: 20, fontWeight: '600' },
  card: {
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#6fb0ff',
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  cardText: { color: '#fff', fontSize: 16, marginTop: 6 },
  bullet: { color: '#fff', fontSize: 16, marginTop: 6, marginLeft: 6 },
  logout: { marginTop: 18, backgroundColor: '#e6e6ee', paddingVertical: 10, paddingHorizontal: 22, borderRadius: 28, alignSelf: 'flex-start' },
  logoutText: { color: '#111', fontSize: 16, fontWeight: '600' },
});
