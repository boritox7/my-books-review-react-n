import React, {useState,useEffect} from 'react';
import { Text } from '@rneui/themed';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './src/navigation/AuthNavigator';
import { onAuthStateChanged,getAuth } from "firebase/auth";
import { auth } from "./src/config/firebase";
import TabNavigator from './src/navigation/TabNavigator';

const Stack = createNativeStackNavigator();

export default function App() {
  const [cargando, setCargando] = useState(true);
  const [user, setUser] = useState(null);
 
  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setCargando(false);
    });
 
    return subscriber;
  }, [])

  if(cargando){
    return(<Text>cargando...</Text>)
  }
  
  const authenticated = true;
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={TabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}