import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

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
    const name = user ? user.firstName : 'there';
    const xp = user?.xp ?? 0;
    const level = user?.level ?? 1;
    const streak = user?.streak ?? 0;

    // XP per level (simple linear system)
    const xpPerLevel = 1000;
    const currentLevelXp = (level - 1) * xpPerLevel;
    const nextLevelXp = level * xpPerLevel;
    const progressPercent = Math.max(0, Math.min(100, Math.round(((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100)));

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

            <View style={styles.largeCard}>
                <Text style={styles.cardTitle}>Continue Lesson</Text>
                <Text style={styles.cardSubtitle}>'Basics - Lesson 3'</Text>
                <Text style={styles.cardProgress}>[70% Complete]</Text>
            </View>

            <View style={styles.largeCard}>
                <Text style={styles.cardTitle}>🎯 Daily Challenge</Text>
                <Text style={styles.cardSubtitle}>'Learn 3 New Signs'</Text>
                <Text style={styles.cardAction}>[Start Challenge]</Text>
            </View>

                    <View style={styles.leaderboard}>
                        <Text style={styles.leaderTitle}>🏆 Leaderboard Preview</Text>
                        <Text style={styles.leaderRow}>1. Alex 3200 XP</Text>
                        <Text style={styles.leaderRow}>2. {name} 2800 XP</Text>
                        <Text style={styles.leaderRow}>3. Charles 2650 XP</Text>
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
