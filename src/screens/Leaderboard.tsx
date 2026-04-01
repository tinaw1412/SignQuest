import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import sampleUsers from '../data/sampleUsers';

export default function Leaderboard() {
    const { user } = useAuth();

    // Create a local copy and ensure the logged-in user is present and up-to-date
    const rows = [...sampleUsers];

    if (user) {
        const idx = rows.findIndex((r) => r.username === user.username);
        if (idx >= 0) {
            rows[idx] = { ...rows[idx], firstName: user.firstName, xp: (user.xp ?? rows[idx].xp) };
        } else {
            // if user not in sample set, add them with a conservative XP value
            rows.push({ username: user.username, firstName: user.firstName, xp: user.xp ?? 0 });
        }
    }

    // Sort descending by XP
    rows.sort((a, b) => b.xp - a.xp);

    // Compute user's rank if signed in
    const yourRank = user ? rows.findIndex((r) => r.username === user.username) : -1;

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Leaderboard</Text>

            <View style={styles.box}>
                {rows.map((r, i) => {
                    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '';
                    return (
                        <View key={`${r.username}-${i}`} style={styles.row}>
                            <Text style={[styles.rankLeft, i < 3 ? styles.topRankLeft : null]}>
                                {i + 1}. {medal ? `${medal} ` : ''}{r.firstName}
                            </Text>
                            <Text style={[styles.rankRight, i < 3 ? styles.topRankRight : null]}>{r.xp} XP</Text>
                        </View>
                    );
                })}

                <View style={styles.separator} />
                <Text style={styles.you}>{user ? `Your Rank: #${yourRank >= 0 ? yourRank + 1 : '—'}` : 'Your Rank: —'}</Text>
            </View>

            <View style={{ height: 160 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 140,
        backgroundColor: '#23254b',
    },
    title: { color: '#fff', fontSize: 32, fontWeight: '600', textAlign: 'center', marginTop: 8, marginBottom: 12 },
    box: {
        marginTop: 8,
        marginHorizontal: 24,
        borderRadius: 16,
        borderWidth: 3,
        borderColor: '#6fb0ff',
        paddingVertical: 12,
        paddingHorizontal: 18,
        backgroundColor: 'rgba(255,255,255,0.02)',
    },
    row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
    rankLeft: { color: '#fff', fontSize: 16 },
    rankRight: { color: '#fff', fontSize: 16 },
    topRankLeft: { fontWeight: '700' },
    topRankRight: { fontWeight: '700' },
    separator: { height: 8 },
    you: { color: '#fff', textAlign: 'center', marginTop: 8, fontSize: 16, fontWeight: '600' },
});
