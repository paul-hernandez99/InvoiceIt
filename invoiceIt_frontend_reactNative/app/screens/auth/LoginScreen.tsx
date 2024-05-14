import { View, Text, Image,TextInput, StyleSheet, ActivityIndicator, Button, Pressable, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../../../FirebaseConfig';
import { NavigationProp } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import IMAGES from '../../../assets/images';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Login = ({ navigation }: RouterProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signIn = async () => {

    setLoading(true);

    try {

      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response)

    } catch (error: any) {

      console.log(error)
      alert('Sign in failed: ' + error.message);
    
    } finally {

      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Image source={IMAGES.LOGO}/>
      <Text style={styles.header1}>Hello Again!</Text>
      <Text style={styles.header2}>Welcome back you've been missed!</Text>
      <KeyboardAvoidingView behavior='padding'>
        <TextInput value={email} style={styles.input} placeholder='Email' autoCapitalize='none' onChangeText={(text) => setEmail(text)}></TextInput>
        <TextInput secureTextEntry={true} value={password} style={styles.input} placeholder='Password' autoCapitalize='none' onChangeText={(text) => setPassword(text)}></TextInput>
      
        { loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <Pressable style={[styles.button, styles.margin]} onPress={signIn}>
              <Text style={styles.text}>Sign In</Text>
            </Pressable>
            <View style={styles.line} />
            <Text style={[styles.register_text, styles.register_margin]}>Not a member?  <Pressable onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.register_link}>Register now</Text>
            </Pressable></Text>

          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: 'center'
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
    marginBottom: 20
  },
  register_margin: {
    marginTop: 25
  },
  header1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 20,
    textAlign: 'center'
  },
  header2: {
    fontSize: 24,
    marginBottom: 30,
    textAlign: 'center'
  },
  text: {
    fontSize: 20,
    color: 'white', // Set text color to green
    textAlign: 'center' // Ensure text is centered within its container, useful in larger or multi-line text scenarios
  },
  register_text: {
    fontSize: 20,
    color: 'black', 
    textAlign: 'center'
  },
  register_link: {
    fontSize: 20,
    color: 'orange', // Set text color to green
    textAlign: 'center'
  },
  line: {
    marginTop: 20,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    width: '100%' // Adjust width as per requirement
  }
})