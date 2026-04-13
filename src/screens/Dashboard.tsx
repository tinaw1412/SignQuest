import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useLessonProgress } from '../context/LessonProgressContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import sampleUsers from '../data/sampleUsers';

function ProgressBar({ percent }: { percent: number }) {
    return (
        <View style={styles.progressWrap} accessibilityRole="progressbar" aria-valuenow={percent}>
            <View style={[styles.progressFill, { flex: percent }]} />
            <View style={[styles.progressEmpty, { flex: 100 - percent }]} />
        </View>
    );
}

export default function Dashboard() {
    const { user } = useAuth();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { 
        greetingsWatched,
        greetingsQuizIndex,
        greetingsQuizScore,
        greetingsQuizCompleted, 
        colorsWatched,
        colorsQuizIndex,
        colorsQuizScore,
        colorsQuizCompleted, 
        animalsWatched,
        animalsQuizIndex,
        animalsQuizScore,
        animalsQuizCompleted, 
        feelingsWatched,
        feelingsQuizIndex,
        feelingsQuizScore,
        feelingsQuizCompleted,
        dailyQuizCompletedDate 
    } = useLessonProgress();

    const name = user ? user.firstName : 'there';
    const xp = user?.xp ?? 0;
    const level = user?.level ?? 1;
    const streak = user?.streak ?? 0;

    // XP per level (simple linear system)
    const xpPerLevel = 1000;
    const currentLevelXp = (level - 1) * xpPerLevel;
    const nextLevelXp = level * xpPerLevel;
    const progressPercent = Math.max(0, Math.min(100, Math.round(((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100)));

    const getNextLesson = () => {
        if (!greetingsQuizCompleted) {
            const videosWatched = greetingsWatched.filter(Boolean).length;
            const quizQuestionsAnswered = greetingsQuizIndex + (greetingsQuizScore > 0 ? 1 : 0);
            const progress = Math.round(((videosWatched + quizQuestionsAnswered) / 17) * 100);
            return { name: 'Lesson 1: Greetings', screen: 'GreetingsLesson' as keyof RootStackParamList, progress };
        }
        if (!colorsQuizCompleted) {
            const videosWatched = colorsWatched.filter(Boolean).length;
            const quizQuestionsAnswered = colorsQuizIndex + (colorsQuizScore > 0 ? 1 : 0);
            const progress = Math.round(((videosWatched + quizQuestionsAnswered) / 14) * 100);
            return { name: 'Lesson 2: Colors', screen: 'ColorLesson' as keyof RootStackParamList, progress };
        }
        if (!animalsQuizCompleted) {
            const videosWatched = animalsWatched.filter(Boolean).length;
            const quizQuestionsAnswered = animalsQuizIndex + (animalsQuizScore > 0 ? 1 : 0);
            const progress = Math.round(((videosWatched + quizQuestionsAnswered) / 12) * 100);
            return { name: 'Lesson 3: Animals', screen: 'AnimalLesson' as keyof RootStackParamList, progress };
        }
        if (!feelingsQuizCompleted) {
            const videosWatched = feelingsWatched.filter(Boolean).length;
            const quizQuestionsAnswered = feelingsQuizIndex + (feelingsQuizScore > 0 ? 1 : 0);
            const progress = Math.round(((videosWatched + quizQuestionsAnswered) / 12) * 100);
            return { name: 'Lesson 4: Feelings', screen: 'FeelingsLesson' as keyof RootStackParamList, progress };
        }
        return null; // All lessons completed
    };

    const nextLesson = getNextLesson();

    const today = new Date().toISOString().slice(0, 10);
    const dailyChallengeDone = dailyQuizCompletedDate === today;

    const leaderboardUsers = [...sampleUsers];
    if (user) {
        const userInLeaderboard = leaderboardUsers.find(u => u.username === user.username);
        if (userInLeaderboard) {
            userInLeaderboard.xp = xp;
        } else {
            leaderboardUsers.push({ username: user.username, firstName: user.firstName, xp });
        }
    }
    leaderboardUsers.sort((a, b) => b.xp - a.xp);
    const top3 = leaderboardUsers.slice(0, 3);
    const userRank = user ? leaderboardUsers.findIndex(u => u.username === user.username) + 1 : -1;

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.greeting}>Hi, {name}!</Text>

            <View style={styles.row}>
                <Text style={styles.rowText}>🔥 Streak: <Text style={styles.bold}>{streak} day{streak === 1 ? '' : 's'}</Text></Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.rowText}>⭐ XP: <Text style={styles.bold}>{xp} / {nextLevelXp}</Text></Text>
            </View>

            <ProgressBar percent={progressPercent} />
            <Text style={styles.level}>Level {level}</Text>

            {nextLesson ? (
                <TouchableOpacity onPress={() => navigation.navigate(nextLesson.screen)}>
                    <View style={styles.largeCard}>
                        <Text style={styles.cardTitle}>Continue Lesson</Text>
                        <Text style={styles.cardSubtitle}>{nextLesson.name}</Text>
                        <Text style={styles.cardProgress}>[{nextLesson.progress}% Complete]</Text>
                    </View>
                </TouchableOpacity>
            ) : (
                <View style={styles.largeCard}>
                    <Text style={styles.cardTitle}>All Lessons Completed!</Text>
                    <Text style={styles.cardSubtitle}>Check back for more soon.</Text>
                </View>
            )}

            <TouchableOpacity onPress={() => !dailyChallengeDone && navigation.navigate('DailyQuiz')} disabled={dailyChallengeDone}>
                <View style={styles.largeCard}>
                    <Text style={styles.cardTitle}>🎯 Daily Challenge</Text>
                    <Text style={styles.cardSubtitle}>{dailyChallengeDone ? "You've completed today's challenge!" : "Learn 3 New Signs"}</Text>
                    <Text style={styles.cardAction}>{dailyChallengeDone ? "[Completed]" : "[Start Challenge]"}</Text>
                </View>
            </TouchableOpacity>

            <View style={styles.leaderboard}>
                <Text style={styles.leaderTitle}>🏆 Leaderboard Preview</Text>
                {top3.map((u, index) => (
                    <Text key={u.username} style={styles.leaderRow}>{index + 1}. {u.firstName} {u.xp} XP</Text>
                ))}
                {userRank > 3 && (
                    <Text style={styles.leaderRow}>
                    {userRank}. {name} {xp} XP</Text>
                )}
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 120,
        backgroundColor: '#23254b',
    },
    greeting: { color: '#fff', fontSize: 34, fontWeight: '600', marginTop: 4 },
    row: { marginTop: 12 },
    rowText: { color: '#f3f4f6', fontSize: 16 },
    bold: { fontWeight: '700', color: '#fff' },
    progressWrap: {
        flexDirection: 'row',
        height: 18,
        borderRadius: 6,
        overflow: 'hidden',
        marginTop: 10,
        backgroundColor: '#44475a',
    },
    progressFill: { backgroundColor: '#cbd5ff' },
    progressEmpty: { backgroundColor: '#e6e6ee' },
    level: { color: '#cbd5ff', marginTop: 8 },
    largeCard: {
        marginTop: 18,
        backgroundColor: '#e6e6ee',
        borderRadius: 16,
        padding: 18,
        alignItems: 'center',
    },
    cardTitle: { fontSize: 16, fontWeight: '700', color: '#111' },
    cardSubtitle: { marginTop: 8, fontSize: 14, color: '#111' },
    cardProgress: { marginTop: 10, fontSize: 14, color: '#111', fontWeight: '600' },
    cardAction: { marginTop: 10, fontSize: 14, color: '#111', fontWeight: '600' },
    leaderboard: {
        marginTop: 18,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#6fb0ff',
        padding: 12,
        backgroundColor: 'rgba(255,255,255,0.02)',
    },
    leaderTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
    leaderRow: { color: '#fff', marginTop: 6 },
});
