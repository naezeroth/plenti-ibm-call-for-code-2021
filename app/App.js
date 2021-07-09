import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import Constants from "expo-constants";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppLoading from "expo-app-loading";

import Camera from "./screens/Camera";
import InventoryScreen from "./screens/InventoryScreen";
import Auth from "./screens/Auth";
import * as SecureStore from "expo-secure-store";

function ItemsScreen() {
  return InventoryScreen();
}

function ScannerScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Scanner!</Text>
    </View>
  );
}

function DashboardScreen(props) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>DASHBOARD</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  let [fontsLoaded] = useFonts({
    "SFProDisplay-Heavy": require("./assets/fonts/SFProDisplay/FontsFree-Net-SFProDisplay-Heavy.ttf"),
    "SFProDisplay-Semibold": require("./assets/fonts/SFProDisplay/FontsFree-Net-SFProDisplay-Semibold.ttf"),
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    async function getToken() {
      let result = await SecureStore.getItemAsync("token");
      if (result) {
        setToken(result);
      }
    }
    getToken();
  }, [loggedIn]);

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
              children={() => <ItemsScreen token={token} />}
            />
            <Tab.Screen
              name="Scanner"
              children={() => <Camera token={token} />}
            />
            <Tab.Screen
              name="Dashboard"
              children={() => <DashboardScreen token={token} />}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  container: {
    flex: 1,
    marginTop: 0,
    marginTop: Constants.statusBarHeight,
    // marginHorizontal: 0,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
  },
  header: {
    fontSize: 32,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
