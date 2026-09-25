import { router } from 'expo-router'
import { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { supabase } from '../lib/supabase'

export default function RegisterScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Missing fields', 'Fill in all fields.')
      return
    }

    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match.')
      return
    }

    if (password.length < 6) {
      Alert.alert('Weak password', 'Use at least 6 characters.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    })

    setLoading(false)

    if (error) {
      Alert.alert('Registration failed', error.message)
      return
    }

    Alert.alert(
      'Account created',
      'If email confirmation is enabled in Supabase, verify your email first.'
    )

    router.replace('/login')
  }

  return (
     <ImageBackground source = {require('../assets/images/shark.pattern.jpg')} resizeMode = 'cover' style = {styles.image}>
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>✨Fun Shark Facts✨</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <Pressable style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>SIGN UP</Text>}
        </Pressable>

        <Pressable onPress={() => router.replace('/login')}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </Pressable>
      </View>
    </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    padding: 24,
  },
  card: {
    gap: 14,
    backgroundColor: '#C1D8DF',
    borderColor: '#3A7C85',
    borderWidth: 30,
    width: '100%', 
    maxWidth: 500,
    alignSelf: 'center',
    borderRadius: 50,
    padding: 10,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  title: {
    fontSize: 25,
    fontWeight: '500',
    marginBottom: 10,
    marginTop: 30,
    alignSelf: 'center',
  },
 input: {
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    alignSelf: 'center',
    width: '90%',
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#2A717B',
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 8, 
    paddingTop: 8,
    width: 200,
    height: 50,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 25,
    alignSelf: 'center',
   
  },
  link: {
    marginTop: 8,
    marginBottom: 15, 
    textAlign: 'center',
    color: '#1f6069',
    textDecorationLine: 'underline',
    fontSize: 15,
  },
})