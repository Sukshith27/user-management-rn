import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Animated } from 'react-native';

const TABS = ['All', 'Admin', 'Manager'];
const TAB_WIDTH = 100;

export default function UserTabs({ onTabChange, onSearch }: { onTabChange: (tab: string) => void, onSearch: (query: string) => void }) {
  const [activeTab, setActiveTab] = useState(0);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const indicator = useRef(new Animated.Value(0)).current;

  const handleTabPress = (index: number) => {
    setActiveTab(index);
    Animated.timing(indicator, {
      toValue: index * TAB_WIDTH,
      duration: 300,
      useNativeDriver: false,
    }).start();
    onTabChange(TABS[index]);
  };

  return (
    <View>
      <View style={styles.tabRow}>
        <View style={styles.tabsContainer}>
          {TABS.map((tab, idx) => (
            <TouchableOpacity key={tab} style={styles.tab} onPress={() => handleTabPress(idx)}>
              <Text style={[styles.tabText, activeTab === idx && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
          <Animated.View
            style={[styles.indicator, { left: indicator }]}
          />
        </View>
        <TouchableOpacity style={styles.searchIcon} onPress={() => setSearchVisible(true)}>
          <Text style={styles.searchIconText}>🔍</Text>
        </TouchableOpacity>
      </View>
      {searchVisible && (
        <View style={styles.searchBarBetween}>
          <View style={styles.searchBar}>
            <Text style={styles.searchBarIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name"
              value={searchText}
              onChangeText={(text: string) => {
                setSearchText(text);
                onSearch(text);
              }}
              autoFocus
              placeholderTextColor="#888"
            />
            <TouchableOpacity onPress={() => { setSearchVisible(false); setSearchText(''); onSearch(''); }}>
              <Text style={styles.searchBarClose}>←</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginBottom: 8,
    height: 56,
    // backgroundColor: '#f8f9fa',
    // borderRadius: 16,
    position: 'relative',
  },
  tabsContainer: {
    flexDirection: 'row',
    position: 'relative',
    backgroundColor: '#f3f3f3',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  tab: {
    width: TAB_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 22,
    zIndex: 1,
  },
  tabText: {
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  indicator: {
    position: 'absolute',
    top: 2,
    left: 0,
    width: TAB_WIDTH,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#007AFF',
    zIndex: 0,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginLeft: 4,
    padding: 8,
    backgroundColor: 'transparent',
    // borderRadius: 8,
  },
  searchIconText: {
    fontSize: 24,
    color: '#007AFF',
  },
  searchBarBetween: {
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  searchBarIcon: {
    fontSize: 20,
    color: '#007AFF',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 6,
  },
  searchBarClose: {
    fontSize: 22,
    color: '#007AFF',
    marginLeft: 8,
    fontWeight: 'bold',
  },
});
