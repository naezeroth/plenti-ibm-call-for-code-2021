import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View, Button } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements'
import TouchableScale from 'react-native-touchable-scale';
import { categoryEmoji } from './emoji';
import InventoryList from './InventoryList';


// const categories = [
//   {
//     name: 'meat',
//     emoji: 'hi',
//   },
//   {
//     name: 'dairy',
//     emoji: '',
//   },
//   {
//     name: 'grain',
//     emoji: '',
//   },
//   {
//     name: 'fruit',
//     emoji: '',
//   },
//   {
//     name: 'vegetables',
//     emoji: '',
//   },
//   {
//     name: 'beverages',
//     emoji: '',
//   },
// ]

const categories = [
  'meats', 'dairy', 'fruits', 'vegetables', 'grains', 'beverages'
]


const CategoryList = (props) => {

  const { inventoryList, refreshInventory,
    visibleInventory, setVisibleInventory,
    inventoryOrder, setInventoryOrder,
    activeCategory, setActiveCategory,
     } = props;

  const keyExtractor = (item, index) => index.toString();

  const renderItem = ({ item, index, activeCategory, setActiveCategory }) => (
    <ListItem
      underlayColor='transparent'
      containerStyle={ (activeCategory == index) ? styles.categoryItemSelected : styles.categoryItem }
      onPress={() => {
        if (activeCategory == index) {
          setActiveCategory(null);
          // setVisibleInventory(inventoryList);
          // updateVisibleInventory(null);
        }
        else {
          setActiveCategory(index);
          // setVisibleInventory(inventoryList.filter(item => item.category == categories[index]));
          // updateVisibleInventory(index);
        }
      }}
    >

      <Text style={styles.text}>{item + " " + categoryEmoji[item]}</Text>
      
      {/* <ListItem.Content>
        <ListItem.Title>{item.name}</ListItem.Title>
      </ListItem.Content> */}
    </ListItem>
  );

  const renderItemCallback = useCallback( ({ item, index }) =>
    renderItem({ item, index, activeCategory, setActiveCategory })
  )


  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={keyExtractor}
        data={categories}
        extraData={activeCategory}
        renderItem={renderItemCallback}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={ () => (<View style={{width: 10, }}/>) }
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
    paddingLeft:30,
    paddingRight:30,
  },
  categoryItem: {
    borderRadius: 30,
    // marginLeft: 10,
    // marginTop: 7,
    // marginBottom: 7,
    borderWidth: 2,
    borderColor: "black",
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: '#FAF6ED',
  },
  categoryItemSelected: {
    borderRadius: 30,
    // marginLeft: 10,
    // marginTop: 7,
    // marginBottom: 7,
    borderWidth: 2,
    borderColor: "#4AC79F",
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: '#4AC79F',
  },
  text: {
    fontFamily: 'SFProDisplay-Semibold',
    fontSize: 18,
    color: '#000'
  }
});


export default CategoryList;