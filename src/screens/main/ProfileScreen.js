import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button, Input } from '@rneui/themed';
import { auth } from "../../config/firebase";
import { signOut } from 'firebase/auth';
import { db } from "../../config/firebase";
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function ProfileScreen({ navigation }) {
  
  const [profile, setProfile] = useState({
    nombre: ''
    ,
    apellido: ''
  });
  useEffect(() => {
    loadProfile();
  }, []);
 
  const loadProfile = async () => {
    try {
        const docRef = doc(db, 'usuarios', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setProfile(docSnap.data());
        }
    } catch (error) {
        console.error('Error al cargar perfil:', error);
    }
};

  //manejo de cerrar sesion.
  const handleSignOut = async () => {
    try {
        await signOut(auth);
        navigation.replace('Main');
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
  };
  // actualiza los datos del user.
  const handleUpdate = async () => {
    try {
        await setDoc(doc(db, 'usuarios', auth.currentUser.uid), profile);
        alert('Perfil actualizado exitosamente');
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        alert('Error al actualizar perfil');
    }
  };
  return (  
    <View style={styles.container}>
             <Image
                source={profile.image}
                style={{ width: 100, height: 100 }}
             />
            <Input
                placeholder="Nombre"
                value={profile.nombre}
                onChangeText={(text) => setProfile({ ...profile, nombre: text })}
            />
            <Input
                placeholder="Apellido"
                value={profile.apellido}
                onChangeText={(text) => setProfile({ ...profile, apellido: text })}
        />
      <Button 
        title="Cerrar Sesión" 
        type="outline"
        onPress={handleSignOut}
        containerStyle={styles.button}
      />
      <Button
                title="Actualizar Perfil"
                onPress={handleUpdate}
                containerStyle={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  button: {
    marginTop: 20,
  },
});