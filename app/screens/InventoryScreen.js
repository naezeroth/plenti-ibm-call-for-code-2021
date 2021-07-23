import React, { useState } from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";
import InventoryList from "../components/InventoryList";
import { Header } from "react-native-elements";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
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

const priceComparator = (a, b) => b.price - a.price;

const purchaseDateComparator = (a, b) => a.purchase_date - b.purchase_date;
const recentComparator = (a, b) => b.purchase_date - a.purchase_date;

const uneatenFilter = (item) => item.status == "uneaten";

export default function InventoryScreen(props) {
  const {
    inventoryList,
    refreshInventory,
    setInventoryList,
    updateInventoryToggle,
    setUpdateInventoryToggle,
  } = props;

  const [activeCategory, setActiveCategory] = React.useState(null);

  const [inventoryOrder, setInventoryOrder] = React.useState(null);

  const [addModalVisible, setAddModalVisible] = useState(false);
  //selectedItem of -1 means new item being added, otherwise editing exisiting item
  const [selectedItem, setSelectedItem] = React.useState(-1);

  const [visibleInventory, setVisibleInventory] = React.useState([]);

  const [sortComparator, setSortComparator] = React.useState(
    () => recentComparator
  );

  // const [comparatorIndex, setComparatorIndex] = React.useState(0);

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
    if (inventoryList !== undefined) {
      let visibleList = JSON.parse(JSON.stringify(inventoryList));
      visibleList.map((element, index) => {
        element.global_key = index;
      });
      visibleList = visibleList.filter(
        (item) =>
          uneatenFilter(item) &&
          (activeCategory == null
            ? true
            : item.category == categories[activeCategory])
      );
      visibleList.sort(sortComparator);
      // console.log(visibleList);
      setVisibleInventory(visibleList);
    }
  }, [
    inventoryList,
    activeCategory,
    sortComparator,
    addModalVisible,
    updateInventoryToggle,
  ]);

  let updated_props = Object.assign({}, props, {
    activeCategory: activeCategory,
    setActiveCategory: setActiveCategory,
    inventoryOrder: inventoryOrder,
    setInventoryOrder: setInventoryOrder,
    visibleInventory: visibleInventory,
    setVisibleInventory: setVisibleInventory,
    setSelectedItem: setSelectedItem,
    setAddModalVisible: setAddModalVisible,
    setInventoryList: setInventoryList,
    inventoryList: inventoryList,
    setUpdateInventoryToggle: setUpdateInventoryToggle,
    updateInventoryToggle: updateInventoryToggle,
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
          setUpdateInventoryToggle={setUpdateInventoryToggle}
          updateInventoryToggle={updateInventoryToggle}
        />
      </Modal>
      {CategoryList(updated_props)}

      <View style={styles.sortMethodRow}>
        {/* <Button
          style={{backgroundColor: "#FAF6ED"}}
          color="#FAF6ED"
          title="Recently added"
        /> */}

        <FontAwesome name="sort-amount-asc" size={18} color="black" />

        <TouchableOpacity
          // style={{}}
          onPress={() => console.log("Pressed")}
        ></TouchableOpacity>

        <Text style={styles.sortMethodHeader}>Recently added</Text>

        <View style={{ flex: 1 }}>
          <FontAwesome
            name="list"
            size={18}
            color="black"
            style={{ alignSelf: "flex-end" }}
          />
        </View>
      </View>

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
  sortMethodRow: {
    marginTop: 5,
    height: 30,
    flexDirection: "row",
    marginHorizontal: 30,
  },
  sortMethodHeader: {
    marginLeft: 10,
    fontFamily: "SFProDisplay-Semibold",
    fontSize: 14,
    color: "#000",
  },
});
