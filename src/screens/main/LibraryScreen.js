import React, {useState, useEffect} from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Image, Text, ListItem } from '@rneui/themed';


const Item = ({item}) => (
  <ListItem bottomDivider>
    <Image
      source={{ uri: item.imageLinks.thumbnail }}
      style={{ width: 80, height: 80 }}
    />
    <ListItem.Content>
      <ListItem.Title>{item.title}</ListItem.Title>
      <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle>
    </ListItem.Content>
  </ListItem>
);

export default function LibraryScreen() {
  const [books, setBooks] = useState([]);
  
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
        renderItem={({item}) => <Item key={item.id} item={item} />}
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