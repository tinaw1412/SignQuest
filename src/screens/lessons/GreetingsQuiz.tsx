import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, ScrollView, TextInput
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useAuth } from '../../context/AuthContext';
import { useLessonProgress } from '../../context/LessonProgressContext';
import { useNavigation } from '@react-navigation/native';

const VIDEOS = {
  hello: require('../../../videos/hello.mp4'),
  nicetomeetyou: require('../../../videos/nicetomeetyou.mp4'),
  seeyoulater: require('../../../videos/seeyoulater.mp4'),
};

type QuestionType =
  | 'video-to-definition'   // watch video → pick correct meaning
  | 'definition-to-video'   // read definition → pick correct video
  | 'fill-in-blank'         // sentence with blank → pick correct sign video
  | 'match-sign'            // watch video → type the sign name
  | 'multi-video-pick'      // play all videos → pick the one matching a word
  | 'scenario-video';       // read scenario → pick correct sign video

type VideoKey = keyof typeof VIDEOS;

type Option = {
  videoKey?: VideoKey;
  label?: string;
  correct: boolean;
};

type Question = {
  id: number;
  type: QuestionType;
  prompt: string;
  sentence?: string;       
  videoKey?: VideoKey;     
  options: Option[];
  explanation: string;
};

const QUESTIONS: Question[] = [
  {
    id: 0,
    type: 'video-to-definition',
    prompt: 'What does this sign mean?',
    videoKey: 'hello',
    options: [
      { label: 'Hello', correct: true },
      { label: 'See you later', correct: false },
      { label: 'Nice to meet you', correct: false },
    ],
    explanation: 'That open-hand wave means "Hello" — the most common ASL greeting.',
  },
  {
    id: 1,
    type: 'fill-in-blank',
    prompt: 'Watch each sign and complete the sentence.',
    sentence: '"___! My name is Alex."',
    options: [
      { videoKey: 'hello', correct: true },
      { videoKey: 'nicetomeetyou', correct: false },
      { videoKey: 'seeyoulater', correct: false },
    ],
    explanation: '"Hello!" is the correct opener before introducing yourself.',
  },
  {
    id: 2,
    type: 'multi-video-pick',
    prompt: 'Play each video. Which sign means "Hello"?',
    options: [
      { videoKey: 'hello', correct: true },
      { videoKey: 'nicetomeetyou', correct: false },
      { videoKey: 'seeyoulater', correct: false },
    ],
    explanation: '"Hello" is the standard greeting with an open-hand wave.',
  },
  {
    id: 3,
    type: 'video-to-definition',
    prompt: 'What does this sign mean?',
    videoKey: 'nicetomeetyou',
    options: [
      { label: 'Hello', correct: false },
      { label: 'Nice to meet you', correct: true },
      { label: 'See you later', correct: false },
    ],
    explanation: 'Both flat hands rotating at chest level = "Nice to meet you."',
  },
  {
    id: 4,
    type: 'definition-to-video',
    prompt: 'Which video shows "Nice to meet you"?',
    options: [
      { videoKey: 'hello', correct: false },
      { videoKey: 'nicetomeetyou', correct: true },
      { videoKey: 'seeyoulater', correct: false },
    ],
    explanation: 'Nice to meet you uses both flat hands rotating toward each other.',
  },
  {
    id: 5,
    type: 'scenario-video',
    prompt: 'You\'re meeting someone for the first time. Which sign do you use after introductions?',
    options: [
      { videoKey: 'hello', correct: false },
      { videoKey: 'nicetomeetyou', correct: true },
      { videoKey: 'seeyoulater', correct: false },
    ],
    explanation: '"Nice to meet you" is the polite response after a first introduction.',
  },
  {
    id: 6,
    type: 'video-to-definition',
    prompt: 'What does this sign mean?',
    videoKey: 'seeyoulater',
    options: [
      { label: 'Hello', correct: false },
      { label: 'Nice to meet you', correct: false },
      { label: 'See you later', correct: true },
    ],
    explanation: 'The "L" handshape moving forward from the chin means "See you later."',
  },
  {
    id: 7,
    type: 'fill-in-blank',
    prompt: 'Watch each sign and complete the sentence.',
    sentence: '"It was great talking. ___!"',
    options: [
      { videoKey: 'hello', correct: false },
      { videoKey: 'nicetomeetyou', correct: false },
      { videoKey: 'seeyoulater', correct: true },
    ],
    explanation: '"See you later!" is used at the end of a conversation.',
  },
  {
    id: 8,
    type: 'multi-video-pick',
    prompt: 'Play each video. Which sign means "See you later"?',
    options: [
      { videoKey: 'hello', correct: false },
      { videoKey: 'nicetomeetyou', correct: false },
      { videoKey: 'seeyoulater', correct: true },
    ],
    explanation: '"See you later" uses an "L" handshape, distinctive in ASL.',
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
  label,
}: {
  videoKey: VideoKey;
  selected: boolean;
  correct: boolean;
  wrong: boolean;
  dim: boolean;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
  label?: string;
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
          {label && <Text style={styles.videoTileLabel}>{label}</Text>}
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

export default function GreetingsQuiz({ onComplete, onBack }: Props) {
  const navigation = useNavigation();
  const { greetingsQuizIndex, setGreetingsQuizIndex, greetingsQuizScore, setGreetingsQuizScore, greetingsQuizCompleted, setGreetingsQuizCompleted } = useLessonProgress();
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const qIndex = greetingsQuizIndex;
  const score = greetingsQuizScore;

  const q = QUESTIONS[qIndex];
  const isCorrect = selected !== null && q.options[selected].correct;

  const handleSelect = (i: number) => {
    if (showFeedback) return;
    setSelected(i);
    setShowFeedback(true);
    if (q.options[i].correct) setGreetingsQuizScore(score + 1);
  };

  const handleNext = () => {
    const newScore = score; // already updated
    if (qIndex + 1 >= QUESTIONS.length) {
      if (!greetingsQuizCompleted) {
        setGreetingsQuizCompleted(true);
      }
      onComplete(newScore);
    } else {
      setGreetingsQuizIndex(qIndex + 1);
      setSelected(null);
      setShowFeedback(false);
    }
  };

  const renderOptions = () => {
    const { type, options } = q;

    // Text options (video-to-definition)
    if (type === 'video-to-definition') {
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
                <Text style={[
                  styles.listCardLabel,
                  showCorrect && styles.labelCorrect,
                  showWrong && styles.labelWrong,
                ]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }

    // Video grid options (definition-to-video, fill-in-blank, multi-video-pick, scenario-video)
    const gridSize = options.length === 2 ? 'large' : options.length === 3 ? 'medium' : 'small';
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
              size={gridSize}
            />
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Progress dots */}
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
        {/* Question type label */}
        <Text style={styles.typeLabel}>
          {q.type === 'video-to-definition' && '🎬 What does this sign mean?'}
          {q.type === 'definition-to-video' && '👁 Pick the correct sign'}
          {q.type === 'fill-in-blank' && '✏️ Fill in the blank'}
          {q.type === 'multi-video-pick' && '🔍 Find the sign'}
          {q.type === 'scenario-video' && '💬 Real-world scenario'}
          {q.type === 'match-sign' && '🔗 Match the sign'}
          {q.type === 'scenario-video' && ''}
        </Text>

        {/* Sentence (fill-in-blank) */}
        {q.sentence && (
          <View style={styles.sentenceBox}>
            <Text style={styles.sentenceText}>{q.sentence}</Text>
          </View>
        )}

        {/* Prompt */}
        <Text style={styles.prompt}>{q.prompt}</Text>

        {/* Large question video */}
        {q.videoKey && (
          <QuestionVideo videoKey={q.videoKey} />
        )}

        {/* Options */}
        {renderOptions()}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Feedback bar */}
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
  scrollContent: { paddingHorizontal: 20, paddingTop: 8 },
  typeLabel: {
    color: '#9fb0ff',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  sentenceBox: {
    backgroundColor: '#1d1f3d',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#6fb0ff',
  },
  sentenceText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    fontStyle: 'italic',
    lineHeight: 26,
  },
  prompt: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 24,
    marginBottom: 16,
  },
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
  // Video tile (answer option)
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
  videoTileLabel: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
    backgroundColor: '#00000088',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
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
  // Select button
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
  // Grids
  videoRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  videoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between', marginBottom: 8 },
  // Text list options
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
  // Feedback bar
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
});