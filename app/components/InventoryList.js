import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements'
import TouchableScale from 'react-native-touchable-scale';

const styles = StyleSheet.create({
    container: {
     flex: 1,
     paddingTop: 22
    }
});

const list = [
  {
    name: '🍌🍌🍌Bananas1🍌🍌🍌',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
    subtitle: '2'
  },
  {
    name: '🍌🍌🍌Bananas2🍌🍌🍌',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
    subtitle: '5'
  },
  {
    name: '🍌🍌🍌Bananas1🍌🍌🍌',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
    subtitle: '2'
  },
  {
    name: '🍌🍌🍌Bananas2🍌🍌🍌',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
    subtitle: '5'
  },
  {
    name: '🍌🍌🍌Bananas1🍌🍌🍌',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
    subtitle: '2'
  },
  {
    name: '🍌🍌🍌Bananas2🍌🍌🍌',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
    subtitle: '5'
  },
  {
    name: '🍌🍌🍌Bananas1🍌🍌🍌',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
    subtitle: '2'
  },
  {
    name: '🍌🍌🍌Bananas2🍌🍌🍌',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
    subtitle: '5'
  },
  {
    name: '🍌🍌🍌Bananas1🍌🍌🍌',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
    subtitle: '2'
  },
  {
    name: '🍌🍌🍌Bananas2🍌🍌🍌',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
    subtitle: '5'
  },
  {
    name: '🍌🍌🍌Bananas1🍌🍌🍌',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
    subtitle: '2'
  },
  {
    name: '🍌🍌🍌Bananas2🍌🍌🍌',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
    subtitle: '5'
  },
  {
    name: '🍌🍌🍌Bananas1🍌🍌🍌',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
    subtitle: '2'
  },
  {
    name: '🍌🍌🍌Bananas2🍌🍌🍌',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
    subtitle: '5'
  },
  {
    name: '🍌🍌🍌Bananas1🍌🍌🍌',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
    subtitle: '2'
  },
  {
    name: '🍌🍌🍌Bananas2🍌🍌🍌',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
    subtitle: '5'
  },
]

keyExtractor = (item, index) => index.toString()

renderItem = ({item}) => (
  <ListItem
    borderRadius={20}
    bottomDivider
    // style={{borderRadius: 50}}
    Component={TouchableScale} 
    friction={90}
    tension={100}
    activeScale={0.95}
  >
    <Avatar rounded title={item.name[0]} source={item.avatar_url && { uri: item.avatar_url }}/>
    <ListItem.Content>
      <ListItem.Title>{item.name}</ListItem.Title>
      <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle>
    </ListItem.Content>
    <ListItem.Chevron />
  </ListItem>
)

const InventoryList = () => {
    return (
        <View style={styles.container}>
          <FlatList
            keyExtractor={keyExtractor}
            data={list}
            renderItem={renderItem}
            extraData={this.state}
          />
        </View>
    );
}

export default InventoryList;