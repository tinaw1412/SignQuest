import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';

export type Sign = { 
  id: number; 
  label: string; 
  emoji: string; 
  description: string; 
  videoUri: number;
  tips?: string[];
};

interface Props { 
  sign: Sign; 
  onComplete: () => void; 
  onBack: () => void;
  lessonName?: string;
}

export default function LessonVideoPlayer({ sign, onComplete, onBack, lessonName = 'Lesson' }: Props) {
  const [finished, setFinished] = useState(false);

  const player = useVideoPlayer(sign.videoUri, (p) => {
    p.loop = false;
    p.play();
  });

  // Listen for when playback ends
  React.useEffect(() => {
    const subscription = player.addListener('playToEnd', () => {
      setFinished(true);
    });
    return () => subscription.remove();
  }, [player]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Text style={styles.backBtnText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{sign.emoji} {sign.label}</Text>
      <Text style={styles.desc}>{sign.description}</Text>

      <VideoView
        player={player}
        style={styles.video}
        allowsFullscreen
        allowsPictureInPicture={false}
        contentFit="contain"
      />

      {sign.tips && sign.tips.length > 0 && (
        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>Tips</Text>
          {sign.tips.map((tip, idx) => (
            <Text key={idx} style={styles.tip}>{tip}</Text>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={[styles.doneBtn, !finished && styles.doneBtnDisabled]}
        onPress={onComplete}
        disabled={!finished}
        accessibilityRole="button"
      >
        <Text style={styles.doneBtnText}>
          {finished ? 'Mark complete (+50 XP)' : 'Watch the full video first'}
        </Text>
      </TouchableOpacity>

      {/* Remove before shipping */}
      {!finished && (
        <TouchableOpacity onPress={() => setFinished(true)} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip (dev only)</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#23254b',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  backBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#3a3d6e',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  backBtnText: {
    color: '#6fb0ff',
    fontSize: 13,
    fontWeight: '600',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
  },
  desc: {
    color: '#9fb0ff',
    fontSize: 13,
    marginBottom: 16,
  },
  video: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 14,
    backgroundColor: '#000',
    marginBottom: 16,
  },
  tips: {
    borderWidth: 1.5,
    borderColor: '#6fb0ff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    backgroundColor: '#1a1c3a',
  },
  tipsTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  tip: {
    color: '#cbd5ff',
    fontSize: 13,
    marginBottom: 4,
  },
  doneBtn: {
    backgroundColor: '#e6e6ee',
    borderRadius: 28,
    paddingVertical: 12,
    alignItems: 'center',
  },
  doneBtnDisabled: {
    opacity: 0.4,
  },
  doneBtnText: {
    color: '#111',
    fontSize: 15,
    fontWeight: '600',
  },
  skipBtn: {
    marginTop: 12,
    alignItems: 'center',
  },
  skipText: {
    color: '#9fb0ff',
    fontSize: 12,
  },
});