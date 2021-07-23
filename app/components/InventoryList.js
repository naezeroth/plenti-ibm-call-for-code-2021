import React, { useState } from "react";
import {
  Alert,
  RefreshControl,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import TouchableScale from "react-native-touchable-scale";

const InventoryList = (props) => {
  const {
    inventoryList,
    refreshInventory,
    visibleInventory,
    setVisibleInventory,
    inventoryOrder,
    setInventoryOrder,
    activeCategory,
    setActiveCategory,
    setSelectedItem,
    setAddModalVisible,
  } = props;


  const keyExtractor = (item, index) => index.toString();

  const renderItem = ({ item }) => (
    <ListItem
      containerStyle={styles.listItem}
      Component={TouchableScale}
      friction={90}
      tension={100}
      activeScale={0.95}
      onPress={() => {
        setSelectedItem(item.global_key);
        setAddModalVisible(true);
      }}
    >
      {item.emoji !== "" && <Text> {item.emoji} </Text>}
      <ListItem.Content>
        <ListItem.Title>
          <Text style={styles.text}>{item.name}</Text>
        </ListItem.Title>
        <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );

  const inventoryFilter = () => {
    if (activeCategory == null) {
      return inventoryList;
    } else {
      return inventoryList.filter(
        (item) => item.category == categories[activeCategory]
      );
    }
  };


  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={keyExtractor}
        data={visibleInventory}
        extraData={visibleInventory}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

// const ItemPage = (props, item) => {

// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    marginLeft: 30,
    marginRight: 15,
    justifyContent: "center",
    flexDirection: "row",
  },
  list: {
    // borderRadius: 20,
    // paddingTop: 50
  },
  listItem: {
    borderRadius: 10,
    marginRight: 15,
    marginTop: 7,
    marginBottom: 7,
    // shadowOffset:{  width: 10,  height: 10,  },
    // shadowColor: '#FFFFFF',
    // shadowRadius: 100,
    // shadowOpacity: 1,
  },
  text: {
    fontFamily: "SFProDisplay-Semibold",
    fontSize: 18,
    color: "#000",
  },
});

export default InventoryList;
