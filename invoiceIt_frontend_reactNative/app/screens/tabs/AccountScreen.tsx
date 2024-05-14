import { View, Text, Pressable, StyleSheet, Image} from 'react-native'
import React from 'react'
import { FIREBASE_AUTH } from '../../../FirebaseConfig';
import { useUser } from '../../../UserContext';

const AccountScreen = () => {

  const { user } = useUser(); // Using the custom hook to access the user context

  // Function to generate greeting based on the time of day
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No user data available. Please log in.</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>{getTimeBasedGreeting()}, {user.name}!</Text>
      <Image style={styles.avatar} source={{ uri: 'https://via.placeholder.com/150' }} />
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.info}>{user.email}</Text>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.info}>{user.name}</Text>
        <Text style={styles.label}>Surname</Text>
        <Text style={styles.info}>{user.surname}</Text>
        <Text style={styles.label}>Birthday</Text>
        <Text style={styles.info}>{user.birthday}</Text>
      </View>
      <Pressable style={styles.button} onPress={() => FIREBASE_AUTH.signOut()}>
        <Text style={styles.text1}>Log Out</Text>
      </Pressable>
    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f4f4'
  },
  container1: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center', // This centers the text horizontally in the button
    justifyContent: 'center',
    backgroundColor: 'orange',
    borderRadius: 15,
    padding: 10
  },
  margin: {
    marginTop: 15,
    marginBottom: 20
  },
  text1: {
    fontSize: 20,
    color: 'white', // Set text color to green
    textAlign: 'center' // Ensure text is centered within its container, useful in larger or multi-line text scenarios
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333'
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20
  },
  infoContainer: {
    alignItems: 'flex-start',
    width: '100%'
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginTop: 10
  },
  info: {
    fontSize: 18,
    color: '#000'
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  }
});