import React from "react";
import { StyleSheet, Text, View } from "react-native";
import InventoryList from "../components/InventoryList";
import { Header } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import CategoryList from "../components/CategoryList";
import { Feather } from "@expo/vector-icons";

export default function InventoryScreen(props) {
  return (
    <View style={styles.container}>
      <Header
        // style={styles.header}
        placement="left"
        backgroundColor="#FAF6ED"
        // leftComponent={{ icon: 'menu', color: '#fff' }}
        centerComponent={{
          text: "Your Inventory",
          style: styles.title,
        }}
        rightComponent={
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Feather name="search" size={32} color="black" />
            <Ionicons name="add-circle-outline" size={32} color="black" />
          </View>
        }
      />

      {CategoryList(props)}
      {InventoryList(props)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: "#FAF6ED",
  },
  // header: {
  //   fontSize: 32,
  //   backgroundColor: '#fff',
  //   color: '#000'
  // },
  title: {
    fontFamily: "SFProDisplay-Heavy",
    fontSize: 24,
    color: "#000",
  },
});
