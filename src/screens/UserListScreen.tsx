import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

export default function UserListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zeller Customers</Text>
      <Image
        source={require('../../zeller-customers-design.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.placeholder}>User list will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  image: {
    width: 320,
    height: 320,
    marginBottom: 24,
  },
  placeholder: {
    fontSize: 16,
    color: '#888',
  },
});
