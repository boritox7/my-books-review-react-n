//import React from 'react';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Input } from '@rneui/themed';
import { auth } from "../../config/firebase";
import { signOut } from 'firebase/auth';

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
  return (  
    <View style={styles.container}>
      <Text h4 style={styles.title}>Mi Perfil</Text>
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