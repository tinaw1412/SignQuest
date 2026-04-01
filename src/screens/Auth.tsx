import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // login fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // signup fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  const handleLogin = async () => {
    const res = await signIn(username.trim(), password);
    if (!res.ok) Alert.alert('Login failed', res.message || 'Unknown error');
  };

  const handleSignup = async () => {
    const res = await signUp({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), username: signUpUsername.trim(), password: signUpPassword });
    if (!res.ok) Alert.alert('Sign up failed', res.message || 'Unknown error');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>SignQuest</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>{mode === 'login' ? 'Email' : 'First name'}</Text>

        {mode === 'login' ? (
          <>
            <TextInput placeholder="email or username" value={username} onChangeText={setUsername} style={styles.input} autoCapitalize="none" />
            <Text style={styles.cardLabel}>Password</Text>
            <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin} accessibilityRole="button">
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setMode('signup')}>
              <Text style={styles.link}>Create Account</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.link}>Forgot Password</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput placeholder="First name" value={firstName} onChangeText={setFirstName} style={styles.input} />
            <TextInput placeholder="Last name" value={lastName} onChangeText={setLastName} style={styles.input} />
            <Text style={styles.cardLabel}>Email</Text>
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
            <TextInput placeholder="Username" value={signUpUsername} onChangeText={setSignUpUsername} style={styles.input} autoCapitalize="none" />
            <TextInput placeholder="Password" value={signUpPassword} onChangeText={setSignUpPassword} style={styles.input} secureTextEntry />

            <TouchableOpacity style={styles.loginButton} onPress={handleSignup} accessibilityRole="button">
              <Text style={styles.loginButtonText}>Create account</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setMode('login')}>
              <Text style={styles.link}>Have an account? Log in</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#23254b', alignItems: 'center', justifyContent: 'center', padding: 20 },
  logo: {
    color: '#7fe9ff',
    fontSize: 44,
    fontWeight: '800',
    marginBottom: 18,
    textShadowColor: '#9ff3ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  card: {
    width: '86%',
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#6fb0ff',
    padding: 18,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  cardLabel: { color: '#cbd5ff', marginBottom: 6, fontSize: 14 },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 2, borderColor: '#000' },
  loginButton: { marginTop: 12, backgroundColor: '#fff', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 24, borderWidth: 2, borderColor: '#000', alignSelf: 'center' },
  loginButtonText: { color: '#000', fontSize: 16, fontWeight: '700' },
  link: { color: '#cbd5ff', textAlign: 'center', marginTop: 12, textDecorationLine: 'underline' },
});
