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

  //selectedItem of -1 means new item being added, otherwise editing existing item
  const [selectedItem, setSelectedItem] = React.useState(-1);

  const [visibleInventory, setVisibleInventory] = React.useState([]);

  // If selection mode is true, items can be selected
  const [selectMode, setSelectMode] = React.useState(false);

  // Set of items which have been selected
  const [selected, setSelected] = React.useState(new Set());

  const [sortComparator, setSortComparator] = React.useState(
    () => recentComparator
  );

  const toggleSelected = (globalKey) => {
    let newSet = new Set(selected);
    if (selected.has(globalKey)) {
      newSet.delete(globalKey);
    } else {
      newSet.add(globalKey);
    }
    setSelected(newSet);
  };

  const toggleSelectMode = () => {
    if (selectMode) {
      setSelected(new Set());
    }
    setSelectMode(!selectMode);
  };

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
      setVisibleInventory(visibleList);
    }
  }, [
    inventoryList,
    activeCategory,
    sortComparator,
    addModalVisible,
    updateInventoryToggle,
    selected,
  ]);

  const changeSelectedStatus = (status) => {
    if (selectMode) {
      for (let global_key of selected) {
        inventoryList[global_key].status = status;
      }
      setUpdateInventoryToggle(!updateInventoryToggle);
      toggleSelectMode();
    }
  };

  const SelectActionBar = () => {
    if (!selectMode) {
      return null;
    }
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 90,
          alignItems: "center",
          // paddingRight: 20,
          // backgroundColor: "#FAF6ED",
          // backgroundColor: "white",
          backgroundColor: "#4AC79F",
          height: 50,
        }}
      >
        <TouchableOpacity onPress={() => changeSelectedStatus("discarded")}>
          <View style={{ alignItems: "center" }}>
            <AntDesign name="delete" size={24} color="black" />
            <Text style={{ fontSize: 13, fontFamily: "SFProDisplay-Semibold" }}>
              {" "}
              throw out{" "}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changeSelectedStatus("eaten")}>
          <View style={{ alignItems: "center" }}>
            <AntDesign name="check" size={24} color="black" />
            <Text style={{ fontSize: 13, fontFamily: "SFProDisplay-Semibold" }}>
              {" "}
              eat{" "}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

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
    selectMode: selectMode,
    selected: selected,
    toggleSelected: toggleSelected,
  });

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.title}>Your Inventory</Text>
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
      </View> */}

      <Header
        // style={styles.header}
        placement="left"
        backgroundColor="#FAF6ED"
        leftComponent={{
          text: "Your Inventory",
          style: styles.title,
        }}
        centerComponent={
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              paddingRight: 20,
            }}
          >
            {/* <Feather name="search" size={32} color="black" /> */}
            <TouchableOpacity
              onPress={() => {
                console.log("Opening modal");
                setSelectedItem(-1);
                setAddModalVisible(!addModalVisible);
              }}
            >
              <View style={{ paddingRight: 20 }}>
                <AntDesign name="pluscircleo" size={31.5} color="black" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleSelectMode}>
              <View
                style={
                  selectMode
                    ? {
                        ...styles.selectButton,
                        borderColor: "#4AC79F",
                        backgroundColor: "#4AC79F",
                      }
                    : styles.selectButton
                }
              >
                <Text
                  style={{ fontSize: 16, fontFamily: "SFProDisplay-Semibold" }}
                >
                  {selectMode ? "cancel" : "select"}
                </Text>
              </View>
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

      <SelectActionBar />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    // marginVertical: 10,
    // marginHorizontal: 30,
    // // flex: 1,
    // flexDirection: "row",
    // justifyContent: "space-between",
    // backgroundColor: "#FAF6ED",
  },
  container: {
    flex: 1,
    backgroundColor: "#FAF6ED",
  },
  title: {
    fontFamily: "SFProDisplay-Heavy",
    fontSize: 24,
    color: "#000",
    paddingBottom: 1,
    paddingLeft: 20,
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
  selectButton: {
    borderRadius: 30,
    // marginLeft: 10,
    // marginTop: 7,
    // marginBottom: 7,
    borderWidth: 2,
    borderColor: "black",
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: "#FAF6ED",
    // justifyContent: 'center',
    marginRight: 30,
  },
  selectButtonSelected: {
    borderRadius: 30,
    // marginLeft: 10,
    // marginTop: 7,
    // marginBottom: 7,
    borderWidth: 2,
    borderColor: "#4AC79F",
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: "#4AC79F",
  },
});
