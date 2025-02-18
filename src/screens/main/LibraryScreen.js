import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Image, Text, ListItem, Button, Dialog, Input, AirbnbRating } from '@rneui/themed';
import { getDoc, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from "../../config/firebase";
import { createComponentForStaticNavigation } from '@react-navigation/native';

const Item = ({ item, onAgregarFavorito, onSelectBook }) => (
  <ListItem bottomDivider
    onPress={() => onSelectBook(item)}
  >
    <Image
      source={{ uri: item.imageLinks.thumbnail }}
      style={{ width: 80, height: 80 }}
    />
    <ListItem.Content>
      <ListItem.Title>{item.title}</ListItem.Title>
      <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle>
      <Button
        title="Mi favorito"
        onPress={() => onAgregarFavorito(item)}
      />
    </ListItem.Content>
  </ListItem>
);

export default function LibraryScreen() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [visible1, setVisible1] = useState(false);
  const [comentario, setComentario] = useState('');
  const [puntuacion, setPuntuacion] = useState(0);
  const [resenas, setResenas] = useState([]);

  const toggleDialog1 = () => {
    setVisible1(!visible1);
  };

  async function agregarFavorito(book) {
    try {
      const userRef = doc(db, 'usuarios', auth.currentUser.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const userProfile = docSnap.data();
        const favoritos = userProfile.favoritos ?? []

        if (!favoritos.some((f) => f.id === book.id)) {
          favoritos.push(book);
          await setDoc(doc(db, 'usuarios', auth.currentUser.uid), { ...userProfile, favoritos });
          Alert.alert("El libro fue agregado.")
        }
      }
    } catch (error) {
      console.error(error);
    }

  }
  function seleccionarLibro(book) {
    setSelectedBook(book);

    const resena = resenas.find((r) => r.id === book.id);
    setComentario(resena?.comentario ?? '');
    setPuntuacion(resena?.puntuacion ?? 0);

    toggleDialog1();
  }
  useEffect(() => {
    cargarLibros();
    const subscriber = onSnapshot(doc(db, 'usuarios', auth.currentUser.uid), (docSnap) => {
      if (docSnap.exists())
        setResenas(docSnap.data()?.resenas ?? []);
    });
  
    return subscriber;
  }, [])

  async function cargarLibros() {
    try {
      const response = await fetch('https://reactnd-books-api.udacity.com/books', {
        headers: { 'Authorization': 'texto' }
      });

      const jsonResponse = await response.json();
      setBooks(jsonResponse.books);
    } catch (error) {
      console.error(error);
    }
  }

  async function guardarResena() {
    try {
      const userRef = doc(db, 'usuarios', auth.currentUser.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const userProfile = docSnap.data();

        if (!resenas.some((f) => f.id === selectedBook.id)) {
          await setDoc(doc(db, 'usuarios', auth.currentUser.uid), { 
            ...userProfile, 
            resenas: [...resenas, { id: selectedBook.id, puntuacion, comentario }] 
          });
          Alert.alert("La reseña fue agregada.")
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      toggleDialog1();
    }
  }

  return (
    <View style={styles.container}>
      <Dialog
        isVisible={visible1}
        onBackdropPress={toggleDialog1}
      >
        <Dialog.Title title={selectedBook?.title} />
        <Text>Publicado: {selectedBook?.publishedDate}</Text>
        <Input placeholder='Que opinas del libro?' value={comentario} onChangeText={setComentario} />
        <AirbnbRating defaultRating={puntuacion} onFinishRating={(value) => setPuntuacion(value)} />
        <Button title="Guardar" onPress={guardarResena} />
      </Dialog>
      <FlatList
        data={books}
        renderItem={({ item }) => <Item key={item.id} item={item} onAgregarFavorito={agregarFavorito} onSelectBook={seleccionarLibro} />}
        keyExtractor={item => item.id} />
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