import React, {useState, useEffect} from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Image, Text, ListItem, Button } from '@rneui/themed';
import { getDoc, doc, setDoc} from 'firebase/firestore';
import {auth,db} from "../../config/firebase";

const Item = ({item, onAgregarFavorito}) => (
  <ListItem bottomDivider>
    <Image
      source={{ uri: item.imageLinks.thumbnail }}
      style={{ width: 80, height: 80 }}
    />
    <ListItem.Content>
      <ListItem.Title>{item.title}</ListItem.Title>
      <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle>
      <Button
        title="agregar"
        onPress={()=> onAgregarFavorito(item)}
      />
    </ListItem.Content>
  </ListItem>
);

export default function LibraryScreen() {
  const [books, setBooks] = useState([]);
  
  async function agregarFavorito(book){
    try {
      const userRef = doc(db, 'usuarios', auth.currentUser.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const userProfile = docSnap.data();
        const favoritos = userProfile.favoritos ?? []

        if(!favoritos.some((f)=>f.id === book.id)){
          favoritos.push(book); 
          await setDoc(doc(db, 'usuarios', auth.currentUser.uid),{...userProfile, favoritos});
          Alert.alert("El libro fue agregado.")
        }
      }
    } catch (error) {
      console.error(error);
    }
    
  }

  useEffect(()=>{
    cargarLibros()
  },[])

  async function cargarLibros(){
    try {
      const response = await fetch('https://reactnd-books-api.udacity.com/books', {
        headers: {'Authorization': 'texto'}
      });

      const jsonResponse = await response.json();
      setBooks(jsonResponse.books);
    } catch (error) {
      console.error(error);
  }

  }
  return (
    <View style={styles.container}>
      <FlatList 
        data={books}
        renderItem={({item}) => <Item key={item.id} item={item} onAgregarFavorito={agregarFavorito}/>}
        keyExtractor={item => item.id}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});