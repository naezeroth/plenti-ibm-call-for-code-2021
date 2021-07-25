import React, { useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import InventoryList from "./InventoryList";
import { MaterialIcons } from "@expo/vector-icons";

const discardedFilter = (item) => item.status == "discarded";

export default BinModal = (props) => {
  const {
    inventoryList,
    setInventoryList,
    updateInventoryToggle,
    setUpdateInventoryToggle,
    setBinModalVisible,
  } = props;

  const [visibleInventory, setVisibleInventory] = React.useState([]);

  // If selection mode is true, items can be selected
  const [selectMode, setSelectMode] = React.useState(true);

  // Set of items which have been selected
  const [selected, setSelected] = React.useState(new Set());

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
  };

  React.useEffect(() => {
    if (inventoryList !== undefined) {
      let visibleList = JSON.parse(JSON.stringify(inventoryList));
      visibleList.map((element, index) => {
        element.global_key = index;
      });
      visibleList = visibleList.filter((item) => discardedFilter(item));
      // visibleList.sort(sortComparator);
      setVisibleInventory(visibleList);
    }
  }, [inventoryList, updateInventoryToggle, selected]);

  const changeSelectedStatus = (status) => {
    if (selectMode) {
      for (let global_key of selected) {
        console.log("CHANGING", inventoryList[global_key], status);
        inventoryList[global_key].status = status;
      }
      setUpdateInventoryToggle(!updateInventoryToggle);
      toggleSelectMode();
    }
  };

  const deleteItems = () => {
    let newInventoryList = [];
    if (selectMode) {
      for (let index in inventoryList) {
        if (!selected.has(Number(index))) {
          newInventoryList.push(inventoryList[index]);
        }
      }
    }
    console.log("Deleting!", newInventoryList, selected);
    setInventoryList(newInventoryList);
    toggleSelectMode();
  };

  //TODO fix issue of overlay on top of inventory items
  const SelectActionBar = () => {
    if (!selectMode) {
      return null;
    }
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          backgroundColor: "#FAF6ED",
          paddingVertical: 20,
        }}
      >
        <TouchableOpacity onPress={() => deleteItems()}>
          <View style={{ alignItems: "center" }}>
            <AntDesign name="delete" size={24} color="black" />
            <Text style={{ fontSize: 13, fontFamily: "SFProDisplay-Semibold" }}>
              delete
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changeSelectedStatus("uneaten")}>
          <View style={{ alignItems: "center" }}>
            <MaterialIcons name="access-time" size={24} color="black" />
            <Text style={{ fontSize: 13, fontFamily: "SFProDisplay-Semibold" }}>
              recover
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  let updated_props = Object.assign({}, props, {
    visibleInventory: visibleInventory,
    setVisibleInventory: setVisibleInventory,
    setSelectedItem: () => null,
    setAddModalVisible: () => null,
    setInventoryList: setInventoryList,
    inventoryList: inventoryList,
    setUpdateInventoryToggle: setUpdateInventoryToggle,
    updateInventoryToggle: updateInventoryToggle,
    selectMode: selectMode,
    selected: selected,
    toggleSelected: toggleSelected,
  });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#4AC79F",
      }}
    >
      <View
        style={{
          paddingTop: 50,
          paddingBottom: 50,
          width: "100%",
          flex: 0,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            console.log("Closing bin modal!");
            setBinModalVisible(false);
          }}
          style={{ padding: 25, position: "absolute", top: 20, zIndex: 100 }}
        >
          <AntDesign name={"close"} size={36} color="black" />
        </TouchableOpacity>
        <View style={{ justifyContent: "center" }}>
          <Text
            style={{
              alignSelf: "center",
              fontFamily: "SFProDisplay-Heavy",
              fontSize: 24,
              color: "#000",
            }}
          >
            Bin
          </Text>
          <Text
            style={{
              alignSelf: "center",
              fontFamily: "SFProDisplay-Semibold",
              fontSize: 16,
              color: "#000",
              paddingTop: 5,
            }}
          >
            Past 7 days
          </Text>
        </View>
      </View>
      <View
        style={{
          alignItems: "center",
          flex: 1,
          justifyContent: "center",
          backgroundColor: "#4AC79F",
        }}
      >
        {InventoryList(updated_props)}
      </View>
      <SelectActionBar />
    </View>
  );
};
