import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

function SmallChip({ children }: { children: React.ReactNode }) {
    return (
        <View style={styles.chip}>
            <Text style={styles.chipText}>{children}</Text>
        </View>
    );
}

function LessonCard({ title, progress, status }: { title: string; progress?: number; status: 'completed' | 'inprogress' | 'locked' }) {
    return (
        <View style={styles.lessonCard}>
            <View style={styles.lessonHeader}>
                <Text style={styles.lessonTitle}>{title}</Text>
                {status === 'inprogress' && <View style={styles.continuePill}><Text style={styles.continueText}>Continue</Text></View>}
            </View>

            {status === 'locked' ? (
                <Text style={styles.locked}>🔒 Locked</Text>
            ) : (
                <View style={styles.lessonBody}>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { flex: progress ?? 0 }]} />
                        <View style={[styles.progressEmpty, { flex: 100 - (progress ?? 0) }]} />
                    </View>
                    <Text style={styles.lessonStatus}>{status === 'completed' ? 'Completed' : 'In Progress'}</Text>
                </View>
            )}
        </View>
    );
}

export default function Lessons() {
    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.headerRow}>
                <Text style={styles.screenTitle}>Lessons</Text>
            </View>

            <Text style={styles.sectionLabel}>Categories:</Text>
            <View style={styles.chipsRow}>
                <SmallChip>Basics</SmallChip>
                <SmallChip>Food</SmallChip>
                <SmallChip>Phrases</SmallChip>
            </View>

            <LessonCard title="Lesson 1: Alphabet" progress={100} status="completed" />
            <LessonCard title="Lesson 2: Greetings" progress={50} status="inprogress" />
            <LessonCard title="Lesson 3: Introductions" status="locked" />

            <View style={{ height: 120 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 140,
        backgroundColor: 'transparent',
    },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    back: { paddingRight: 12 },
    backIcon: { color: '#fff', fontSize: 20 },
    screenTitle: { color: '#fff', fontSize: 28, fontWeight: '600' },
    sectionLabel: { color: '#fff', marginTop: 8 },
    chipsRow: { flexDirection: 'row', marginTop: 10 },
    chip: { backgroundColor: '#e6e6ee', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 10 },
    chipText: { color: '#111', fontWeight: '600' },
    // Keep cards visually separated with a subtle blue rounded border to match the mockup
    lessonCard: { marginTop: 16, padding: 14, borderRadius: 12, backgroundColor: 'transparent', borderWidth: 2, borderColor: '#6fb0ff' },
    lessonHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    lessonTitle: { color: '#fff', fontSize: 16, fontWeight: '600' },
    continuePill: { backgroundColor: '#e6e6ee', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16 },
    continueText: { color: '#111', fontWeight: '700' },
    lessonBody: { marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    progressBar: { flex: 1, height: 18, borderRadius: 8, overflow: 'hidden', flexDirection: 'row', marginRight: 12, backgroundColor: '#666' },
    progressFill: { backgroundColor: '#c0c7d9' },
    progressEmpty: { backgroundColor: '#e6e6ee' },
    lessonStatus: { color: '#fff' },
    locked: { marginTop: 10, color: '#fff' },
});
