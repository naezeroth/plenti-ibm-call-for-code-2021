import React, { useState } from "react";
import { Alert, RefreshControl, StyleSheet, Text, View } from "react-native";
import { ListItem, Button, Image } from "react-native-elements";
import TouchableScale from "react-native-touchable-scale";
import { SwipeListView } from "react-native-swipe-list-view";
import { TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

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
    setInventoryList,
    updateInventoryToggle,
    setUpdateInventoryToggle,
  } = props;

  const keyExtractor = (item, index) => String(item.global_key);

  const renderItem = ({ item }) => {
    const style = item.frozen
      ? { ...styles.listItem, backgroundColor: "#CDE7FB" }
      : styles.listItem;
    return (
      <ListItem
        containerStyle={style}
        Component={TouchableScale}
        friction={90}
        tension={100}
        activeScale={0.98}
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
  };

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
      <SwipeListView
        keyExtractor={keyExtractor}
        data={visibleInventory}
        extraData={visibleInventory}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        renderHiddenItem={(data, rowMap) => (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#F76D60",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 7,
                marginBottom: 7,
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
                width: 80,
              }}
              onPress={() => {
                console.log(
                  "Discarding",
                  data.item.global_key,
                  setInventoryList,
                  inventoryList
                );
                inventoryList[data.item.global_key].status = "discarded";
                setInventoryList(inventoryList);
                setUpdateInventoryToggle(!updateInventoryToggle);
              }}
            >
              <FontAwesome5 name="trash" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#4CBAF9",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 15,
                marginTop: 7,
                marginBottom: 7,
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
                width: 80,
              }}
              onPress={() => {
                console.log("Freezing", data.item.global_key);
                inventoryList[data.item.global_key].frozen =
                  !inventoryList[data.item.global_key].frozen;
                setInventoryList(inventoryList);
                setUpdateInventoryToggle(!updateInventoryToggle);
              }}
            >
              <Image
                source={require("../assets/freeze.png")}
                style={{ width: 30, height: 30 }}
              />
            </TouchableOpacity>
          </View>
        )}
        leftOpenValue={75}
        rightOpenValue={-75}
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
