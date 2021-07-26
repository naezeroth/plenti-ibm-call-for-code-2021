import React, { useCallback } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { ListItem } from "react-native-elements";
import { categoryEmoji } from "./emoji";

const categories = [
  "meats",
  "dairy",
  "fruits",
  "vegetables",
  "grains",
  "beverages",
];

const CategoryList = (props) => {
  const { activeCategory, setActiveCategory } = props;

  const keyExtractor = (item, index) => index.toString();

  const renderItem = ({ item, index, activeCategory, setActiveCategory }) => (
    <ListItem
      underlayColor="transparent"
      containerStyle={
        activeCategory == index
          ? styles.categoryItemSelected
          : styles.categoryItem
      }
      onPress={() => {
        if (activeCategory == index) {
          setActiveCategory(null);
        } else {
          setActiveCategory(index);
        }
      }}
    >
      <Text style={styles.text}>{item + " " + categoryEmoji[item]}</Text>
    </ListItem>
  );

  const renderItemCallback = useCallback(({ item, index }) =>
    renderItem({ item, index, activeCategory, setActiveCategory })
  );

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
        ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
    maxHeight: 50,
  },
  list: {
    paddingLeft: 30,
    paddingRight: 30,
  },
  categoryItem: {
    borderRadius: 30,

    borderWidth: 2,
    borderColor: "black",
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: "#FAF6ED",
  },
  categoryItemSelected: {
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#4AC79F",
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: "#4AC79F",
  },
  text: {
    fontFamily: "SFProDisplay-Semibold",
    fontSize: 18,
    color: "#000",
  },
});

export default CategoryList;
