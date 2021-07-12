import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements'
import TouchableScale from 'react-native-touchable-scale';


const list = [
  {
    name: '🍌bananas🍌',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
    subtitle: '2'
  },
  {
    name: '🍌bananas🍌',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
    subtitle: '5'
  },
  {
    name: '🍌bananas🍌',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
    subtitle: '2'
  },
  {
    name: '🍌bananas🍌',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
    subtitle: '5'
  },
  {
    name: '🍌bananas🍌',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
    subtitle: '2'
  },
  {
    name: '🍌bananas🍌',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
    subtitle: '5'
  },
  {
    name: '🍌bananas🍌',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
    subtitle: '2'
  },
  {
    name: '🍌bananas🍌',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
    subtitle: '5'
  },
  {
    name: '🍌bananas🍌',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
    subtitle: '2'
  },
  {
    name: '🍌bananas🍌',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
    subtitle: '5'
  },
  {
    name: '🍌bananas🍌',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
    subtitle: '2'
  },
  {
    name: '🍌bananas🍌',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
    subtitle: '5'
  },
  {
    name: '🍌bananas🍌',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
    subtitle: '2'
  },
  {
    name: '🍌bananas🍌',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
    subtitle: '5'
  },
  {
    name: '🍌bananas🍌',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
    subtitle: '2'
  },
  {
    name: '🍌bananas🍌',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
    subtitle: '5'
  },
]

keyExtractor2 = (item, index) => index.toString()

renderItem2 = ({item}) => (
  <ListItem
    containerStyle={styles.categoryItem}
  >
    <Text style={styles.text}>{item.name}</Text>
    {/* <ListItem.Content>
      <ListItem.Title>{item.name}</ListItem.Title>
    </ListItem.Content> */}
  </ListItem>
)

const CategoryList = () => {
  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={keyExtractor2}
        data={list}
        renderItem={renderItem2}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 0,
    // marginLeft: 30,
    // marginRight: 30,
    paddingTop: 5,
    maxHeight: 50,
  },
  list: {
    // borderRadius: 20,
    // paddingTop: 50
  },
  categoryItem: {
    borderRadius: 30,
    marginLeft: 10,
    // marginTop: 7,
    // marginBottom: 7,
    borderWidth: 2,
    borderColor: "black",
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: '#FAF6ED',
  },
  text: {
    fontFamily: 'SFProDisplay-Semibold',
    fontSize: 18,
    color: '#000'
  }
});


export default CategoryList;