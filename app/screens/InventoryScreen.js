import React from "react";
import { StyleSheet, Text, View } from "react-native";
import InventoryList from "../components/InventoryList";
import { Header } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import CategoryList from "../components/CategoryList";
import { Feather } from "@expo/vector-icons";


const categories = [
  'meats', 'dairy', 'fruits', 'vegetables', 'grains', 'beverages'
]


export default function InventoryScreen(props) {

  const { inventoryList, refreshInventory } = props;

  const [activeCategory, setActiveCategory] = React.useState(null);

  const [inventoryOrder, setInventoryOrder] = React.useState(null);

  const visibleInventoryInit = () => (activeCategory == null ? inventoryList : item => item.category == categories[activeCategory]);

  const [visibleInventory, setVisibleInventory] = React.useState( visibleInventoryInit );

  // const filterInventory = React.useCallback(() => {
  //   if (activeCategory == null) { setVisibleInventory(inventoryList); }
  //   else { setVisibleInventory(inventoryList.filter(item => item.category == categories[activeCategory])); }
  // })

  // filterInventory();
  

  

  let updated_props = Object.assign({}, props, {
    activeCategory: activeCategory,
    setActiveCategory: setActiveCategory,
    inventoryOrder: inventoryOrder,
    setInventoryOrder: setInventoryOrder,
    visibleInventory, setVisibleInventory,
  })

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
