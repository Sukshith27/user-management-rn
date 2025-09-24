import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, FlatList } from 'react-native';
import { getRealm, User } from '../database/UserModel';

export default function UserListScreen() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      const realm = await getRealm();
      let realmUsers = realm.objects<User>('User');
      if (realmUsers.length === 0) {
        // Add mock users if DB is empty
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zeller Customers</Text>
      <Image
        source={require('../../zeller-customers-design.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userType}>{item.type}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.placeholder}>No users found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingTop: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  image: {
    width: 320,
    height: 180,
    marginBottom: 24,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 280,
    padding: 12,
    marginVertical: 4,
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
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
  },
});
