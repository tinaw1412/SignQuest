import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useLessonProgress } from '../context/LessonProgressContext';
import DailyChallengeQuiz from './lessons/DailyChallengeQuiz';

interface Props {}

export default function DailyQuiz({}: Props) {
  const navigation = useNavigation();
  const { awardXp } = useAuth();
  const { 
    greetingsQuizCompleted, animalsQuizCompleted, colorsQuizCompleted, feelingsQuizCompleted,
    dailyQuizCompletedDate, setDailyQuizCompletedDate 
  } = useLessonProgress();
  const [phase, setPhase] = useState<'quiz' | 'complete'>('quiz');
  const [score, setScore] = useState(0);

  const completedCount = [greetingsQuizCompleted, animalsQuizCompleted, colorsQuizCompleted, feelingsQuizCompleted].filter(Boolean).length;
  const hasAny = completedCount > 0;

  // Check if already completed today
  const completedToday = useMemo(() => {
    if (!dailyQuizCompletedDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return dailyQuizCompletedDate === today;
  }, [dailyQuizCompletedDate]);

  const handleQuizComplete = async (finalScore: number) => {
    setScore(finalScore);
    const today = new Date().toISOString().split('T')[0];
    setDailyQuizCompletedDate(today);
    await awardXp(50);
    setPhase('complete');
  };

  if (completedToday) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => (navigation as any).goBack()}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>✅</Text>
          <Text style={styles.emptyTitle}>Already Completed Today!</Text>
          <Text style={styles.emptyText}>
            You've already completed the daily challenge today. Come back tomorrow for a new quiz!
          </Text>
          <TouchableOpacity 
            style={styles.emptyBtn}
            onPress={() => (navigation as any).goBack()}
          >
            <Text style={styles.emptyBtnText}>Back to Daily</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!hasAny) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => (navigation as any).goBack()}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🎯</Text>
          <Text style={styles.emptyTitle}>No Lessons Completed</Text>
          <Text style={styles.emptyText}>
            You need to complete at least one lesson before taking the daily challenge.
          </Text>
          <TouchableOpacity 
            style={styles.emptyBtn}
            onPress={() => (navigation as any).goBack()}
          >
            <Text style={styles.emptyBtnText}>Back to Daily</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (phase === 'complete') {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => (navigation as any).goBack()}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.completeContainer}>
          <Text style={styles.completeTitle}>Challenge Complete! 🎉</Text>
          <View style={styles.completeCard}>
            <Text style={styles.completeCardTitle}>You earned:</Text>
            <Text style={styles.completeReward}>⭐  +50 XP</Text>
            <Text style={styles.completeScore}>Score: {score} / 3</Text>
            <View style={styles.divider} />
            <Text style={styles.completeSub}>Great job reviewing!</Text>
            <Text style={styles.completeText}>Come back tomorrow for another challenge.</Text>
          </View>
          <TouchableOpacity
            style={styles.doneBtn}
            onPress={() => (navigation as any).goBack()}
          >
            <Text style={styles.doneBtnText}>Back to Daily</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <DailyChallengeQuiz onComplete={handleQuizComplete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#23254b',
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#3a3d6e',
    zIndex: 10,
  },
  backBtnText: {
    color: '#6fb0ff',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    color: '#cbd5ff',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyBtn: {
    backgroundColor: '#6fb0ff',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyBtnText: {
    color: '#111',
    fontSize: 16,
    fontWeight: '700',
  },
  completeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  completeTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
  },
  completeCard: {
    borderWidth: 2,
    borderColor: '#6fb0ff',
    borderRadius: 18,
    padding: 20,
    backgroundColor: '#1d1f3d',
    marginBottom: 24,
    width: '100%',
  },
  completeCardTitle: {
    color: '#9fb0ff',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  completeReward: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  completeScore: {
    color: '#6fb0ff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#3a3d6e',
    marginVertical: 12,
  },
  completeSub: {
    color: '#9fb0ff',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  completeText: {
    color: '#9fb0ff',
    fontSize: 13,
    textAlign: 'center',
  },
  doneBtn: {
    backgroundColor: '#6fb0ff',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#111',
    fontSize: 16,
    fontWeight: '700',
  },
});
