import React, { useState } from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";
import InventoryList from "../components/InventoryList";
import { Header } from "react-native-elements";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import CategoryList from "../components/CategoryList";
import { Feather } from "@expo/vector-icons";
import { AddModal } from "../components/AddModal";

const categories = [
  "meats",
  "dairy",
  "fruits",
  "vegetables",
  "grains",
  "beverages",
];

const purchaseDateComparator = (a, b) => a.purchase_date - b.purchase_date;
const recentComparator = (a, b) => b.purchase_date - a.purchase_date;

const expiryComparator = (a, b) => a.expiry_date - b.expiry_date;

const uneatenFilter = (item) => item.status == "uneaten";

export default function InventoryScreen(props) {
  const { inventoryList, refreshInventory, setInventoryList } = props;

  const [activeCategory, setActiveCategory] = React.useState(null);

  const [inventoryOrder, setInventoryOrder] = React.useState(null);

  const [addModalVisible, setAddModalVisible] = useState(false);
  //selectedItem of -1 means new item being added, otherwise editing exisiting item
  const [selectedItem, setSelectedItem] = React.useState(-1);

  const visibleInventoryInit = () =>
    activeCategory == null
      ? inventoryList
      : (item) => item.category == categories[activeCategory];

  const [visibleInventory, setVisibleInventory] =
    React.useState(visibleInventoryInit);

  // const [sortComparator, setSortComparator] = React.useState(recentComparator);

  // const updateVisibleInventory = React.useCallback((category) => {
  //   let filteredList = inventoryList.filter(item =>  (category==null ? true : item.category==categories[category]));
  //   filteredList.sort(purchaseDateComparator);
  //   setVisibleInventory(filteredList);
  // })

  // const filterInventory = React.useCallback(() => {
  //   if (activeCategory == null) { setVisibleInventory(inventoryList); }
  //   else { setVisibleInventory(inventoryList.filter(item => item.category == categories[activeCategory])); }
  // })

  // filterInventory();

  React.useEffect(() => {
    let filteredList = inventoryList.filter((item) =>
      activeCategory == null
        ? true
        : item.category == categories[activeCategory]
    );
    filteredList.sort(purchaseDateComparator);
    setVisibleInventory(filteredList);
  }, [inventoryList, activeCategory]);

  let updated_props = Object.assign({}, props, {
    activeCategory: activeCategory,
    setActiveCategory: setActiveCategory,
    inventoryOrder: inventoryOrder,
    setInventoryOrder: setInventoryOrder,
    visibleInventory: visibleInventory,
    setVisibleInventory: setVisibleInventory,
    // updateVisibleInventory: updateVisibleInventory,
  });

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
            <TouchableOpacity
              onPress={() => {
                console.log("Opening modal");
                setSelectedItem(-1);
                setAddModalVisible(!addModalVisible);
              }}
            >
              <AntDesign name="pluscircleo" size={30} color="black" />
            </TouchableOpacity>
          </View>
        }
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setAddModalVisible(!addModalVisible);
        }}
      >
        <AddModal
          selectedItem={selectedItem}
          localInventoryList={inventoryList}
          setSelectedItem={setSelectedItem}
          setModalVisible={setAddModalVisible}
          setLocalInventoryList={setInventoryList}
        />
      </Modal>
      {CategoryList(updated_props)}
      {InventoryList(updated_props)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: "#FAF6ED",
  },
  title: {
    fontFamily: "SFProDisplay-Heavy",
    fontSize: 24,
    color: "#000",
    paddingBottom: 1,
  },
});
