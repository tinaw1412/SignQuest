import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLessonProgress } from '../context/LessonProgressContext';

export default function Daily() {
  const navigation = useNavigation();
  const { greetingsQuizCompleted, animalsQuizCompleted, colorsQuizCompleted, feelingsQuizCompleted } = useLessonProgress();

  // Count completed lessons
  const completedCount = [greetingsQuizCompleted, animalsQuizCompleted, colorsQuizCompleted, feelingsQuizCompleted].filter(Boolean).length;
  const hasAny = completedCount > 0;

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Daily Challenge</Text>

      <View style={styles.card}>
        <Text style={styles.cardEmoji}>🎯</Text>
        <Text style={styles.cardHeading}>Review Quiz</Text>
        <Text style={styles.cardSubtitle}>Test what you've learned</Text>

        <View style={styles.cardBody}>
          {hasAny ? (
            <>
              <Text style={styles.cardText}>
                3 random questions from your learned lessons
              </Text>
              <View style={styles.lessonsRow}>
                {greetingsQuizCompleted && (
                  <View style={styles.lessonsTag}>
                    <Text style={styles.lessonsTagText}>👋 Greetings</Text>
                  </View>
                )}
                {animalsQuizCompleted && (
                  <View style={styles.lessonsTag}>
                    <Text style={styles.lessonsTagText}>🐱 Animals</Text>
                  </View>
                )}
                {colorsQuizCompleted && (
                  <View style={styles.lessonsTag}>
                    <Text style={styles.lessonsTagText}>🎨 Colors</Text>
                  </View>
                )}
                {feelingsQuizCompleted && (
                  <View style={styles.lessonsTag}>
                    <Text style={styles.lessonsTagText}>😊 Feelings</Text>
                  </View>
                )}
              </View>
              <Text style={styles.rewardText}>Reward: <Text style={styles.bold}>+50 XP</Text></Text>
            </>
          ) : (
            <>
              <Text style={styles.cardText}>
                Complete a lesson first to unlock the daily challenge!
              </Text>
              <Text style={styles.hintText}>
                👉 Start a lesson from the Lessons tab to get started
              </Text>
            </>
          )}

          <TouchableOpacity 
            style={[styles.startButton, !hasAny && styles.startButtonDisabled]} 
            onPress={() => (navigation as any).navigate('DailyQuiz')}
            disabled={!hasAny}
            accessibilityRole="button"
          >
            <Text style={[styles.startText, !hasAny && styles.startTextDisabled]}>
              {hasAny ? 'Start Quiz' : 'Complete a lesson first'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {hasAny && (
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💡 How it works</Text>
          <Text style={styles.infoText}>• Questions are chosen from lessons you've completed</Text>
          <Text style={styles.infoText}>• Every completion gives you +50 XP</Text>
          <Text style={styles.infoText}>• Challenge once per day for maximum rewards!</Text>
        </View>
      )}

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: '#23254b',
    alignItems: 'center',
  },
  title: { 
    color: '#fff', 
    fontSize: 32, 
    fontWeight: '700', 
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#6fb0ff',
    padding: 20,
    backgroundColor: '#1d1f3d',
    alignItems: 'center',
    marginBottom: 24,
  },
  cardEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  cardHeading: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardSubtitle: {
    color: '#9fb0ff',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  cardBody: {
    width: '100%',
    alignItems: 'center',
  },
  cardText: {
    color: '#cbd5ff',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 8,
  },
  bold: { fontWeight: '700', color: '#fff' },
  lessonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 14,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  lessonsTag: {
    backgroundColor: '#3a3d6e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#6fb0ff',
  },
  lessonsTagText: {
    color: '#6fb0ff',
    fontSize: 13,
    fontWeight: '600',
  },
  rewardText: {
    color: '#cbd5ff',
    fontSize: 14,
    marginTop: 12,
  },
  hintText: {
    color: '#9fb0ff',
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  startButton: {
    marginTop: 18,
    backgroundColor: '#6fb0ff',
    paddingHorizontal: 36,
    paddingVertical: 12,
    borderRadius: 24,
  },
  startButtonDisabled: {
    backgroundColor: '#3a3d6e',
    opacity: 0.6,
  },
  startText: {
    color: '#111',
    fontSize: 16,
    fontWeight: '700',
  },
  startTextDisabled: {
    color: '#9fb0ff',
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#1a1c3a',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#6fb0ff',
  },
  infoTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  infoText: {
    color: '#9fb0ff',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
  },
});
