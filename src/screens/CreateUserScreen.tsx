import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ROLES = ['Admin', 'Manager'];

export default function CreateUserScreen({ onClose, onCreate }: { onClose: () => void; onCreate: (user: any) => void }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Admin' | 'Manager'>('Admin');
  const [error, setError] = useState<string | null>(null);

  function validate() {
    if (!firstName.trim() || !lastName.trim()) {
      return 'Name cannot be empty.';
    }
    if (!/^[A-Za-z ]+$/.test(firstName) || !/^[A-Za-z ]+$/.test(lastName)) {
      return 'Name can only contain alphabets and spaces.';
    }
    if (firstName.length > 50 || lastName.length > 50) {
      return 'Name must not exceed 50 characters.';
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return 'Email is not valid.';
    }
    return null;
  }

  function handleCreate() {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    onCreate({ firstName, lastName, email, role });
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
        <Icon name="close" size={28} color="#333" />
      </TouchableOpacity>
      <Text style={styles.headline}>New User</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={styles.roleTabs}>
        {ROLES.map(r => (
          <TouchableOpacity
            key={r}
            style={[styles.roleTab, role === r && styles.activeRoleTab]}
            onPress={() => setRole(r as 'Admin' | 'Manager')}
          >
            <Text style={[styles.roleText, role === r && styles.activeRoleText]}>{r}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
        <Text style={styles.createBtnText}>Create User</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  closeIcon: {
    position: 'absolute',
    top: 32,
    left: 16,
    zIndex: 2,
  },
  headline: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  roleTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  roleTab: {
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 20,
    backgroundColor: '#f3f3f3',
    marginHorizontal: 8,
  },
  activeRoleTab: {
    backgroundColor: '#007AFF',
  },
  roleText: {
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
  },
  activeRoleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  createBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  createBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontSize: 15,
    marginBottom: 12,
    textAlign: 'center',
  },
});
