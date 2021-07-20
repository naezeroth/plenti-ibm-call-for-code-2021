import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import InventoryList from "../components/InventoryList";
import { Header, Image } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import CategoryList from "../components/CategoryList";
import { Feather } from "@expo/vector-icons";
import jwt_decode from "jwt-decode";
import { AntDesign } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
// dateFormat="MMMM d, yyyy h:mm aa"
import DatePicker from "react-native-date-picker";

export default function DashboardScreen(props) {
  const { token } = props;
  const { name } = jwt_decode(token);
  const [dateValue, setDateValue] = useState(new Date());

  return (
    <View style={styles.container}>
      <View
        style={{
          position: "absolute",
          backgroundColor: "#4AC79F",
          boxShadow: "0 4 4 rgba(0, 0, 0, 0.15)",
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
          height: "50%",
          top: 0,
          width: "100%",
          zIndex: -1,
          shadowColor: "#171717",
          shadowOffset: { width: -2, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
        }}
      >
        <View style={{ marginTop: 55, marginLeft: 25 }}>
          <Text style={styles.title}>Dashboard</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Image
            source={require("../assets/avatar.png")}
            style={{ width: 96, height: 96 }}
          />
          <Text style={styles.name}>{name}</Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-around",
            paddingHorizontal: 10,
          }}
        >
          <Tile title="Bin" image={require("../assets/bin.png")} />
          <Tile title="Ranking" image={require("../assets/ranking.png")} />
          <Tile title="Settings" image={require("../assets/settings.png")} />
        </View>
      </View>
      <ScrollView
        style={{
          position: "absolute",
          height: "50%",
          top: "50%",
          width: "100%",
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              margin: 24,
              fontSize: 18,
              fontWeight: "bold",
              textAlign: "center",
              color: "black",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            <Text style={styles.overviewText}>{name}'s </Text>
            <Text style={{ ...styles.overviewText, color: "#4AC79F" }}>
              Food Waste{" "}
            </Text>
            <Text style={styles.overviewText}>overview</Text>
          </View>
          <View
            style={{
              width: "90%",
              backgroundColor: "#4AC79F",
              alignSelf: "center",
              borderRadius: 20,
              shadowColor: "#171717",
              shadowOffset: { height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 3,
              marginBottom: 10,
              paddingVertical: 5,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                alignContent: "center",
                justifyContent: "center",
                paddingBottom: 10,
                paddingTop: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: "SFProDisplay-Semibold",
                  fontWeight: "600",
                  fontSize: 22,
                  color: "#FAF6ED",
                }}
              >
                Your food waste in
              </Text>
              <DateTimePicker
                style={{ marginLeft: 10, width: 75 }}
                value={dateValue}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={(e, selectedDate) => {
                  console.log("selectedDate", selectedDate);
                  setDateValue(selectedDate);
                }}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                alignContent: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "SFProDisplay-Semibold",
                  fontWeight: "600",
                  fontSize: 36,
                  color: "#FAF6ED",
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                }}
              >
                $79
              </Text>
              <Text
                style={{
                  fontFamily: "SFProDisplay-Medium",
                  fontWeight: "600",
                  fontSize: 18,
                  color: "#FAF6ED",
                  width: 120,
                  padding: 5,
                }}
              >
                spent on food thrown away
              </Text>
              <View
                style={{
                  backgroundColor: "#FAF6ED",
                  borderRadius: 16,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  height: 25,
                  marginVertical: 15,
                  marginLeft: 20,
                }}
              >
                <AntDesign
                  name="arrowdown"
                  size={20}
                  color="#4AC79F"
                  style={{ paddingLeft: 5 }}
                />
                <Text
                  style={{
                    color: "#4AC79F",
                    fontFamily: "SFProDisplay-Heavy",
                    paddingRight: 5,
                  }}
                >
                  5%
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                alignContent: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "SFProDisplay-Semibold",
                  fontWeight: "600",
                  fontSize: 36,
                  color: "#FAF6ED",
                  paddingVertical: 5,
                  paddingHorizontal: 23,
                }}
              >
                21
              </Text>
              <Text
                style={{
                  fontFamily: "SFProDisplay-Medium",
                  fontWeight: "600",
                  fontSize: 18,
                  color: "#FAF6ED",
                  width: 120,
                  padding: 5,
                }}
              >
                items were sent to landfill
              </Text>
              <View
                style={{
                  backgroundColor: "#FAF6ED",
                  borderRadius: 16,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  height: 25,
                  marginVertical: 15,
                  marginLeft: 20,
                }}
              >
                <AntDesign
                  name="arrowup"
                  size={20}
                  color="#F97569"
                  style={{ paddingLeft: 5 }}
                />
                <Text
                  style={{
                    color: "#F97569",
                    fontFamily: "SFProDisplay-Heavy",
                    paddingRight: 5,
                  }}
                >
                  2%
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            width: "90%",
            backgroundColor: "#4AC79F",
            alignSelf: "center",
            borderRadius: 20,
            shadowColor: "#171717",
            shadowOffset: { height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            marginVertical: 10,
            paddingVertical: 5,
            height: 45,
            flexDirection: "row",
          }}
        ></View>
      </ScrollView>
    </View>
  );
}

const Tile = ({ title, image }) => {
  return (
    <TouchableOpacity
      onPress={() => console.log("Touched: " + title)}
      activeOpacity={0.5}
    >
      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
          height: 107,
          width: 107,
          shadowColor: "#171717",
          shadowOffset: { height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
        }}
      >
        <Image source={image} style={{ width: 46, height: 46 }} />
        <Text style={styles.tileText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

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
  },
  name: {
    fontFamily: "SFProDisplay-Semibold",
    fontSize: 18,
    color: "#000",
  },
  tileText: {
    fontFamily: "SFProDisplay-Medium",
    fontSize: 18,
    color: "#000",
    paddingTop: 5,
  },
  overviewText: {
    fontFamily: "SFProDisplay-Semibold",
    fontWeight: "600",
    fontSize: 32,
    color: "#000",
  },
});
