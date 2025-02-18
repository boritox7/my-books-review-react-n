import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Input, Text } from '@rneui/themed';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, storage, db } from "../../config/firebase"; // Importamos Storage y Firestore
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [image, setImage] = useState(null);

  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  
  const uploadImage = async (userId) => {
    if (!image) return null;

    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const storageRef = ref(storage, `profile_pictures/${userId}.jpg`);
      await uploadBytes(storageRef, blob);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Error al subir imagen:", error);
      return null;
    }
  };

  
  const handleRegister = async () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#.$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Por favor, ingresa un email válido.");
      return;
    }
    if (!passwordRegex.test(password)) {
      setError("La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial");
      return;
    }
    if (password !== password2) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
      const imageUrl = await uploadImage(userId);
      await setDoc(doc(db, "usuarios", userId), {
        email,
        profilePicture: imageUrl || null
      });

      navigation.replace('Home');
    } catch (error) {
      setError('Error al registrarse: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>Registro</Text>
      
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Seleccionar Imagen" onPress={pickImage} />
      <Input placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <Input placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
      <Input placeholder="Confirmar Contraseña" value={password2} onChangeText={setPassword2} secureTextEntry />
      
      {error ? <Text style={styles.error}>{error}</Text> : null} 

      <Button title="Registrarse" onPress={handleRegister} containerStyle={styles.button} />
      <Button title="¿Ya tienes cuenta? Inicia sesión" type="clear" onPress={() => navigation.navigate('Login')} />
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
  image: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    borderRadius: 50,
    marginBottom: 10,
  },
});
