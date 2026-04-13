import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useLessonProgress } from '../../context/LessonProgressContext';
import LessonVideoPlayer, { Sign } from './LessonVideoPlay';
import FeelingsQuiz from './FeelingsQuiz';

const SIGNS: Sign[] = [
  { 
    id: 0, 
    label: 'Happy', 
    emoji: '😊', 
    description: 'Move hands upward on chest with a smile',
    videoUri: require('../../../videos/happy.mp4'),
    tips: [
      '• Both hands move upward on the chest area',
      '• Smile widely to show the happy emotion',
      '• Movement should be smooth and upward',
    ]
  },
  { 
    id: 1, 
    label: 'Sad', 
    emoji: '😢', 
    description: 'Move hands downward on face with a frown',
    videoUri: require('../../../videos/sad.mp4'),
    tips: [
      '• Both hands move downward from the eyes/face',
      '• Frown to show sadness',
      '• Slower, more contemplative movement',
    ]
  },
  { 
    id: 2, 
    label: 'Angry', 
    emoji: '😠', 
    description: 'Fierce expression with tense hand movements',
    videoUri: require('../../../videos/angry.mp4'),
    tips: [
      '• Show a fierce, angry facial expression',
      '• Hands show tension and sharp movements',
      '• Demonstrate strong emotional intensity',
    ]
  },
  { 
    id: 3, 
    label: 'Excited', 
    emoji: '🤩', 
    description: 'Energetic upward movements with happy expression',
    videoUri: require('../../../videos/excited.mp4'),
    tips: [
      '• Energetic, upward hand movements',
      '• Wide, happy facial expression',
      '• Quick, enthusiastic motion',
    ]
  },
];

type Phase = 'learn' | 'quiz' | 'complete';

export default function FeelingsLesson() {
  const { awardXp } = useAuth();
  const navigation = useNavigation();
  const { feelingsWatched, setFeelingsWatched, feelingsQuizCompleted, setFeelingsQuizIndex, setFeelingsQuizScore, setFeelingsQuizCompleted } = useLessonProgress();
  const [phase, setPhase] = useState<Phase>('learn');
  const [activeVideo, setActiveVideo] = useState<Sign | null>(null);

  // Reset quiz state if it was previously completed (for fresh retakes on re-entry)
  React.useEffect(() => {
    if (feelingsQuizCompleted) {
      setFeelingsQuizIndex(0);
      setFeelingsQuizScore(0);
      setFeelingsQuizCompleted(false);
    }
  }, []);

  const markWatched = async (id: number) => {
    if (feelingsWatched[id]) return;
    const updated = [...feelingsWatched];
    updated[id] = true;
    setFeelingsWatched(updated);
    await awardXp(50);
  };

  const completedCount = feelingsWatched.filter(Boolean).length;
  const progressPercent = Math.round((completedCount / SIGNS.length) * 100);
  const allWatched = completedCount === SIGNS.length;

  const handleQuizComplete = async (score: number) => {
    if (score >= 6) await awardXp(100);
    setPhase('complete');
  };

  if (activeVideo) {
    return (
      <LessonVideoPlayer
        sign={activeVideo}
        onComplete={() => { markWatched(activeVideo.id); setActiveVideo(null); }}
        onBack={() => setActiveVideo(null)}
        lessonName="Feelings"
      />
    );
  }

  if (phase === 'quiz') {
    return <FeelingsQuiz onComplete={handleQuizComplete} />;
  }

  if (phase === 'complete') {
    return <LessonComplete onBack={() => (navigation as any).goBack()} onRestart={() => {
      setFeelingsQuizIndex(0);
      setFeelingsQuizScore(0);
      setFeelingsQuizCompleted(false);
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
      <Text style={styles.title}>Lesson 4: Feelings</Text>

      {/* Progress bar */}
      <View style={styles.progressWrap}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` as any }]} />
      </View>
      <View style={styles.progRow}>
        <Text style={styles.progText}>{completedCount} / {SIGNS.length} feelings watched</Text>
        <Text style={styles.progText}>+50 XP each</Text>
      </View>

      {/* Sign cards */}
      {SIGNS.map((sign) => (
        <TouchableOpacity
          key={sign.id}
          style={[styles.signCard, feelingsWatched[sign.id] && styles.signCardDone]}
          onPress={() => setActiveVideo(sign)}
          accessibilityRole="button"
        >
          <Text style={styles.signEmoji}>{sign.emoji}</Text>
          <View style={styles.signInfo}>
            <View style={styles.signLabelRow}>
              <Text style={styles.signLabel}>{sign.label}</Text>
              <View style={[styles.badge, feelingsWatched[sign.id] ? styles.badgeDone : styles.badgeNext]}>
                <Text style={[styles.badgeText, feelingsWatched[sign.id] ? styles.badgeTextDone : styles.badgeTextNext]}>
                  {feelingsWatched[sign.id] ? 'Done ✓' : 'Watch'}
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
          {allWatched ? 'Continue to Quiz →' : `Watch all feelings to continue (${completedCount}/${SIGNS.length})`}
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
        <Text style={styles.completeReward}>⭐  +150 XP total</Text>
        <Text style={styles.completeReward}>🔥  Streak maintained</Text>
        <View style={styles.divider} />
        <Text style={styles.completeSub}>Feelings learned:</Text>
        <Text style={styles.completeSigns}>😊 Happy  •  😢 Sad  •  😠 Angry  •  🤩 Excited</Text>
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
