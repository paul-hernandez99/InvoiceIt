import { View, Text, TextInput, StyleSheet, ActivityIndicator, Button, Pressable, KeyboardAvoidingView } from 'react-native'
import React from 'react'
import { NavigationProp } from '@react-navigation/native';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const List = ({ navigation }: RouterProps) => {
  return (
    <View>
        <Pressable style={[styles.button, styles.margin]} onPress={() => navigation.navigate('Details')}>
            <Text style={styles.text}>Details</Text>
        </Pressable>
    </View>
  )
}

export default List;

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
      backgroundColor: '#00e400',
      borderRadius: 15,
      borderColor: 'black',
      borderWidth: 0.1,
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