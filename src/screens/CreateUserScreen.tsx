import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated } from 'react-native';

const ROLES = ['Admin', 'Manager'];
const TAB_WIDTH = 120;

export default function CreateUserScreen({ onClose, onCreate }: { onClose: () => void; onCreate: (user: any) => void }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Admin' | 'Manager'>('Admin');
  const [error, setError] = useState<string | null>(null);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const indicator = useRef(new Animated.Value(0)).current;

  function validate() {
    if (!firstName.trim()) {
      setFirstNameError(true);
      setError('First name cannot be empty.');
      return false;
    }
    setFirstNameError(false);
    if (!lastName.trim()) {
      setLastNameError(true);
      setError('Last name cannot be empty.');
      return false;
    }
    setLastNameError(false);
    if (!/^[A-Za-z ]+$/.test(firstName) || !/^[A-Za-z ]+$/.test(lastName)) {
      setError('Name can only contain alphabets and spaces.');
      return false;
    }
    if (firstName.length > 50 || lastName.length > 50) {
      setError('Name must not exceed 50 characters.');
      return false;
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Email is not valid.');
      return false;
    }
    setError(null);
    return true;
  }

  function handleCreate() {
    if (!validate()) return;
    onCreate({ firstName, lastName, email, role });
  }

  const handleRoleTab = (idx: number) => {
    setRole(ROLES[idx] as 'Admin' | 'Manager');
    Animated.timing(indicator, {
      toValue: idx * TAB_WIDTH,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const activeIdx = ROLES.indexOf(role);

  return (
    <View style={styles.modalBg}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
          <Text style={styles.closeIconText}>×</Text>
        </TouchableOpacity>
        <Text style={styles.headline}>New User</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TextInput
          style={[styles.input, firstNameError && styles.inputError]}
          placeholder="First Name"
          placeholderTextColor="#bbb"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={[styles.input, lastNameError && styles.inputError]}
          placeholder="Last Name"
          placeholderTextColor="#bbb"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#bbb"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={styles.roleLabel}>User Role</Text>
        <View style={styles.roleTabsRow}>
          <View style={styles.roleTabsContainer}>
            {ROLES.map((r, idx) => (
              <TouchableOpacity
                key={r}
                style={styles.roleTab}
                onPress={() => handleRoleTab(idx)}
              >
                <Text style={[styles.roleText, activeIdx === idx && styles.activeRoleText]}>{r}</Text>
              </TouchableOpacity>
            ))}
            <Animated.View
              style={[styles.roleIndicator, { left: indicator }]}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
          <Text style={styles.createBtnText}>Create User</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '92%',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  closeIcon: {
    position: 'absolute',
    top: 32,
    left: 16,
    zIndex: 2,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIconText: {
    color: '#007AFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  headline: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 2,
  },
  roleLabel: {
    fontSize: 15,
    color: '#222',
    marginBottom: 8,
    marginTop: 8,
    fontWeight: '500',
  },
  roleTabsRow: {
    marginTop: 8,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleTabsContainer: {
    flexDirection: 'row',
    position: 'relative',
    backgroundColor: '#f3f3f3',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  roleTab: {
    width: TAB_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 22,
    zIndex: 1,
  },
  roleText: {
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  activeRoleText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  roleIndicator: {
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
  createBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    marginTop: 16,
  },
  createBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  error: {
    color: 'red',
    fontSize: 15,
    marginBottom: 12,
    textAlign: 'center',
  },
});
