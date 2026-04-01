import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

type TabKey = 'Home' | 'Learn' | 'Daily' | 'Rank' | 'Profile';

interface Props {
  active: TabKey;
  onTabPress: (tab: TabKey) => void;
}

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'Home', label: 'Home', icon: '🏠' },
  { key: 'Learn', label: 'Learn', icon: '📚' },
  { key: 'Daily', label: 'Daily', icon: '🎯' },
  { key: 'Rank', label: 'Rank', icon: '🏆' },
  { key: 'Profile', label: 'Profile', icon: '👤' },
];

export default function BottomNav({ active, onTabPress }: Props) {
  return (
    <View style={styles.container} accessible accessibilityRole="tablist">
      {TABS.map((t) => {
        const selected = t.key === active;
        return (
          <TouchableOpacity
            key={t.key}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={`${t.label} tab`}
            onPress={() => onTabPress(t.key)}
            style={[styles.tab, selected ? styles.tabActive : null]}
          >
            <Text style={[styles.icon, selected ? styles.iconActive : null]}>{t.icon}</Text>
            <Text style={[styles.label, selected ? styles.labelActive : null]}>{t.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    height: 72,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#222',
    backgroundColor: '#1f2a5a',
    alignItems: 'center',
    justifyContent: 'space-around',
    // Elevation / shadow so the bar sits above content
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  icon: {
    fontSize: 20,
    color: '#cbd5ff',
  },
  iconActive: {
    color: '#fff',
  },
  label: {
    marginTop: 2,
    fontSize: 12,
    color: '#9fb0ff',
  },
  labelActive: {
    color: '#fff',
    fontWeight: '600',
  },
});
