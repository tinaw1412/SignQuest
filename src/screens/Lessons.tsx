import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useLessonProgress } from '../context/LessonProgressContext';
import GreetingsLesson from './lessons/GreetingsLesson';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useState } from 'react';

type LearnStackParamList = {
  LessonsList: undefined;
  GreetingsLesson: undefined;
};
function SmallChip({ children }: { children: React.ReactNode }) {
    return (
        <View style={styles.chip}>
            <Text style={styles.chipText}>{children}</Text>
        </View>
    );
}

function LessonCard({ title, progress, status, onPress }: { 
    title: string; 
    progress?: number; 
    status: 'completed' | 'inprogress' | 'locked';
    onPress?: () => void; 
}) {
    return (
        <TouchableOpacity 
            style={styles.lessonCard} 
            onPress={onPress} 
            disabled={status === 'locked'} 
            activeOpacity={0.7}
        >
            <View style={styles.lessonHeader}>
                <Text style={styles.lessonTitle}>{title}</Text>
                {status === 'inprogress' && (
                    <View style={styles.continuePill}>
                        <Text style={styles.continueText}>Continue</Text>
                    </View>
                )}
            </View>

            {status === 'locked' ? (
                <Text style={styles.locked}>🔒 Locked</Text>
            ) : (
                <View style={styles.lessonBody}>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { flex: progress ?? 0 }]} />
                        <View style={[styles.progressEmpty, { flex: 100 - (progress ?? 0) }]} />
                    </View>
                    <Text style={styles.lessonStatus}>
                        {status === 'completed' ? 'Completed' : 'In Progress'}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

export default function Lessons() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { greetingsWatched, greetingsQuizIndex, greetingsQuizScore, greetingsQuizCompleted, animalsWatched, animalsQuizIndex, animalsQuizScore, animalsQuizCompleted } = useLessonProgress();
  const [refreshKey, setRefreshKey] = useState(0);

  // Refresh UI when lesson screen comes back to focus
  useFocusEffect(
    React.useCallback(() => {
      setRefreshKey(k => k + 1);
    }, [])
  );

  // Calculate GreetingsLesson progress
  // If quiz is completed, show 100%, otherwise calculate based on videos + quiz progress
  let totalProgress = 0;
  
  if (greetingsQuizCompleted) {
    totalProgress = 100;
  } else {
    // 3 videos + 14 quiz questions = 17 total steps
    const videosWatched = greetingsWatched.filter(Boolean).length;
    const quizQuestionsAnswered = greetingsQuizIndex + (greetingsQuizScore > 0 ? 1 : 0);
    totalProgress = Math.round(((videosWatched + quizQuestionsAnswered) / 17) * 100);
  }

  // Calculate AnimalLesson progress
  let animalsProgress = 0;
  
  if (animalsQuizCompleted) {
    animalsProgress = 100;
  } else {
    // 4 videos + 12 quiz questions = 16 total steps
    const videosWatched = animalsWatched.filter(Boolean).length;
    const quizQuestionsAnswered = animalsQuizIndex + (animalsQuizScore > 0 ? 1 : 0);
    animalsProgress = Math.round(((videosWatched + quizQuestionsAnswered) / 16) * 100);
  }

    return (
        <ScrollView key={refreshKey} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.headerRow}>
                <Text style={styles.screenTitle}>Lessons</Text>
            </View>

            <Text style={styles.sectionLabel}>Categories:</Text>
            <View style={styles.chipsRow}>
                <SmallChip>Basics</SmallChip>
                <SmallChip>Food</SmallChip>
                <SmallChip>Phrases</SmallChip>
            </View>

            <LessonCard 
                title="Lesson 1: Greetings" 
                progress={totalProgress} 
                status={greetingsQuizCompleted ? 'completed' : 'inprogress'} 
                onPress={() => navigation.navigate('GreetingsLesson')} 
            />
            <LessonCard title="Lesson 2: Colors" progress={0} status="inprogress" />
            <LessonCard 
                title="Lesson 3: Animals" 
                progress={animalsProgress} 
                status={animalsQuizCompleted ? 'completed' : 'inprogress'} 
                onPress={() => navigation.navigate('AnimalLesson')} 
            />
            <LessonCard title="Lesson 4: Feelings" progress={0} status="inprogress" />

            <View style={{ height: 120 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 140,
        backgroundColor: 'transparent',
    },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    back: { paddingRight: 12 },
    backIcon: { color: '#fff', fontSize: 20 },
    screenTitle: { color: '#fff', fontSize: 28, fontWeight: '600' },
    sectionLabel: { color: '#fff', marginTop: 8 },
    chipsRow: { flexDirection: 'row', marginTop: 10 },
    chip: { backgroundColor: '#e6e6ee', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 10 },
    chipText: { color: '#111', fontWeight: '600' },
    // Keep cards visually separated with a subtle blue rounded border to match the mockup
    lessonCard: { marginTop: 16, padding: 14, borderRadius: 12, backgroundColor: 'transparent', borderWidth: 2, borderColor: '#6fb0ff' },
    lessonHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    lessonTitle: { color: '#fff', fontSize: 16, fontWeight: '600' },
    continuePill: { backgroundColor: '#e6e6ee', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16 },
    continueText: { color: '#111', fontWeight: '700' },
    lessonBody: { marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    progressBar: { flex: 1, height: 18, borderRadius: 8, overflow: 'hidden', flexDirection: 'row', marginRight: 12, backgroundColor: '#666' },
    progressFill: { backgroundColor: '#c0c7d9' },
    progressEmpty: { backgroundColor: '#e6e6ee' },
    lessonStatus: { color: '#fff' },
    locked: { marginTop: 10, color: '#fff' },
});
