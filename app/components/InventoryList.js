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
    const itemStyle = item.frozen
      ? { ...styles.listItem, backgroundColor: "#CDE7FB" }
      : styles.listItem;

    const expiryStyle = (() => {
      let daysLeft = Math.round((new Date(item.expiry_date) - new Date())/(1000*60*60*24))
      console.log("DAYS LEFT ", daysLeft);

      if (daysLeft <= 2) { return { ...styles.expiryCircle, backgroundColor: "#F76D60" } }
      else if (daysLeft <= 7) { return { ...styles.expiryCircle, backgroundColor: "#FECC66" } }
      else { return { ...styles.expiryCircle, backgroundColor: "#4AC79F" } }
    })();


    return (
      <ListItem
        containerStyle={itemStyle}
        Component={TouchableScale}
        friction={90}
        tension={100}
        activeScale={0.98}
        onPress={() => {
          setSelectedItem(item.global_key);
          setAddModalVisible(true);
        }}
      >
        {item.emoji !== "" && <Text style={{fontSize:24}}> {item.emoji} </Text>}
        <ListItem.Content>
          <ListItem.Title>
            <Text style={styles.text}>{item.name}</Text>
          </ListItem.Title>
          {/* <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle> */}
        </ListItem.Content>
        <View style={expiryStyle} />
      </ListItem>
    );
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
    // justifyContent: "center",
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
  expiryCircle: {
    width: 20,
    height: 20,
    borderRadius: 20/2,
    backgroundColor: "red",
  }
});

export default InventoryList;
