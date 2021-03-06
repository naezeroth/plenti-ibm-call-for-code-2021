import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { Image } from "react-native-elements";
import jwt_decode from "jwt-decode";
import { AntDesign } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import BinModal from "../components/BinModal";

export default function DashboardScreen(props) {
  const {
    token,
    inventoryList,
    setInventoryList,
    updateInventoryToggle,
    setUpdateInventoryToggle,
  } = props;

  const { name } = jwt_decode(token);
  const [dateValue, setDateValue] = useState(new Date());
  const [binModalVisible, setBinModalVisible] = useState(false);
  const [rankingModalVisible, setRankingModalVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        visible={binModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setBinModalVisible(!binModalVisible);
        }}
      >
        <BinModal
          setBinModalVisible={setBinModalVisible}
          setInventoryList={setInventoryList}
          updateInventoryToggle={updateInventoryToggle}
          setUpdateInventoryToggle={setUpdateInventoryToggle}
          inventoryList={inventoryList}
        />
      </Modal>
      <Modal
        animationType="slide"
        visible={rankingModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setRankingModalVisible(!binModalVisible);
        }}
      >
        <RankingModalContent
          setRankingModalVisible={setRankingModalVisible}
          name={name}
        />
      </Modal>
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
          <Tile
            title="Bin"
            image={require("../assets/bin.png")}
            onPress={() => setBinModalVisible(true)}
          />
          <Tile
            title="Ranking"
            image={require("../assets/ranking.png")}
            onPress={() => setRankingModalVisible(true)}
          />
          <Tile
            title="Settings"
            image={require("../assets/settings.png")}
            onPress={() => console.log("Settings pressed")}
          />
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
              marginBottom: 10,
            }}
          >
            <Text style={styles.overviewText}>{name}'s </Text>
            <Text style={{ ...styles.overviewText, color: "#4AC79F" }}>
              food waste{" "}
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
              {Platform.OS === "ios" ? (
                <DateTimePicker
                  style={{ marginLeft: 10, width: 75 }}
                  value={dateValue}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={(e, selectedDate) => {
                    setDateValue(selectedDate);
                  }}
                />
              ) : (
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => setDatePickerVisibility(true)}
                >
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    style={{ marginLeft: 10, width: 75 }}
                    value={dateValue}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onConfirm={(selectedDate) => {
                      console.log("selectedDate", selectedDate);
                      setDateValue(selectedDate);
                      setDatePickerVisibility(false);
                    }}
                    onCancel={() => {
                      setDatePickerVisibility(false);
                    }}
                  />
                  <Text style={{ fontSize: 18, marginVertical: 8 }}>
                    {dateValue.toString().split(" ").slice(1, 4).join(" ")}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <OverviewContent date={dateValue} inventoryList={inventoryList} />
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
            height: 45,
            flexDirection: "row",
            alignContent: "center",
          }}
        >
          <View
            style={{
              justifyContent: "center",
              width: "30%",
              backgroundColor: "#FEC7B3",
              height: 45,
              borderBottomLeftRadius: 20,
              borderTopLeftRadius: 20,
            }}
          >
            <Text style={{ fontSize: 32, alignSelf: "center" }}>????</Text>
          </View>
          <View
            style={{
              justifyContent: "center",
              width: "28%",
              backgroundColor: "white",
            }}
          >
            <Text style={{ fontSize: 32, alignSelf: "center" }}>????</Text>
          </View>
          <View
            style={{
              justifyContent: "center",
              width: "20%",
              backgroundColor: "#FECC66",
            }}
          >
            <Text style={{ fontSize: 32, alignSelf: "center" }}>????</Text>
          </View>
          <View
            style={{
              justifyContent: "center",
              width: "11%",
              backgroundColor: "#BEDD9A",
            }}
          >
            <Text style={{ fontSize: 32, alignSelf: "center" }}>????</Text>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignContent: "center",
              width: "11%",
              backgroundColor: "#4AC79F",
              borderBottomRightRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            <Text style={{ fontSize: 32, alignSelf: "center" }}>????</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const Tile = ({ title, image, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.5}>
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

//TODO add mock data for previous month
const OverviewContent = ({ date, inventoryList }) => {
  //Get month from date
  let currentDate = new Date(date);
  let prevDate = new Date(currentDate);
  prevDate.setMonth(currentDate.getMonth() - 1);
  console.log(currentDate, prevDate);
  let spent = 0;
  let items = 0;
  let lastMonthCost = 0;
  let lastMonthItems = 0;
  for (let item of inventoryList) {
    if (item.status === "discarded") {
      let itemDate = new Date(item.purchase_date);
      if (
        itemDate.getFullYear() === currentDate.getFullYear() &&
        itemDate.getMonth() === currentDate.getMonth()
      ) {
        spent += Number(item.quantity) * Number(item.price);
        items += Number(item.quantity);
        console.log(
          "Within same month - will use as this month stats",
          spent,
          items
        );
      } else if (
        itemDate.getFullYear() === prevDate.getFullYear() &&
        itemDate.getMonth() === prevDate.getMonth()
      ) {
        lastMonthCost += Number(item.quantity) * Number(item.price);
        lastMonthItems += Number(item.quantity);
        console.log("Within the last month - will use as prev stats");
      }
    }
  }
  let spentPercentage;
  let itemsPercentage;
  if (lastMonthCost === 0) {
    spentPercentage = (spent / 1) * 100;
  }
  if (lastMonthItems === 0) {
    itemsPercentage = (items / 1) * 100;
  } else {
    spentPercentage = ((spent - lastMonthCost) / lastMonthCost) * 100;
    itemsPercentage = ((items - lastMonthItems) / lastMonthItems) * 100;
  }

  console.log(
    "Spent",
    spent,
    "SpentPercentage",
    spentPercentage,
    "items",
    items,
    "itemsPercentage",
    itemsPercentage
  );

  const Discarded = ({ percentage }) => {
    let arrow = "arrowup";
    let color = "#F97569";
    if (percentage <= 0) {
      arrow = "arrowdown";
      color = "#4AC79F";
    }
    return (
      <>
        <AntDesign
          name={arrow}
          size={20}
          color={color}
          style={{ paddingLeft: 5 }}
        />
        <Text
          style={{
            color,
            fontFamily: "SFProDisplay-Heavy",
            paddingRight: 5,
          }}
        >
          {percentage}%
        </Text>
      </>
    );
  };

  const Items = ({ percentage }) => {
    let arrow = "arrowup";
    let color = "#F97569";
    if (percentage <= 0) {
      arrow = "arrowdown";
      color = "#4AC79F";
    }
    return (
      <>
        <AntDesign
          name={arrow}
          size={20}
          color={color}
          style={{ paddingLeft: 5 }}
        />
        <Text
          style={{
            color,
            fontFamily: "SFProDisplay-Heavy",
            paddingRight: 5,
          }}
        >
          {percentage}%
        </Text>
      </>
    );
  };

  return (
    <View>
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
          ${spent}
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
          <Discarded percentage={spentPercentage} />
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
          {items}
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
          <Items percentage={itemsPercentage} />
        </View>
      </View>
    </View>
  );
};

const RankingModalContent = ({ setRankingModalVisible, name }) => {
  const today = new Date();
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
            setRankingModalVisible(false);
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
            Leaderboard
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
            {today.toDateString()}
          </Text>
        </View>
      </View>
      <View
        style={{
          alignItems: "center",
          flex: 1,
          backgroundColor: "#4AC79F",
          marginTop: -20,
        }}
      >
        <View
          style={{
            width: "90%",
            backgroundColor: "#FAF6ED",
            borderRadius: 13,
            flexDirection: "row",
            marginBottom: 10,
          }}
        >
          <Image
            source={require("../assets/leader.png")}
            style={{ width: 45, height: 55, margin: 10, marginLeft: 20 }}
          />
          <View style={{ width: "50%", justifyContent: "center" }}>
            <Text style={styles.name}>Olivia Peters</Text>
            <Text style={styles.name}> ???? 35 {"    "} ???? 10</Text>
          </View>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              backgroundColor: "#F97569",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "SFProDisplay-Heavy",
                fontSize: 20,
                color: "#fff",
              }}
            >
              1
            </Text>
          </View>
        </View>
        <View
          style={{
            width: "90%",
            backgroundColor: "#FAF6ED",
            borderRadius: 13,
            flexDirection: "row",
            marginVertical: 10,
          }}
        >
          <Image
            source={require("../assets/leader5.png")}
            style={{ width: 45, height: 55, margin: 10, marginLeft: 20 }}
          />
          <View style={{ width: "50%", justifyContent: "center" }}>
            <Text style={styles.name}>Angela Huang</Text>
            <Text style={styles.name}> ???? 27 {"    "} ???? 14</Text>
          </View>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              backgroundColor: "#F97569",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "SFProDisplay-Heavy",
                fontSize: 20,
                color: "#fff",
              }}
            >
              2
            </Text>
          </View>
        </View>
        <View
          style={{
            width: "90%",
            backgroundColor: "#FAF6ED",
            borderRadius: 13,
            flexDirection: "row",
            marginVertical: 10,
          }}
        >
          <Image
            source={require("../assets/leader4.png")}
            style={{ width: 45, height: 55, margin: 10, marginLeft: 20 }}
          />
          <View style={{ width: "50%", justifyContent: "center" }}>
            <Text style={styles.name}>Apurva Shukla</Text>
            <Text style={styles.name}> ???? 20 {"    "} ???? 20</Text>
          </View>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              backgroundColor: "#F97569",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "SFProDisplay-Heavy",
                fontSize: 20,
                color: "#fff",
              }}
            >
              3
            </Text>
          </View>
        </View>
        <View
          style={{
            width: "90%",
            backgroundColor: "#FAF6ED",
            borderRadius: 13,
            flexDirection: "row",
            marginVertical: 10,
          }}
        >
          <Image
            source={require("../assets/leader2.png")}
            style={{ width: 45, height: 55, margin: 10, marginLeft: 20 }}
          />
          <View style={{ width: "50%", justifyContent: "center" }}>
            <Text style={styles.name}>Christina Liu</Text>
            <Text style={styles.name}> ???? 15 {"    "} ???? 23</Text>
          </View>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              backgroundColor: "#F97569",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "SFProDisplay-Heavy",
                fontSize: 20,
                color: "#fff",
              }}
            >
              4
            </Text>
          </View>
        </View>
        <View
          style={{
            width: "90%",
            backgroundColor: "#FAF6ED",
            borderRadius: 13,
            flexDirection: "row",
            marginVertical: 10,
          }}
        >
          <Image
            source={require("../assets/leader3.png")}
            style={{ width: 45, height: 55, margin: 10, marginLeft: 20 }}
          />
          <View style={{ width: "50%", justifyContent: "center" }}>
            <Text style={styles.name}>James Macintyre</Text>
            <Text style={styles.name}> ???? 13 {"    "} ???? 25</Text>
          </View>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              backgroundColor: "#F97569",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "SFProDisplay-Heavy",
                fontSize: 20,
                color: "#fff",
              }}
            >
              5
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          flex: 0,
          backgroundColor: "#FAF6ED",
          flexDirection: "row",
          paddingBottom: 20,
        }}
      >
        <Image
          source={require("../assets/avatar.png")}
          style={{ width: 80, height: 80, margin: 10, marginLeft: 20 }}
        />
        <View style={{ width: "48%", justifyContent: "center" }}>
          <Text style={styles.name}>{name}</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={styles.name}>???? 23 </Text>
            <Text
              style={{
                fontFamily: "SFProDisplay-Semibold",
                fontSize: 14,
                color: "#000",
              }}
            >
              items consumed
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={styles.name}>???? 80 </Text>
            <Text
              style={{
                fontFamily: "SFProDisplay-Semibold",
                fontSize: 14,
                color: "#000",
              }}
            >
              items thrown
            </Text>
          </View>
        </View>
        <View
          style={{
            width: 65,
            height: 65,
            borderRadius: 50,
            backgroundColor: "#F97569",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "SFProDisplay-Heavy",
              fontSize: 18,
              color: "#fff",
            }}
          >
            100+
          </Text>
        </View>
      </View>
    </View>
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
