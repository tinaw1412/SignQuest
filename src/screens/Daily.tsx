import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function Daily() {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Daily Challenge</Text>

      <View style={styles.card}>
        <Text style={styles.cardHeading}>🎯 Today's Challenge:</Text>

        <View style={styles.cardBody}>
          <Text style={styles.cardText}>Learn 3 new signs</Text>
          <Text style={styles.cardText}>Difficulty: <Text style={styles.bold}>⭐⭐</Text></Text>
          <Text style={styles.cardText}>Reward: <Text style={styles.bold}>+200 XP</Text></Text>

          <Text style={[styles.cardText, { marginTop: 12 }]}>Time Estimate: 5 min</Text>

          <TouchableOpacity style={styles.startButton} accessibilityRole="button">
            <Text style={styles.startText}>Start</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 160 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 140,
    backgroundColor: '#23254b',
    alignItems: 'center',
  },
  title: { color: '#fff', fontSize: 32, fontWeight: '600', marginTop: 8, marginBottom: 12 },
  card: {
    width: '86%',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#6fb0ff',
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  cardHeading: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 10, textAlign: 'center' },
  cardBody: { alignItems: 'center' },
  cardText: { color: '#fff', fontSize: 16, textAlign: 'center', marginTop: 6 },
  bold: { fontWeight: '800' },
  startButton: {
    marginTop: 16,
    backgroundColor: '#e6e6ee',
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 28,
  },
  startText: { color: '#111', fontSize: 16, fontWeight: '600' },
});
