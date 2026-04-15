import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, ScrollView
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useLessonProgress } from '../../context/LessonProgressContext';
import { useNavigation } from '@react-navigation/native';

const VIDEOS = {
  happy: require('../../../videos/happy.mp4'),
  sad: require('../../../videos/sad.mp4'),
  angry: require('../../../videos/angry.mp4'),
  excited: require('../../../videos/excited.mp4'),
};

type VideoKey = keyof typeof VIDEOS;

type Option = {
  videoKey?: VideoKey;
  label?: string;
  correct: boolean;
};

type Question = {
  id: number;
  prompt: string;
  sentence?: string;
  videoKey?: VideoKey;
  options: Option[];
  explanation: string;
};

const QUESTIONS: Question[] = [
  {
    id: 0,
    prompt: 'Which feeling does this sign represent?',
    videoKey: 'happy',
    options: [
      { label: 'Happy', correct: true },
      { label: 'Sad', correct: false },
      { label: 'Excited', correct: false },
    ],
    explanation: 'Happy is signed by moving both hands upward on the chest with a smile.',
  },
  {
    id: 1,
    prompt: 'Which video shows the sign for "sad"?',
    options: [
      { videoKey: 'sad', correct: true },
      { videoKey: 'happy', correct: false },
      { videoKey: 'excited', correct: false },
    ],
    explanation: 'Sad is signed by moving hands downward on the face with a frown.',
  },
  {
    id: 2,
    prompt: 'Which feeling does this sign represent?',
    videoKey: 'angry',
    options: [
      { label: 'Angry', correct: true },
      { label: 'Happy', correct: false },
      { label: 'Sad', correct: false },
    ],
    explanation: 'Angry is signed by a fierce expression with hands showing tension.',
  },
  {
    id: 3,
    prompt: 'Which video shows the sign for "excited"?',
    options: [
      { videoKey: 'excited', correct: true },
      { videoKey: 'angry', correct: false },
      { videoKey: 'sad', correct: false },
    ],
    explanation: 'Excited is signed with energetic upward hand movements and a happy expression.',
  },
  {
    id: 4,
    prompt: 'Complete: "I am very ___"',
    sentence: '"I am very ___"',
    options: [
      { videoKey: 'happy', correct: true },
      { videoKey: 'angry', correct: false },
      { videoKey: 'sad', correct: false },
    ],
    explanation: 'Being very happy is a positive emotion you might commonly express.',
  },
  {
    id: 5,
    prompt: 'Which feeling does this sign represent?',
    videoKey: 'sad',
    options: [
      { label: 'Sad', correct: true },
      { label: 'Excited', correct: false },
      { label: 'Angry', correct: false },
    ],
    explanation: 'Sad is shown through downward hand movements and a sad facial expression.',
  },
  {
    id: 6,
    prompt: 'Which video shows the sign for "angry"?',
    options: [
      { videoKey: 'angry', correct: true },
      { videoKey: 'happy', correct: false },
      { videoKey: 'excited', correct: false },
    ],
    explanation: 'Angry is signed with strong, tense hand movements and an angry expression.',
  },
  {
    id: 7,
    prompt: 'Complete: "I am ___ about the game!"',
    sentence: '"I am ___ about the game!"',
    options: [
      { videoKey: 'excited', correct: true },
      { videoKey: 'sad', correct: false },
      { videoKey: 'angry', correct: false },
    ],
    explanation: 'Being excited about a game shows enthusiasm and joy.',
  },
];

function VideoTile({
  videoKey,
  selected,
  correct,
  wrong,
  dim,
  onPress,
  size = 'medium',
}: {
  videoKey: VideoKey;
  selected: boolean;
  correct: boolean;
  wrong: boolean;
  dim: boolean;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
}) {
  const player = useVideoPlayer(VIDEOS[videoKey], (p) => {
    p.loop = true;
    p.muted = false;
  });
  const [playing, setPlaying] = useState(false);

  const handleVideoPress = () => {
    if (playing) {
      player.pause();
      setPlaying(false);
    } else {
      player.play();
      setPlaying(true);
    }
  };

  const height = size === 'large' ? 200 : size === 'small' ? 100 : 140;
  const feelingName = videoKey.charAt(0).toUpperCase() + videoKey.slice(1);

  let borderColor = '#3a3d6e';
  if (correct) borderColor = '#3fc98e';
  else if (wrong) borderColor = '#e24b4a';
  else if (selected) borderColor = '#6fb0ff';

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.videoTile,
          { borderColor, height, opacity: dim ? 0.4 : 1 },
        ]}
        onPress={handleVideoPress}
        activeOpacity={0.8}
      >
        <VideoView
          player={player}
          style={styles.videoTileInner}
          contentFit="cover"
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          nativeControls={false}
        />
        <View style={styles.videoOverlay}>
          <View style={[styles.playBadge, playing && styles.playBadgePlaying]}>
            <Text style={styles.playIcon}>{playing ? '⏸' : '▶'}</Text>
          </View>
        </View>
        {correct && <View style={styles.correctBadge}><Text style={styles.correctBadgeText}>✓</Text></View>}
        {wrong && <View style={styles.wrongBadge}><Text style={styles.wrongBadgeText}>✗</Text></View>}
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.selectBtn,
          selected && !correct && !wrong && styles.selectBtnSelected,
          correct && styles.selectBtnCorrect,
          wrong && styles.selectBtnWrong,
          dim && styles.selectBtnDim,
        ]}
        onPress={onPress}
        disabled={dim}
      >
        <Text style={[
          styles.selectBtnText,
          (correct || wrong) && styles.selectBtnTextSelection,
        ]}>
          {correct ? '✓ Correct' : wrong ? '✗ Incorrect' : 'Select'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function QuestionVideo({ videoKey }: { videoKey: VideoKey }) {
  const player = useVideoPlayer(VIDEOS[videoKey], (p) => {
    p.loop = true;
    p.play();
  });
  const [playing, setPlaying] = useState(true);

  return (
    <TouchableOpacity
      style={styles.questionVideoBox}
      onPress={() => { playing ? player.pause() : player.play(); setPlaying(!playing); }}
      activeOpacity={0.9}
    >
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="contain"
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        nativeControls={false}
      />
      <View style={styles.questionVideoOverlay}>
        <View style={[styles.playBadge, playing && styles.playBadgePlaying]}>
          <Text style={styles.playIcon}>{playing ? '⏸' : '▶'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

interface Props {
  onComplete: (score: number) => void;
  onBack?: () => void;
}

export default function FeelingsQuiz({ onComplete, onBack }: Props) {
  const navigation = useNavigation();
  const { feelingsQuizIndex, setFeelingsQuizIndex, feelingsQuizScore, setFeelingsQuizScore, feelingsQuizCompleted, setFeelingsQuizCompleted } = useLessonProgress();
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const qIndex = feelingsQuizIndex;
  const score = feelingsQuizScore;

  const q = QUESTIONS[qIndex];
  const isCorrect = selected !== null && q.options[selected].correct;

  const handleSelect = (i: number) => {
    if (showFeedback) return;
    setSelected(i);
    setShowFeedback(true);
    if (q.options[i].correct) setFeelingsQuizScore(score + 1);
  };

  const handleNext = () => {
    if (qIndex + 1 >= QUESTIONS.length) {
      if (!feelingsQuizCompleted) {
        setFeelingsQuizCompleted(true);
      }
      onComplete(score);
    } else {
      setFeelingsQuizIndex(qIndex + 1);
      setSelected(null);
      setShowFeedback(false);
    }
  };

  const renderOptions = () => {
    const options = q.options;

    if (q.options[0].label) {
      return (
        <View style={styles.listGrid}>
          {options.map((opt, i) => {
            const isSelected = i === selected;
            const showCorrect = showFeedback && opt.correct;
            const showWrong = showFeedback && isSelected && !opt.correct;
            return (
              <TouchableOpacity
                key={i}
                style={[
                  styles.listCard,
                  isSelected && !showFeedback && styles.listCardSelected,
                  showCorrect && styles.listCardCorrect,
                  showWrong && styles.listCardWrong,
                  showFeedback && !opt.correct && !isSelected && styles.listCardDim,
                ]}
                onPress={() => handleSelect(i)}
                disabled={showFeedback}
                activeOpacity={0.75}
              >
                <Text style={[styles.listCardLabel, showCorrect && styles.labelCorrect, showWrong && styles.labelWrong]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }

    const isRow = options.length <= 3;
    return (
      <View style={isRow ? styles.videoRow : styles.videoGrid}>
        {options.map((opt, i) => (
          <View key={i} style={isRow ? { flex: 1 } : { width: '48%' }}>
            <VideoTile
              videoKey={opt.videoKey!}
              selected={i === selected}
              correct={showFeedback && opt.correct}
              wrong={showFeedback && i === selected && !opt.correct}
              dim={showFeedback && !opt.correct && i !== selected}
              onPress={() => handleSelect(i)}
              size={isRow ? 'medium' : 'small'}
            />
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBack || (() => navigation.goBack())}
        >
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.dotsRow}>
          {QUESTIONS.map((_, i) => (
            <View key={i} style={[
              styles.dot,
              i < qIndex ? styles.dotDone : i === qIndex ? styles.dotActive : styles.dotEmpty,
            ]} />
          ))}
        </View>
        <Text style={styles.counter}>{qIndex + 1}/{QUESTIONS.length}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.prompt}>{q.prompt}</Text>

        {q.videoKey && <QuestionVideo videoKey={q.videoKey} />}

        {q.sentence && (
          <View style={styles.sentenceBox}>
            <Text style={styles.sentenceText}>{q.sentence}</Text>
          </View>
        )}

        {renderOptions()}

        <View style={{ height: 120 }} />
      </ScrollView>

      {showFeedback && (
        <View style={[styles.feedbackBar, isCorrect ? styles.feedbackCorrect : styles.feedbackWrong]}>
          <View style={styles.feedbackLeft}>
            <Text style={[styles.feedbackTitle, isCorrect ? styles.feedbackTitleOk : styles.feedbackTitleBad]}>
              {isCorrect ? '✓ Correct!' : '✗ Not quite'}
            </Text>
            <Text style={[styles.feedbackSub, isCorrect ? styles.feedbackSubOk : styles.feedbackSubBad]}>
              {q.explanation}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.nextBtn, isCorrect ? styles.nextBtnOk : styles.nextBtnBad]}
            onPress={handleNext}
          >
            <Text style={styles.nextBtnText}>
              {qIndex + 1 >= QUESTIONS.length ? 'Finish' : 'Next →'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#23254b' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 10,
  },
  backBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#3a3d6e',
  },
  backBtnText: {
    color: '#6fb0ff',
    fontSize: 13,
    fontWeight: '600',
  },
  dotsRow: { flex: 1, flexDirection: 'row', gap: 4 },
  dot: { flex: 1, height: 5, borderRadius: 3 },
  dotDone: { backgroundColor: '#6fb0ff' },
  dotActive: { backgroundColor: '#fff' },
  dotEmpty: { backgroundColor: '#3a3d6e' },
  counter: { color: '#9fb0ff', fontSize: 12, minWidth: 36, textAlign: 'right' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16 },
  prompt: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 24,
    marginBottom: 16,
  },
  sentenceBox: {
    backgroundColor: '#1d1f3d',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#6fb0ff',
  },
  sentenceText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  videoTile: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#111328',
    borderWidth: 2,
    position: 'relative',
  },
  videoTileInner: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBadge: {
    backgroundColor: '#00000099',
    borderRadius: 30,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#ffffff55',
  },
  playBadgePlaying: {
    backgroundColor: '#6fb0ffaa',
    borderColor: '#6fb0ff',
  },
  playIcon: { color: '#fff', fontSize: 14 },
  correctBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#3fc98e',
    borderRadius: 14,
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  correctBadgeText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  wrongBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#e24b4a',
    borderRadius: 14,
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrongBadgeText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  selectBtn: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#3a3d6e',
    borderWidth: 1.5,
    borderColor: '#6fb0ff',
    alignItems: 'center',
  },
  selectBtnSelected: {
    backgroundColor: '#1e2a5a',
    borderColor: '#6fb0ff',
  },
  selectBtnCorrect: {
    backgroundColor: '#0d2e1e',
    borderColor: '#3fc98e',
  },
  selectBtnWrong: {
    backgroundColor: '#2e0d0d',
    borderColor: '#e24b4a',
  },
  selectBtnDim: {
    opacity: 0.4,
  },
  selectBtnText: {
    color: '#6fb0ff',
    fontSize: 13,
    fontWeight: '600',
  },
  selectBtnTextSelection: {
    fontWeight: '700',
  },
  videoRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  videoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between', marginBottom: 8 },
  listGrid: { gap: 10 },
  listCard: {
    borderWidth: 2,
    borderColor: '#3a3d6e',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: '#1d1f3d',
  },
  listCardSelected: { borderColor: '#6fb0ff', backgroundColor: '#1e2a5a' },
  listCardCorrect: { borderColor: '#3fc98e', backgroundColor: '#0d2e1e' },
  listCardWrong: { borderColor: '#e24b4a', backgroundColor: '#2e0d0d' },
  listCardDim: { opacity: 0.4 },
  listCardLabel: { color: '#fff', fontSize: 16, fontWeight: '500' },
  labelCorrect: { color: '#3fc98e' },
  labelWrong: { color: '#e24b4a' },
  feedbackBar: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  feedbackCorrect: { backgroundColor: '#0d2e1e' },
  feedbackWrong: { backgroundColor: '#2e0d0d' },
  feedbackLeft: { flex: 1 },
  feedbackTitle: { fontSize: 16, fontWeight: '700', marginBottom: 3 },
  feedbackTitleOk: { color: '#3fc98e' },
  feedbackTitleBad: { color: '#e24b4a' },
  feedbackSub: { fontSize: 13, lineHeight: 18 },
  feedbackSubOk: { color: '#3fc98e' },
  feedbackSubBad: { color: '#e24b4a' },
  nextBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  nextBtnOk: { backgroundColor: '#3fc98e' },
  nextBtnBad: { backgroundColor: '#e24b4a' },
  nextBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  // Large question video
  questionVideoBox: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#111328',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#3a3d6e',
  },
  questionVideoOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
