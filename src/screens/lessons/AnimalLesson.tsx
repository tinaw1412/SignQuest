import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useLessonProgress } from '../../context/LessonProgressContext';
import LessonVideoPlayer, { Sign } from './GreetingsVideoPlayer';
import AnimalQuiz from './AnimalQuiz';

const SIGNS: Sign[] = [
  { 
    id: 0, 
    label: 'Cat', 
    emoji: '🐱', 
    description: 'One hand near mouth, pull back with "C" handshape',
    videoUri: require('../../../videos/cat.mp4'),
    tips: [
      '• Form a "C" handshape with one hand',
      '• Position near the side of your mouth',
      '• Pull fingers back toward your face',
    ]
  },
  { 
    id: 1, 
    label: 'Dog', 
    emoji: '🐶', 
    description: 'Pat your leg and snap fingers',
    videoUri: require('../../../videos/dog.mp4'),
    tips: [
      '• Pat your thigh with an open hand',
      '• Snap your fingers as if calling a pet',
      '• Repeat the motion smoothly',
    ]
  },
  { 
    id: 2, 
    label: 'Fish', 
    emoji: '🐠', 
    description: 'Palm wiggling forward like a fish',
    videoUri: require('../../../videos/fish.mp4'),
    tips: [
      '• Hold hand flat with palm facing inside',
      '• Wiggle and move forward smoothly',
      '• Mimics a swimming fish motion',
    ]
  },
  { 
    id: 3, 
    label: 'Rabbit', 
    emoji: '🐰', 
    description: 'Cross arms and wiggle two fingers like rabbit ears',
    videoUri: require('../../../videos/rabbit.mp4'),
    tips: [
      '• Cross both arms at the wrists',
      '• Wiggle two fingers on each crossed hand',
      '• Mimic the motion of rabbit ears',
    ]
  },
];

type Phase = 'learn' | 'quiz' | 'complete';

export default function AnimalLesson() {
  const { awardXp } = useAuth();
  const navigation = useNavigation();
  const { animalsWatched, setAnimalsWatched, animalsQuizCompleted, setAnimalsQuizIndex, setAnimalsQuizScore, setAnimalsQuizCompleted } = useLessonProgress();
  const [phase, setPhase] = useState<Phase>('learn');
  const [activeVideo, setActiveVideo] = useState<Sign | null>(null);

  // Reset quiz state if it was previously completed (for fresh retakes on re-entry)
  React.useEffect(() => {
    if (animalsQuizCompleted) {
      setAnimalsQuizIndex(0);
      setAnimalsQuizScore(0);
      setAnimalsQuizCompleted(false);
    }
  }, []);

  const markWatched = async (id: number) => {
    if (animalsWatched[id]) return;
    const updated = [...animalsWatched];
    updated[id] = true;
    setAnimalsWatched(updated);
    await awardXp(50);
  };

  const completedCount = animalsWatched.filter(Boolean).length;
  const progressPercent = Math.round((completedCount / SIGNS.length) * 100);
  const allWatched = completedCount === SIGNS.length;

  const handleQuizComplete = async (score: number) => {
    if (score >= 8) await awardXp(100);
    setPhase('complete');
  };

  if (activeVideo) {
    return (
      <LessonVideoPlayer
        sign={activeVideo}
        onComplete={() => { markWatched(activeVideo.id); setActiveVideo(null); }}
        onBack={() => setActiveVideo(null)}
        lessonName="Animals"
      />
    );
  }

  if (phase === 'quiz') {
    return <AnimalQuiz onComplete={handleQuizComplete} />;
  }

  if (phase === 'complete') {
    return <LessonComplete onBack={() => (navigation as any).goBack()} onRestart={() => {
      setAnimalsQuizIndex(0);
      setAnimalsQuizScore(0);
      setAnimalsQuizCompleted(false);
      setPhase('quiz');
    }} />;
  }

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.container} 
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <TouchableOpacity style={styles.backBtn} onPress={() => (navigation as any).goBack()}>
        <Text style={styles.backBtnText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Lesson 3: Animals</Text>

      {/* Progress bar */}
      <View style={styles.progressWrap}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` as any }]} />
      </View>
      <View style={styles.progRow}>
        <Text style={styles.progText}>{completedCount} / {SIGNS.length} animals watched</Text>
        <Text style={styles.progText}>+50 XP each</Text>
      </View>

      {/* Sign cards */}
      {SIGNS.map((sign) => (
        <TouchableOpacity
          key={sign.id}
          style={[styles.signCard, animalsWatched[sign.id] && styles.signCardDone]}
          onPress={() => setActiveVideo(sign)}
          accessibilityRole="button"
        >
          <Text style={styles.signEmoji}>{sign.emoji}</Text>
          <View style={styles.signInfo}>
            <View style={styles.signLabelRow}>
              <Text style={styles.signLabel}>{sign.label}</Text>
              <View style={[styles.badge, animalsWatched[sign.id] ? styles.badgeDone : styles.badgeNext]}>
                <Text style={[styles.badgeText, animalsWatched[sign.id] ? styles.badgeTextDone : styles.badgeTextNext]}>
                  {animalsWatched[sign.id] ? 'Done ✓' : 'Watch'}
                </Text>
              </View>
            </View>
            <Text style={styles.signDesc}>{sign.description}</Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Continue button */}
      <TouchableOpacity
        style={[styles.continueBtn, !allWatched && styles.continueBtnDisabled]}
        onPress={() => setPhase('quiz')}
        disabled={!allWatched}
        accessibilityRole="button"
      >
        <Text style={styles.continueBtnText}>
          {allWatched ? 'Continue to Quiz →' : `Watch all animals to continue (${completedCount}/${SIGNS.length})`}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function LessonComplete({ onBack, onRestart }: { onBack: () => void; onRestart: () => void }) {
  const { user } = useAuth();
  return (
    <View style={styles.completeContainer}>
      <Text style={styles.completeTitle}>Lesson Complete! 🎉</Text>
      <View style={styles.completeCard}>
        <Text style={styles.completeCardTitle}>You earned:</Text>
        <Text style={styles.completeReward}>⭐  +250 XP total</Text>
        <Text style={styles.completeReward}>🔥  Streak maintained</Text>
        <View style={styles.divider} />
        <Text style={styles.completeSub}>Animals learned:</Text>
        <Text style={styles.completeSigns}>🐱 Cat  •  🐶 Dog  •  🐠 Fish  •  🐰 Rabbit</Text>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.nextBtn} onPress={onBack}>
          <Text style={styles.nextBtnText}>Back to Lessons →</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.restartBtn} onPress={onRestart}>
          <Text style={styles.restartBtnText}>Retake Quiz</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: { 
    flex: 1, 
    backgroundColor: '#23254b'
  },
  container: { 
    flexGrow: 1,
    padding: 20, 
    paddingBottom: 40, 
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: '#23254b' 
  },
  backBtn: { 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 8, 
    backgroundColor: '#3a3d6e',
    marginBottom: 16,
  },
  backBtnText: { color: '#6fb0ff', fontSize: 13, fontWeight: '600' },
  title: { color: '#fff', fontSize: 26, fontWeight: '700', textAlign: 'center', marginBottom: 16 },
  progressWrap: { height: 6, borderRadius: 4, backgroundColor: '#3a3d6e', overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: 6, backgroundColor: '#6fb0ff', borderRadius: 4 },
  progRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
  progText: { color: '#9fb0ff', fontSize: 12 },
  signCard: { flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 2, borderColor: '#6fb0ff', borderRadius: 14, padding: 14, marginBottom: 12, backgroundColor: '#1d1f3d' },
  signCardDone: { borderColor: '#3fc98e' },
  signEmoji: { fontSize: 26, width: 44, textAlign: 'center' },
  signInfo: { flex: 1 },
  signLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  signLabel: { color: '#fff', fontSize: 15, fontWeight: '600' },
  signDesc: { color: '#9fb0ff', fontSize: 12, marginTop: 4 },
  badge: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 20 },
  badgeNext: { backgroundColor: '#1e2a5a' },
  badgeDone: { backgroundColor: '#0e3d27' },
  badgeText: { fontSize: 11, fontWeight: '600' },
  badgeTextNext: { color: '#7fe9ff' },
  badgeTextDone: { color: '#3fc98e' },
  continueBtn: {
    marginTop: 24,
    backgroundColor: '#6fb0ff',
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: 'center',
  },
  continueBtnDisabled: { backgroundColor: '#3a3d6e' },
  continueBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  completeContainer: { flex: 1, backgroundColor: '#23254b', padding: 24, justifyContent: 'center' },
  completeTitle: { color: '#fff', fontSize: 32, fontWeight: '700', textAlign: 'center', marginBottom: 28 },
  completeCard: { borderWidth: 2, borderColor: '#6fb0ff', borderRadius: 18, padding: 22, backgroundColor: '#1d1f3d', marginBottom: 28 },
  completeCardTitle: { color: '#9fb0ff', fontSize: 14, marginBottom: 12 },
  completeReward: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 8 },
  divider: { height: 1, backgroundColor: '#3a3d6e', marginVertical: 14 },
  completeSub: { color: '#9fb0ff', fontSize: 13, marginBottom: 6 },
  completeSigns: { color: '#fff', fontSize: 14, lineHeight: 22 },
  buttonRow: { flexDirection: 'row', gap: 12 },
  nextBtn: { flex: 1, backgroundColor: '#6fb0ff', borderRadius: 28, paddingVertical: 14, alignItems: 'center' },
  nextBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  restartBtn: { flex: 1, backgroundColor: '#3a3d6e', borderWidth: 2, borderColor: '#6fb0ff', borderRadius: 28, paddingVertical: 14, alignItems: 'center' },
  restartBtnText: { color: '#6fb0ff', fontSize: 16, fontWeight: '700' },
});
