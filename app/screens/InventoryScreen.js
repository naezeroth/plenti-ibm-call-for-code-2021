import React from "react";
import { TouchableOpacity, Button, StyleSheet, Text, View } from "react-native";
import InventoryList from "../components/InventoryList";
import { Header } from "react-native-elements";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import CategoryList from "../components/CategoryList";
import { Feather } from "@expo/vector-icons";


const categories = [
  'meats', 'dairy', 'fruits', 'vegetables', 'grains', 'beverages'
]


const purchaseDateComparator = (a, b) => (a.purchase_date - b.purchase_date);
const recentComparator = (a, b) => (b.purchase_date - a.purchase_date);

// const priceComparator = (a,b) => {
//   console.log(a, b);
//   if (a !== undefined && b != undefined)
//   {
//     if ('price' in a && 'price' in b)
//     {
//       console.log('PRICE FOUND');
//       return (a.price - b.price);
//     }
//   }
//   for (let i=0; i<10; i++)
//   {
//     console.log('PRICE NOT FOUND');
//   }
  
//   // console.log(a.price, b.price);
//   return 0;
// }

// const priceComparator = (a,b) => {
//   // if (a === undefined || b === undefined)
//   // {
//   //   for (let i=0; i<10; i++)
//   //   {
//   //     console.log('PRICE NOT FOUND');
//   //   }
//   //   return 0;
//   // }
//   return a.price - b.price;
// }

const priceComparator = (a,b) => (b.price - a.price);

const expiryComparator = (a, b) => (a.expiry_date - b.expiry_date);

const uneatenFilter = item => (item.status == "uneaten");


export default function InventoryScreen(props) {

  const { inventoryList, refreshInventory } = props;

  const [activeCategory, setActiveCategory] = React.useState(null);

  const [inventoryOrder, setInventoryOrder] = React.useState(null);

  // const visibleInventoryInit = () => (activeCategory == null ? inventoryList : item => item.category == categories[activeCategory]);

  // const [visibleInventory, setVisibleInventory] = React.useState( visibleInventoryInit );
  const [visibleInventory, setVisibleInventory] = React.useState( [] );

  const [sortComparator, setSortComparator] = React.useState( () => recentComparator );

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
    if (inventoryList !== undefined)
    {
      let visibleList = JSON.parse(JSON.stringify(inventoryList));
      visibleList.map((element, index) => {
        element.global_key= index;
      })
      visibleList = visibleList.filter(item => uneatenFilter(item) && (activeCategory==null ? true : item.category==categories[activeCategory]));
      visibleList.sort(sortComparator);
      console.log(visibleList);
      setVisibleInventory(visibleList);
    }
  }, [inventoryList, activeCategory, sortComparator])

  

  let updated_props = Object.assign({}, props, {
    activeCategory: activeCategory,
    setActiveCategory: setActiveCategory,
    inventoryOrder: inventoryOrder,
    setInventoryOrder: setInventoryOrder,
    visibleInventory: visibleInventory,
    setVisibleInventory: setVisibleInventory,
    // updateVisibleInventory: updateVisibleInventory,
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



      <View
        style={{height:30, flexDirection: "row", marginHorizontal:30}}
      >
        {/* <Button
          style={{backgroundColor: "#FAF6ED"}}
          color="#FAF6ED"
          title="Recently added"
        /> */}

        <FontAwesome name="sort-amount-asc" size={18} color="black" />

        <TouchableOpacity
            // style={{}}
            onPress={() => console.log("Pressed")}
          >
        </TouchableOpacity>

        <Text>
          Recently Added
        </Text>

        
          
        
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
