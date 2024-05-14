import { View, Text, TextInput, StyleSheet, ActivityIndicator, Pressable, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../../../FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import axios from '../../../axios';
import { useUser } from '../../../UserContext'; 

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [birthday, setBirthday] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();
  const auth = FIREBASE_AUTH;

  const signUp = async () => {

    setLoading(true);
    
    try {

      const userData = {
        email: email,
        name: name,
        surname: surname,
        birthday: birthday
      };

      const response = await createUserWithEmailAndPassword(auth, userData.email, password)

      try {
        const response = await axios.post('/user', userData);
        console.log('User saved/updated in MongoDB:', response.data);
      } catch (error) {
        console.error('Error saving/updating user in MongoDB:', error);
      }

      setUser({
        email: userData.email,
        name: userData.name,
        surname: userData.surname,
        birthday: userData.birthday
      });

      console.log(response);
      alert('User successfully created!');

    } catch (error: any){

      alert('Sign up failed: ' + error.message);

    } finally {

      setLoading(false);
    }
  }

  const allFieldsFilled = email && password && name && surname && birthday;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Don't have an account yet?</Text>
      <KeyboardAvoidingView behavior='padding'>
        <TextInput value={email} style={styles.input} placeholder='Email' autoCapitalize='none' onChangeText={setEmail} />
        <TextInput secureTextEntry={true} value={password} style={styles.input} placeholder='Password' autoCapitalize='none' onChangeText={setPassword} />
        <TextInput value={name} style={styles.input} placeholder='Name' autoCapitalize='none' onChangeText={setName} />
        <TextInput value={surname} style={styles.input} placeholder='Surname' autoCapitalize='none' onChangeText={setSurname} />
        <TextInput value={birthday} style={styles.input} placeholder='Birthday' autoCapitalize='none' onChangeText={setBirthday} />
      
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Pressable style={[styles.button, styles.margin, !allFieldsFilled && { backgroundColor: 'grey' }]} onPress={signUp} disabled={!allFieldsFilled}>
            <Text style={styles.text}>Create Account</Text>
          </Pressable>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: 'center'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff'
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
    marginBottom: 10
  },
  text: {
    fontSize: 20,
    color: 'white', // Set text color to green
    textAlign: 'center' // Ensure text is centered within its container, useful in larger or multi-line text scenarios
  }
})