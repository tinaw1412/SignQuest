import React, { useState, useCallback, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, ScrollView,
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useAuth } from '../../context/AuthContext';
import { useLessonProgress } from '../../context/LessonProgressContext';
import { useNavigation } from '@react-navigation/native';

// ─── Video assets ────────────────────────────────────────────────────────────
const VIDEOS = {
  // Greetings
  hello: require('../../../videos/hello.mp4'),
  nicetomeetyou: require('../../../videos/nicetomeetyou.mp4'),
  seeyoulater: require('../../../videos/seeyoulater.mp4'),
  // Animals
  cat: require('../../../videos/cat.mp4'),
  dog: require('../../../videos/dog.mp4'),
  fish: require('../../../videos/fish.mp4'),
  rabbit: require('../../../videos/rabbit.mp4'),
  // Colors
  red: require('../../../videos/red.mp4'),
  blue: require('../../../videos/blue.mp4'),
  yellow: require('../../../videos/yellow.mp4'),
  white: require('../../../videos/white.mp4'),
  black: require('../../../videos/black.mp4'),
  // Feelings
  happy: require('../../../videos/happy.mp4'),
  sad: require('../../../videos/sad.mp4'),
  angry: require('../../../videos/angry.mp4'),
  excited: require('../../../videos/excited.mp4'),
};

// ─── Types ───────────────────────────────────────────────────────────────────
type QuestionType =
  | 'video-to-definition'
  | 'definition-to-video'
  | 'fill-in-blank'
  | 'match-sign'
  | 'multi-video-pick'
  | 'scenario-video';

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
  lesson?: string;
};

// ─── All questions from all lessons ───────────────────────────────────────────
const ALL_QUESTIONS: Question[] = [
  // ──── GREETINGS (9 questions)
  {
    id: 0,
    lesson: 'greetings',
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
    lesson: 'greetings',
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
    lesson: 'greetings',
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
    lesson: 'greetings',
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
    lesson: 'greetings',
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
    lesson: 'greetings',
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
    lesson: 'greetings',
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
    lesson: 'greetings',
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
    lesson: 'greetings',
    type: 'multi-video-pick',
    prompt: 'Play each video. Which sign means "See you later"?',
    options: [
      { videoKey: 'hello', correct: false },
      { videoKey: 'nicetomeetyou', correct: false },
      { videoKey: 'seeyoulater', correct: true },
    ],
    explanation: '"See you later" uses an "L" handshape, distinctive in ASL.',
  },

  // ──── ANIMALS (8 questions)
  {
    id: 9,
    lesson: 'animals',
    type: 'video-to-definition',
    prompt: 'What does this sign mean?',
    videoKey: 'cat',
    options: [
      { label: 'Cat', correct: true },
      { label: 'Dog', correct: false },
      { label: 'Fish', correct: false },
    ],
    explanation: 'The "C" handshape near the mouth means "Cat."',
  },
  {
    id: 10,
    lesson: 'animals',
    type: 'definition-to-video',
    prompt: 'Which video shows "Cat"?',
    options: [
      { videoKey: 'cat', correct: true },
      { videoKey: 'dog', correct: false },
      { videoKey: 'rabbit', correct: false },
    ],
    explanation: '"Cat" uses a "C" handshape pulled back from near the mouth.',
  },
  {
    id: 11,
    lesson: 'animals',
    type: 'video-to-definition',
    prompt: 'What does this sign mean?',
    videoKey: 'dog',
    options: [
      { label: 'Cat', correct: false },
      { label: 'Dog', correct: true },
      { label: 'Rabbit', correct: false },
    ],
    explanation: 'Patting your leg and snapping fingers = "Dog."',
  },
  {
    id: 12,
    lesson: 'animals',
    type: 'definition-to-video',
    prompt: 'Which video shows "Dog"?',
    options: [
      { videoKey: 'cat', correct: false },
      { videoKey: 'dog', correct: true },
      { videoKey: 'fish', correct: false },
    ],
    explanation: '"Dog" is signed by patting the leg as if calling a pet.',
  },
  {
    id: 13,
    lesson: 'animals',
    type: 'video-to-definition',
    prompt: 'What does this sign mean?',
    videoKey: 'fish',
    options: [
      { label: 'Fish', correct: true },
      { label: 'Rabbit', correct: false },
      { label: 'Dog', correct: false },
    ],
    explanation: 'A wiggling palm moving forward = "Fish."',
  },
  {
    id: 14,
    lesson: 'animals',
    type: 'definition-to-video',
    prompt: 'Which video shows "Fish"?',
    options: [
      { videoKey: 'rabbit', correct: false },
      { videoKey: 'fish', correct: true },
      { videoKey: 'dog', correct: false },
    ],
    explanation: '"Fish" mimics the swimming motion of a fish.',
  },
  {
    id: 15,
    lesson: 'animals',
    type: 'video-to-definition',
    prompt: 'What does this sign mean?',
    videoKey: 'rabbit',
    options: [
      { label: 'Fish', correct: false },
      { label: 'Rabbit', correct: true },
      { label: 'Cat', correct: false },
    ],
    explanation: 'Crossed arms with wiggling fingers = "Rabbit ears."',
  },
  {
    id: 16,
    lesson: 'animals',
    type: 'definition-to-video',
    prompt: 'Which video shows "Rabbit"?',
    options: [
      { videoKey: 'dog', correct: false },
      { videoKey: 'rabbit', correct: true },
      { videoKey: 'cat', correct: false },
    ],
    explanation: '"Rabbit" mimics the distinctive ears with crossed arms.',
  },

  // ──── COLORS (9 questions)
  {
    id: 17,
    lesson: 'colors',
    type: 'video-to-definition',
    prompt: 'What does this sign mean?',
    videoKey: 'red',
    options: [
      { label: 'Red', correct: true },
      { label: 'Blue', correct: false },
      { label: 'Black', correct: false },
    ],
    explanation: 'Index finger downward like "shh" near the lips = "Red."',
  },
  {
    id: 18,
    lesson: 'colors',
    type: 'definition-to-video',
    prompt: 'Which video shows "Red"?',
    options: [
      { videoKey: 'red', correct: true },
      { videoKey: 'blue', correct: false },
      { videoKey: 'yellow', correct: false },
    ],
    explanation: '"Red" is signed with the index finger in a shushing motion.',
  },
  {
    id: 19,
    lesson: 'colors',
    type: 'video-to-definition',
    prompt: 'What does this sign mean?',
    videoKey: 'blue',
    options: [
      { label: 'Blue', correct: true },
      { label: 'Yellow', correct: false },
      { label: 'White', correct: false },
    ],
    explanation: 'The "B" handshape with a twisting motion = "Blue."',
  },
  {
    id: 20,
    lesson: 'colors',
    type: 'definition-to-video',
    prompt: 'Which video shows "Blue"?',
    options: [
      { videoKey: 'blue', correct: true },
      { videoKey: 'white', correct: false },
      { videoKey: 'black', correct: false },
    ],
    explanation: '"Blue" uses a "B" handshape (all fingers together) with a twist.',
  },
  {
    id: 21,
    lesson: 'colors',
    type: 'video-to-definition',
    prompt: 'What does this sign mean?',
    videoKey: 'yellow',
    options: [
      { label: 'Yellow', correct: true },
      { label: 'Red', correct: false },
      { label: 'Blue', correct: false },
    ],
    explanation: 'The "Y" handshape with a twisting motion = "Yellow."',
  },
  {
    id: 22,
    lesson: 'colors',
    type: 'definition-to-video',
    prompt: 'Which video shows "Yellow"?',
    options: [
      { videoKey: 'white', correct: false },
      { videoKey: 'yellow', correct: true },
      { videoKey: 'red', correct: false },
    ],
    explanation: '"Yellow" is signed with "Y" handshape (thumb and pinky extended).',
  },
  {
    id: 23,
    lesson: 'colors',
    type: 'video-to-definition',
    prompt: 'What does this sign mean?',
    videoKey: 'white',
    options: [
      { label: 'White', correct: true },
      { label: 'Black', correct: false },
      { label: 'Yellow', correct: false },
    ],
    explanation: 'Pulling fingers down from the body = "White."',
  },
  {
    id: 24,
    lesson: 'colors',
    type: 'definition-to-video',
    prompt: 'Which video shows "White"?',
    options: [
      { videoKey: 'black', correct: false },
      { videoKey: 'white', correct: true },
      { videoKey: 'blue', correct: false },
    ],
    explanation: '"White" is signed by pulling downward with spread fingers.',
  },
  {
    id: 25,
    lesson: 'colors',
    type: 'video-to-definition',
    prompt: 'What does this sign mean?',
    videoKey: 'black',
    options: [
      { label: 'Black', correct: true },
      { label: 'Red', correct: false },
      { label: 'White', correct: false },
    ],
    explanation: 'Index finger drawn across the forehead = "Black."',
  },

  // ──── FEELINGS (8 questions)
  {
    id: 26,
    lesson: 'feelings',
    type: 'video-to-definition',
    prompt: 'What emotion does this sign show?',
    videoKey: 'happy',
    options: [
      { label: 'Happy', correct: true },
      { label: 'Sad', correct: false },
      { label: 'Angry', correct: false },
    ],
    explanation: 'Hands moving upward on the chest with a smile = "Happy."',
  },
  {
    id: 27,
    lesson: 'feelings',
    type: 'definition-to-video',
    prompt: 'Which video shows "Happy"?',
    options: [
      { videoKey: 'happy', correct: true },
      { videoKey: 'sad', correct: false },
      { videoKey: 'excited', correct: false },
    ],
    explanation: '"Happy" is signed with upward movements on the chest.',
  },
  {
    id: 28,
    lesson: 'feelings',
    type: 'video-to-definition',
    prompt: 'What emotion does this sign show?',
    videoKey: 'sad',
    options: [
      { label: 'Happy', correct: false },
      { label: 'Sad', correct: true },
      { label: 'Excited', correct: false },
    ],
    explanation: 'Hands moving downward from the eyes = "Sad."',
  },
  {
    id: 29,
    lesson: 'feelings',
    type: 'definition-to-video',
    prompt: 'Which video shows "Sad"?',
    options: [
      { videoKey: 'happy', correct: false },
      { videoKey: 'sad', correct: true },
      { videoKey: 'angry', correct: false },
    ],
    explanation: '"Sad" is signed with downward hand movements from the face.',
  },
  {
    id: 30,
    lesson: 'feelings',
    type: 'video-to-definition',
    prompt: 'What emotion does this sign show?',
    videoKey: 'angry',
    options: [
      { label: 'Angry', correct: true },
      { label: 'Happy', correct: false },
      { label: 'Sad', correct: false },
    ],
    explanation: 'Fierce expression with tense hand movements = "Angry."',
  },
  {
    id: 31,
    lesson: 'feelings',
    type: 'definition-to-video',
    prompt: 'Which video shows "Angry"?',
    options: [
      { videoKey: 'angry', correct: true },
      { videoKey: 'excited', correct: false },
      { videoKey: 'happy', correct: false },
    ],
    explanation: '"Angry" is signed with sharp, tense movements.',
  },
  {
    id: 32,
    lesson: 'feelings',
    type: 'video-to-definition',
    prompt: 'What emotion does this sign show?',
    videoKey: 'excited',
    options: [
      { label: 'Excited', correct: true },
      { label: 'Angry', correct: false },
      { label: 'Sad', correct: false },
    ],
    explanation: 'Energetic upward movements with a big smile = "Excited."',
  },
  {
    id: 33,
    lesson: 'feelings',
    type: 'definition-to-video',
    prompt: 'Which video shows "Excited"?',
    options: [
      { videoKey: 'excited', correct: true },
      { videoKey: 'happy', correct: false },
      { videoKey: 'sad', correct: false },
    ],
    explanation: '"Excited" is signed with big, energetic upward movements.',
  },
];

// ─── Single video player tile ─────────────────────────────────────────────────
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
          { height, borderColor, opacity: dim ? 0.4 : 1 },
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

// ─── Question Video Player ───────────────────────────────────────────────────
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

// ─── Main Daily Challenge Quiz ────────────────────────────────────────────────
interface Props {
  onComplete: (score: number) => void;
}

export default function DailyChallengeQuiz({ onComplete }: Props) {
  const navigation = useNavigation();
  const {
    greetingsQuizCompleted, animalsQuizCompleted, colorsQuizCompleted, feelingsQuizCompleted,
  } = useLessonProgress();

  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);

  // Get 3 random questions from completed lessons, or fallback to greetings
  const questions = useMemo(() => {
    const completedLessons: string[] = [];
    if (greetingsQuizCompleted) completedLessons.push('greetings');
    if (animalsQuizCompleted) completedLessons.push('animals');
    if (colorsQuizCompleted) completedLessons.push('colors');
    if (feelingsQuizCompleted) completedLessons.push('feelings');

    // If no lessons completed, use greetings
    if (completedLessons.length === 0) {
      completedLessons.push('greetings');
    }

    // Filter questions by completed lessons
    const filtered = ALL_QUESTIONS.filter(q => completedLessons.includes(q.lesson!));

    // Shuffle and pick 3
    const shuffled = filtered.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, [greetingsQuizCompleted, animalsQuizCompleted, colorsQuizCompleted, feelingsQuizCompleted]);

  const q = questions[quizIndex];
  const isCorrect = selected !== null && q.options[selected].correct;

  const handleSelect = (i: number) => {
    if (showFeedback) return;
    setSelected(i);
    setShowFeedback(true);
    if (q.options[i].correct) setScore(score + 1);
  };

  const handleNext = () => {
    if (quizIndex + 1 >= questions.length) {
      onComplete(score);
    } else {
      setQuizIndex(quizIndex + 1);
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

    // Video options (videos shown as tiles)
    return (
      <View style={styles.grid}>
        {options.map((opt, i) => {
          const showCorrect = showFeedback && opt.correct;
          const showWrong = showFeedback && i === selected && !opt.correct;
          return (
            <View key={i} style={styles.gridItem}>
              <VideoTile
                videoKey={opt.videoKey!}
                selected={i === selected}
                correct={showCorrect}
                wrong={showWrong}
                dim={showFeedback && !opt.correct && i !== selected}
                onPress={() => handleSelect(i)}
                label={type === 'fill-in-blank' ? undefined : ''}
              />
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Progress */}
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>
            Question {quizIndex + 1} of {questions.length}
          </Text>
          <Text style={styles.scoreText}>Score: {score}</Text>
        </View>

        {/* Question */}
        <Text style={styles.prompt}>{q.prompt}</Text>

        {/* Question Video */}
        {q.videoKey && <QuestionVideo videoKey={q.videoKey} />}

        {/* Sentence (for fill-in-blank) */}
        {q.sentence && (
          <Text style={styles.sentence}>{q.sentence}</Text>
        )}

        {/* Options */}
        {renderOptions()}

        {/* Feedback */}
        {showFeedback && (
          <View
            style={[
              styles.feedbackBox,
              isCorrect ? styles.feedbackCorrect : styles.feedbackWrong,
            ]}
          >
            <Text style={styles.feedbackLabel}>
              {isCorrect ? '✓ Correct!' : '✗ Not quite'}
            </Text>
            <Text style={styles.explanation}>{q.explanation}</Text>
          </View>
        )}

        {/* Next Button */}
        {showFeedback && (
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={handleNext}
          >
            <Text style={styles.nextBtnText}>
              {quizIndex + 1 >= questions.length ? 'See Results' : 'Next →'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#23254b',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  progressText: {
    color: '#9fb0ff',
    fontSize: 13,
    fontWeight: '600',
  },
  scoreText: {
    color: '#6fb0ff',
    fontSize: 13,
    fontWeight: '700',
  },
  prompt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  sentence: {
    color: '#cbd5ff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#1a1c3a',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#6fb0ff',
  },
  listGrid: {
    gap: 8,
    marginBottom: 16,
  },
  listCard: {
    backgroundColor: '#1d1f3d',
    borderWidth: 2,
    borderColor: '#3a3d6e',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  listCardSelected: {
    borderColor: '#6fb0ff',
    backgroundColor: '#1e2a5a',
  },
  listCardCorrect: {
    borderColor: '#3fc98e',
    backgroundColor: '#0e3d27',
  },
  listCardWrong: {
    borderColor: '#e24b4a',
    backgroundColor: '#3d1414',
  },
  listCardDim: {
    opacity: 0.5,
  },
  listCardLabel: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  labelCorrect: {
    color: '#3fc98e',
  },
  labelWrong: {
    color: '#e24b4a',
  },
  grid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  gridItem: {
    flex: 1,
    minWidth: '30%',
  },
  videoTile: {
    backgroundColor: '#111328',
    borderWidth: 2,
    borderRadius: 12,
    overflow: 'hidden',
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
  questionVideoBox: {
    height: 200,
    backgroundColor: '#000',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#3a3d6e',
  },
  questionVideoOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackBox: {
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  feedbackCorrect: {
    backgroundColor: '#0e3d27',
    borderWidth: 1,
    borderColor: '#3fc98e',
  },
  feedbackWrong: {
    backgroundColor: '#3d1414',
    borderWidth: 1,
    borderColor: '#e24b4a',
  },
  feedbackLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  explanation: {
    color: '#cbd5ff',
    fontSize: 14,
    lineHeight: 20,
  },
  nextBtn: {
    backgroundColor: '#6fb0ff',
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#111',
    fontSize: 15,
    fontWeight: '700',
  },
});
