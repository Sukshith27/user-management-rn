import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const TABS = ['All', 'Admin', 'Manager'];

export default function UserTabs({ onTabChange }: { onTabChange: (tab: string) => void }) {
  const [activeTab, setActiveTab] = useState(0);
  const indicator = new Animated.Value(activeTab);

  const handleTabPress = (index: number) => {
    setActiveTab(index);
    Animated.spring(indicator, {
      toValue: index,
      useNativeDriver: false,
    }).start();
    onTabChange(TABS[index]);
  };

  return (
    <View style={styles.tabRow}>
      {TABS.map((tab, idx) => (
        <TouchableOpacity key={tab} style={styles.tab} onPress={() => handleTabPress(idx)}>
          <Text style={[styles.tabText, activeTab === idx && styles.activeTabText]}>{tab}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.searchIcon}>
        <Icon name="search" size={24} color="#333" />
      </TouchableOpacity>
      <Animated.View
        style={[styles.indicator, { left: activeTab * 80 }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
    position: 'relative',
    height: 48,
  },
  tab: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  tabText: {
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#333',
    fontWeight: 'bold',
  },
  searchIcon: {
    marginLeft: 'auto',
    padding: 8,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    width: 80,
    height: 3,
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
});
