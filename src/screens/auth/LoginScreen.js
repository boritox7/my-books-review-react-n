import React, {useState} from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Input, Text } from '@rneui/themed';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,getAuth } from "firebase/auth";
import { auth } from "../../config/firebase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');

  async function signIn() {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
      throw new Error("Check your credentials or try again later");
    }
  }
   //Validacion de formato de email y contraseña que no este vacia 
   const validateLoginForm = () => {
    const isEmailValid = /\S+@\S+\.\S+/.test(email);
    const isPasswordValid = password.length > 0;
    return isEmailValid && isPasswordValid;
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>Iniciar Sesión</Text>
      <Input placeholder="Email" value={email}
        onChangeText={(value) => setEmail(value)} />
      <Input placeholder="Contraseña" secureTextEntry value={password} onChangeText={(value) => setPassword(value)}/>
      <Button 
        title="Iniciar Sesión" 
        containerStyle={styles.button} 
        disabled={!validateLoginForm()}
        onPress={signIn}/>
      <Button 
        title="¿No tienes cuenta? Regístrate" 
        type="clear"
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    marginVertical: 10,
  },
});