import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, Modal, RefreshControl } from 'react-native';
import PagerView from 'react-native-pager-view';
import { getRealm, User } from '../database/UserModel';
import { fetchZellerCustomers } from '../api/zellerGraphQL';
import UserTabs from '../components/UserTabs';
import CreateUserScreen from './CreateUserScreen';
import EditUserScreen from './EditUserScreen';

function groupUsersAlphabetically(users: User[]) {
  const grouped: { [key: string]: User[] } = {};
  users.forEach(user => {
    const firstLetter = user.name.charAt(0).toUpperCase();
    if (!grouped[firstLetter]) grouped[firstLetter] = [];
    grouped[firstLetter].push(user);
  });
  return Object.keys(grouped)
    .sort()
    .map(letter => ({ title: letter, data: grouped[letter].sort((a, b) => a.name.localeCompare(b.name)) }));
}

export default function UserListScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [tab, setTab] = useState<'All' | 'Admin' | 'Manager'>('All');
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [editUser, setEditUser] = useState<User | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const pagerRef = useRef<PagerView>(null);

  const loadUsers = async () => {
    const realm = await getRealm();
    let realmUsers = realm.objects<User>('User');
    // Only seed if DB is empty
    if (realmUsers.length === 0) {

      // Fetch from GraphQL API
      try {
        const apiUsers = await fetchZellerCustomers();
        realm.write(() => {
          apiUsers.forEach((u: any) => {
            realm.create('User', {
              id: u.id,
              name: u.name,
              email: u.email,
              type: u.role, // Use 'role' from API
            });
          });
        });
        realmUsers = realm.objects<User>('User');
      } catch (err) {
        // fallback: show empty or handle error
        console.error('Failed to fetch users from API', err);
      }
    }
    setUsers(Array.from(realmUsers));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate 2-3s refresh for UX
    const refreshTimeout = setTimeout(() => {
      setRefreshing(false);
    }, 2200);
    try {
      await loadUsers();
    } finally {
      clearTimeout(refreshTimeout);
      setRefreshing(false);
    }
  };

  const handleTabChange = (tab: string) => {
    setTab(tab as 'All' | 'Admin' | 'Manager');
    const idx = tab === 'All' ? 0 : tab === 'Admin' ? 1 : 2;
    setActiveTabIdx(idx);
    pagerRef.current?.setPage(idx);
  };

  const handleSearch = (query: string) => {
    setSearch(query);
  };


  const getFilteredUsers = (tabType: 'All' | 'Admin' | 'Manager') => {
    return users.filter(u => {
      // Normalize type to title case for comparison
      const normalizedType = u.type ? (u.type.charAt(0).toUpperCase() + u.type.slice(1).toLowerCase()) : '';
      const matchesTab = tabType === 'All' ? true : normalizedType === tabType;
      const searchTerm = search.trim().toLowerCase();
      const matchesSearch =
        searchTerm === '' ||
        u.name.toLowerCase().includes(searchTerm) ||
        (normalizedType && normalizedType.toLowerCase().includes(searchTerm));
      return matchesTab && matchesSearch;
    });
  };

  return (
    <View style={styles.container}>
  <UserTabs onTabChange={handleTabChange} onSearch={handleSearch} activeTab={activeTabIdx} />
      <PagerView
        style={{ flex: 1 }}
        initialPage={0}
        ref={pagerRef}
        onPageSelected={e => {
          const idx = e.nativeEvent.position;
          setActiveTabIdx(idx);
          if (idx === 0) setTab('All');
          else if (idx === 1) setTab('Admin');
          else setTab('Manager');
        }}
      >
        {['All', 'Admin', 'Manager'].map((tabType, idx) => (
          <View key={tabType} style={{ flex: 1 }}>
            <SectionList
              sections={groupUsersAlphabetically(getFilteredUsers(tabType as 'All' | 'Admin' | 'Manager'))}
              keyExtractor={item => item.id}
              renderSectionHeader={({ section: { title } }) => (
                <Text style={styles.sectionHeader}>{title}</Text>
              )}
              renderItem={({ item }) => {
                console.log('UserListScreen renderItem item:', JSON.parse(JSON.stringify(item)));

                return (
                  <TouchableOpacity onPress={() => setEditUser(item)}>
                    <View style={styles.userItemFlat}>
                      <View style={styles.avatarFlat}>
                        <Text style={styles.avatarFlatText}>{item.name.charAt(0).toUpperCase()}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.userNameFlat}>{item.name}</Text>
                      </View>
                      {item.type && item.type.toLowerCase() === 'admin' && (
                        <Text style={styles.userTypeFlat}>Admin</Text>
                      )}
                      {/* {item.type && item.type.toLowerCase() === 'manager' && (
                        <Text style={styles.userTypeFlat}>Manager</Text>
                      )} */}
                    </View>
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={<Text style={styles.placeholder}>No users found.</Text>}
              style={{ width: '100%' }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          </View>
        ))}
      </PagerView>
      <TouchableOpacity style={styles.fab} onPress={() => setShowCreate(true)}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
      <Modal visible={showCreate} animationType="slide">
        <CreateUserScreen
          onClose={() => setShowCreate(false)}
          onCreate={user => {
            getRealm().then(realm => {
              realm.write(() => {
                realm.create('User', {
                  id: Date.now().toString(),
                  name: `${user.firstName} ${user.lastName}`,
                  email: user.email,
                  type: user.role,
                });
                setUsers(Array.from(realm.objects<User>('User')));
              });
            });
            setShowCreate(false);
          }}
        />
      </Modal>
      <Modal visible={!!editUser} animationType="slide">
        {editUser && (
          <EditUserScreen
            user={editUser}
            onClose={() => setEditUser(null)}
            onSave={(updated: { firstName: string; lastName: string; email: string; role: string }) => {
              getRealm().then(realm => {
                realm.write(() => {
                  const u = realm.objectForPrimaryKey<User>('User', editUser.id);
                  if (u) {
                    u.name = `${updated.firstName} ${updated.lastName}`;
                    u.email = updated.email;
                    u.type = updated.role as User['type'];
                  }
                  setUsers(Array.from(realm.objects<User>('User')));
                });
              });
              setEditUser(null);
            }}
            onDelete={() => {
              getRealm().then(realm => {
                realm.write(() => {
                  const u = realm.objectForPrimaryKey<User>('User', editUser.id);
                  if (u) realm.delete(u);
                  setUsers(Array.from(realm.objects<User>('User')));
                });
              });
              setEditUser(null);
            }}
          />
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 32,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 4,
    color: '#888',
    marginTop: 12,
    marginBottom: 4,
    letterSpacing: 1,
  },
  userItemFlat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 0,
    marginVertical: 0,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f3f3',
  },
  avatarFlat: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#E6F0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarFlatText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  userNameFlat: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
  userTypeFlat: {
    fontSize: 14,
    color: '#888',
    marginLeft: 8,
    fontWeight: '500',
  },
  placeholder: {
    fontSize: 16,
    color: '#888',
    marginTop: 16,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 0,
    shadowColor: 'transparent',
    borderWidth: 0,
  },
  fabIcon: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: -2,
  },
});
