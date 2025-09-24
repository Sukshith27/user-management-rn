import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, Modal } from 'react-native';
import { getRealm, User } from '../database/UserModel';
import UserTabs from '../components/UserTabs';
import Icon from 'react-native-vector-icons/Ionicons';
import CreateUserScreen from './CreateUserScreen';

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
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      const realm = await getRealm();
      let realmUsers = realm.objects<User>('User');
      if (realmUsers.length === 0) {
        realm.write(() => {
          realm.create('User', {
            id: '1',
            name: 'Alice Smith',
            email: 'alice@zeller.com',
            type: 'Admin',
          });
          realm.create('User', {
            id: '2',
            name: 'Bob Johnson',
            email: 'bob@zeller.com',
            type: 'Manager',
          });
        });
        realmUsers = realm.objects<User>('User');
      }
      setUsers(Array.from(realmUsers));
    };
    loadUsers();
  }, []);

  const handleTabChange = (tab: string) => {
    setTab(tab as 'All' | 'Admin' | 'Manager');
  };

  const filteredUsers = users.filter(u => tab === 'All' ? true : u.type === tab);
  const sections = groupUsersAlphabetically(filteredUsers);

  return (
    <View style={styles.container}>
      <UserTabs onTabChange={handleTabChange} />
      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userType}>{item.type}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.placeholder}>No users found.</Text>}
        style={{ width: '100%' }}
      />
      <TouchableOpacity style={styles.fab} onPress={() => setShowCreate(true)}>
        <Icon name="add" size={32} color="#fff" />
      </TouchableOpacity>
      <Modal visible={showCreate} animationType="slide">
        <CreateUserScreen
          onClose={() => setShowCreate(false)}
          onCreate={user => {
            // Add user to Realm DB
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
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#f3f3f3',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
  },
  userType: {
    fontSize: 14,
    color: '#666',
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
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
