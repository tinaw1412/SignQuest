import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useLessonProgress } from '../../context/LessonProgressContext';
import LessonVideoPlayer, { Sign } from './GreetingsVideoPlayer';
import ColorQuiz from './ColorQuiz';

const SIGNS: Sign[] = [
  { 
    id: 0, 
    label: 'Red', 
    emoji: '🔴', 
    description: 'Index finger downward near lips, like a "shh" sign',
    videoUri: require('../../../videos/red.mp4'),
    tips: [
      '• Raise index finger near the lips',
      '• Move downward in a shushing motion',
      '• Keep other fingers curled',
    ]
  },
  { 
    id: 1, 
    label: 'Blue', 
    emoji: '🔵', 
    description: 'Twist the hand with "B" handshape (fingers together)',
    videoUri: require('../../../videos/blue.mp4'),
    tips: [
      '• Hold "B" handshape with all fingers together',
      '• Make a twisting motion at the wrist',
      '• Repeat the motion smoothly',
    ]
  },
  { 
    id: 2, 
    label: 'Yellow', 
    emoji: '💛', 
    description: 'Twist the hand with "Y" handshape',
    videoUri: require('../../../videos/yellow.mp4'),
    tips: [
      '• Hold "Y" handshape (thumb and pinky extended)',
      '• Make a twisting motion at the wrist',
      '• Keep other fingers folded',
    ]
  },
  { 
    id: 3, 
    label: 'White', 
    emoji: '⚪', 
    description: 'Pull hand down with fingers spread',
    videoUri: require('../../../videos/white.mp4'),
    tips: [
      '• Start with open hand near the body',
      '• Pull downward with fingers spread wide',
      '• Mimic pulling white away',
    ]
  },
  { 
    id: 4, 
    label: 'Black', 
    emoji: '⚫', 
    description: 'Draw index finger across the forehead',
    videoUri: require('../../../videos/black.mp4'),
    tips: [
      '• Use only the index finger at forehead',
      '• Draw across from one side to the other',
      '• Keep other fingers curled',
    ]
  },
];

type Phase = 'learn' | 'quiz' | 'complete';

export default function ColorLesson() {
  const { awardXp } = useAuth();
  const navigation = useNavigation();
  const { colorsWatched, setColorsWatched, colorsQuizCompleted, setColorsQuizIndex, setColorsQuizScore, setColorsQuizCompleted } = useLessonProgress();
  const [phase, setPhase] = useState<Phase>('learn');
  const [activeVideo, setActiveVideo] = useState<Sign | null>(null);

  // Reset quiz state if it was previously completed (for fresh retakes on re-entry)
  React.useEffect(() => {
    if (colorsQuizCompleted) {
      setColorsQuizIndex(0);
      setColorsQuizScore(0);
      setColorsQuizCompleted(false);
    }
  }, []);

  const markWatched = async (id: number) => {
    if (colorsWatched[id]) return;
    const updated = [...colorsWatched];
    updated[id] = true;
    setColorsWatched(updated);
    await awardXp(50);
  };

  const completedCount = colorsWatched.filter(Boolean).length;
  const progressPercent = Math.round((completedCount / SIGNS.length) * 100);
  const allWatched = completedCount === SIGNS.length;

  const handleQuizComplete = async (score: number) => {
    if (score >= 7) await awardXp(100);
    setPhase('complete');
  };

  if (activeVideo) {
    return (
      <LessonVideoPlayer
        sign={activeVideo}
        onComplete={() => { markWatched(activeVideo.id); setActiveVideo(null); }}
        onBack={() => setActiveVideo(null)}
        lessonName="Colors"
      />
    );
  }

  if (phase === 'quiz') {
    return <ColorQuiz onComplete={handleQuizComplete} />;
  }

  if (phase === 'complete') {
    return <LessonComplete onBack={() => (navigation as any).goBack()} onRestart={() => {
      setColorsQuizIndex(0);
      setColorsQuizScore(0);
      setColorsQuizCompleted(false);
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
      <Text style={styles.title}>Lesson 2: Colors</Text>

      {/* Progress bar */}
      <View style={styles.progressWrap}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` as any }]} />
      </View>
      <View style={styles.progRow}>
        <Text style={styles.progText}>{completedCount} / {SIGNS.length} colors watched</Text>
        <Text style={styles.progText}>+50 XP each</Text>
      </View>

      {/* Sign cards */}
      {SIGNS.map((sign) => (
        <TouchableOpacity
          key={sign.id}
          style={[styles.signCard, colorsWatched[sign.id] && styles.signCardDone]}
          onPress={() => setActiveVideo(sign)}
          accessibilityRole="button"
        >
          <Text style={styles.signEmoji}>{sign.emoji}</Text>
          <View style={styles.signInfo}>
            <View style={styles.signLabelRow}>
              <Text style={styles.signLabel}>{sign.label}</Text>
              <View style={[styles.badge, colorsWatched[sign.id] ? styles.badgeDone : styles.badgeNext]}>
                <Text style={[styles.badgeText, colorsWatched[sign.id] ? styles.badgeTextDone : styles.badgeTextNext]}>
                  {colorsWatched[sign.id] ? 'Done ✓' : 'Watch'}
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
          {allWatched ? 'Continue to Quiz →' : `Watch all colors to continue (${completedCount}/${SIGNS.length})`}
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
        <Text style={styles.completeSub}>Colors learned:</Text>
        <Text style={styles.completeSigns}>🔴 Red  •  🔵 Blue  •  💛 Yellow  •  ⚪ White  •  ⚫ Black</Text>
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
