import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { ListItem, Button, Image } from "react-native-elements";
import TouchableScale from "react-native-touchable-scale";
import { SwipeListView } from "react-native-swipe-list-view";
import { TouchableOpacity } from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";

const InventoryList = (props) => {
  const {
    inventoryList,
    visibleInventory,
    setSelectedItem,
    setAddModalVisible,
    setInventoryList,
    updateInventoryToggle,
    setUpdateInventoryToggle,
    selectMode,
    selected,
    toggleSelected,
  } = props;

  const keyExtractor = (item, index) => String(item.global_key);

  const renderItem = ({ item }) => {
    let daysLeft = Math.round(
      (new Date(item.expiry_date) - new Date()) / (1000 * 60 * 60 * 24)
    );

    const itemStyle = (() => {
      if (selected.has(item.global_key)) {
        return { ...styles.listItem, backgroundColor: "#E5E5E5" };
      } else if (item.frozen) {
        return { ...styles.listItem, backgroundColor: "#CDE7FB" };
      } else {
        return styles.listItem;
      }
    })();

    const expiryStyle = (() => {
      if (daysLeft <= 2) {
        return { ...styles.expiryCircle, backgroundColor: "#F76D60" };
      } else if (daysLeft <= 7) {
        return { ...styles.expiryCircle, backgroundColor: "#FECC66" };
      } else {
        return { ...styles.expiryCircle, backgroundColor: "#4AC79F" };
      }
    })();

    const Subtitle = () => {
      if (item.frozen) {
        return (
          <ListItem.Subtitle
            style={{
              color: "rgba(0, 0, 0, 0.49)",
              fontSize: 12,
              fontWeight: "600",
            }}
          >
            may expire soon
          </ListItem.Subtitle>
        );
      } else if (daysLeft <= 2) {
        return (
          <ListItem.Subtitle
            style={{ color: "#F76D60", fontSize: 12, fontWeight: "600" }}
          >
            check on it now!
          </ListItem.Subtitle>
        );
      }
      return null;
    };



    return (
      <ListItem
        containerStyle={itemStyle}
        Component={TouchableScale}
        friction={90}
        tension={100}
        activeScale={0.98}
        onPress={
          selectMode
            ? () => toggleSelected(item.global_key)
            : () => {
                setSelectedItem(item.global_key);
                setAddModalVisible(true);
              }
        }
      >
        <Text style={{ fontSize: 30, marginRight: -10, marginLeft: -5 }}>
          {item.emoji ? item.emoji : " "}
        </Text>
        <ListItem.Content>
          <ListItem.Title>
            <Text style={styles.text}>{item.item_class}</Text>
            {/* <Text style={styles.text}>{item.item_class.charAt(0).toUpperCase() + item.item_class.slice(1)}</Text> */}
          </ListItem.Title>
          <ListItem.Subtitle
            style={{
              color: "black",
              fontSize: 12,
              fontWeight: "600",
            }}
          >
            {item.name}
          </ListItem.Subtitle>
          <Subtitle />
        </ListItem.Content>
        {item.frozen && (
          <View style={{ marginRight: -10 }}>
            <Text style={{ fontSize: 20 }}>🥶</Text>
          </View>
        )}
        {selected.has(item.global_key) && (
          <View
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              height: 24,
              width: 24,
              borderRadius: 20,
              backgroundColor: "white",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 2,
            }}
          >
            <View
              style={{
                height: 20,
                width: 20,
                borderRadius: 20,
                backgroundColor: "#4CBAF9",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Entypo name="check" size={16} color="white" />
            </View>
          </View>
        )}
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
                backgroundColor: "#4AC79F",
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
                  "Eatin",
                  data.item.global_key,
                  setInventoryList,
                  inventoryList
                );
                inventoryList[data.item.global_key].status = "eaten";
                setInventoryList(inventoryList);
                setUpdateInventoryToggle(!updateInventoryToggle);
              }}
            >
              <AntDesign name="check" size={24} color="white" />
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
  listItem: {
    borderRadius: 10,
    marginRight: 15,
    marginTop: 7,
    marginBottom: 7,
  },
  text: {
    fontFamily: "SFProDisplay-Semibold",
    fontSize: 18,
    color: "#000",
  },
  expiryCircle: {
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    backgroundColor: "red",
  },
});

export default InventoryList;
