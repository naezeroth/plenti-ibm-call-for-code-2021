import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppLoading from "expo-app-loading";

import Camera from "./screens/Camera";
import InventoryScreen from "./screens/InventoryScreen";
import Auth from "./screens/Auth";
import Dashboard from "./screens/Dashboard";

import * as SecureStore from "expo-secure-store";

import {decode, encode} from 'base-64'
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode } 

const Tab = createBottomTabNavigator();

export default function App() {
  let [fontsLoaded] = useFonts({
    "SFProDisplay-Heavy": require("./assets/fonts/SFProDisplay/FontsFree-Net-SFProDisplay-Heavy.ttf"),
    "SFProDisplay-Semibold": require("./assets/fonts/SFProDisplay/FontsFree-Net-SFProDisplay-Semibold.ttf"),
    "SFProDisplay-Light": require("./assets/fonts/SFProDisplay/FontsFree-Net-SFProDisplay-Light.ttf"),
    "SFProDisplay-Regular": require("./assets/fonts/SFProDisplay/FontsFree-Net-SFProDisplay-Regular.ttf"),
    "SFProDisplay-Medium": require("./assets/fonts/SFProDisplay/FontsFree-Net-SFProDisplay-Medium.ttf"),
  });

  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [inventoryList, setInventoryList] = useState([]);
  const [refreshInventoryToggle, setRefreshInventoryToggle] = useState(false);
  const [updateInventoryToggle, setUpdateInventoryToggle] = useState(false);

  useEffect(() => {
    async function getToken() {
      let result = await SecureStore.getItemAsync("token");
      if (result) {
        setToken(result);
      }
    }
    getToken();
  }, [loggedIn]);

  useEffect(() => {
    async function getInventory() {
      const result = await fetch(
        "https://02f401bd.au-syd.apigw.appdomain.cloud/api/getInventory?" +
          new URLSearchParams({
            token: token,
          })
      );
      if (!result.ok) {
        const message = `An error has occured: ${result.status}`;
        console.log(message);
        return;
      }
      const jsonResult = await result.json();
      console.log("GetInventory:", jsonResult);
      setInventoryList(jsonResult.inventory);
    }
    getInventory();
  }, [token, refreshInventoryToggle]);

  const refreshInventory = () => {
    setRefreshInventoryToggle(!refreshInventoryToggle);
  };

  //Fn to update inventory if InventoryList changes (either by adding/removing item) because of
  //inventoryList dependency but also update (updating specific item) because of
  //updateInventoryToggle dependency
  useEffect(() => {
    async function updateInventory() {
      const result = await fetch(
        "https://02f401bd.au-syd.apigw.appdomain.cloud/api/updateInventory?" +
          new URLSearchParams({
            token: token,
          }),
        {
          method: "POST",
          body: JSON.stringify({ inventory: inventoryList }),
          header: {
            "content-type": "application/json",
            accept: "application/json",
          },
        }
      );
      if (!result.ok) {
        const message = `An error has occured: ${result.status}`;
        console.log(message);
        return;
      }
      const jsonResult = await result.json();
      console.log("updateInventory:", jsonResult);
    }

    if (!inventoryList || inventoryList.length === 0 || !loggedIn) {
      return;
    }
    updateInventory();
  }, [inventoryList, loggedIn, updateInventoryToggle]);

  if (!fontsLoaded) {
    return <AppLoading />;
  } else if (loggedIn === false) {
    return <Auth setLoggedIn={setLoggedIn} />;
  } else {
    return (
      <SafeAreaProvider style={styles.container}>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let icon;
                if (route.name === "Items") {
                  icon = focused ? (
                    <FontAwesome5 name="list-alt" size={32} color="#4AC79F" />
                  ) : (
                    <FontAwesome5 name="list-alt" size={32} color="black" />
                  );
                } else if (route.name === "Scanner") {
                  icon = focused ? (
                    <AntDesign name="scan1" size={32} color="#4AC79F" />
                  ) : (
                    <AntDesign name="scan1" size={32} color="black" />
                  );
                } else if (route.name === "Dashboard") {
                  icon = focused ? (
                    <MaterialCommunityIcons
                      name="view-dashboard-outline"
                      size={32}
                      color="#4AC79F"
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="view-dashboard-outline"
                      size={32}
                      color="black"
                    />
                  );
                }
                return icon;
              },
            })}
            tabBarOptions={{
              showLabel: false,
              activeTintColor: "#4AC79F",
              inactiveTintColor: "gray",
              style: {
                backgroundColor: "#FAF6ED",
              },
            }}
          >
            <Tab.Screen
              name="Items"
              children={() => (
                <InventoryScreen
                  token={token}
                  inventoryList={inventoryList}
                  setInventoryList={setInventoryList}
                  refreshInventory={refreshInventory}
                  updateInventoryToggle={updateInventoryToggle}
                  setUpdateInventoryToggle={setUpdateInventoryToggle}
                />
              )}
            />
            <Tab.Screen
              name="Scanner"
              children={() => (
                <Camera
                  token={token}
                  inventoryList={inventoryList}
                  setInventoryList={setInventoryList}
                />
              )}
            />
            <Tab.Screen
              name="Dashboard"
              children={() => (
                <Dashboard
                  token={token}
                  inventoryList={inventoryList}
                  setInventoryList={setInventoryList}
                  refreshInventory={refreshInventory}
                  updateInventoryToggle={updateInventoryToggle}
                  setUpdateInventoryToggle={setUpdateInventoryToggle}
                />
              )}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
  },
});
