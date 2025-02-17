import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Input, Text } from '@rneui/themed';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../../config/firebase";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //nueva variable para verificar coincidencia
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async () => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#.$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        //verifica si corresponde al formato de email
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Por favor, ingresa un email válido.");
            return;
        }
        //verifica la validacion de la contraseña
        if (!passwordRegex.test(password)){
            setError("La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial");
            return;
        }
        // validacion de coincidencia de las claves
        if(password!=password2){
            setError("Las contraseñas no coinciden");
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            navigation.replace('Home');
        } catch (error) {
            setError('Error al registrarse: ' + error.message);
        }
    };
  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>Registro</Text>
      <Input placeholder="Email" 
         value={email}
         onChangeText={setEmail}
         autoCapitalize="none"
      />
      <Input placeholder="Contraseña" 
        value={password}
        onChangeText={setPassword}
        secureTextEntry />
      <Input placeholder="Confirmar Contraseña"
        value={password2}
        onChangeText={setPassword2}
        secureTextEntry />
      {error ? <Text style={styles.error}>{error}</Text> : null} 
      
      <Button 
        title="Registrarse"
        onPress={handleRegister} 
        containerStyle={styles.button} 
      />
      
      <Button 
        title="¿Ya tienes cuenta? Inicia sesión" 
        type="clear"
        onPress={() => navigation.navigate('Login')}
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