import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { Input } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { foodClasses } from "./foodClasses";

//For reusability implement onSave fn as a prop

export const AddModal = ({
  selectedItem,
  localInventoryList,
  setSelectedItem,
  setModalVisible,
  setLocalInventoryList,
  updateInventoryToggle,
  setUpdateInventoryToggle,
}) => {

  const [item, setItem] = useState(
    selectedItem === -1
      ? {
          category: "",
          expiry_date: null, //Stored like '2021-07-22T07:31:00.000Z'
          days_to_expiry: 0,
          frozen: false,
          item_class: null,
          name: "",
          emoji: "",
          price: 0,
          purchase_date: new Date(),
          quantity: 0,
          remove_date: null,
          status: "uneaten",
        }
      : localInventoryList[selectedItem]
  );

  const [expanded, setExpanded] = useState(false);

  Date.prototype.addDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };

  //TODO implement lookup table for
  const [expiryDateValue, setExpiryDateValue] = useState(
    item && item.days_to_expiry
      ? new Date().addDays(item.days_to_expiry)
      : new Date()
  );

  const [purchaseDateValue, setPurchaseDateValue] = useState(new Date());

  const [isPurchaseDatePickerVisible, setPurchaseDatePickerVisibility] =
    useState(false);
  const [isExpiryDatePickerVisible, setExpiryDatePickerVisibility] =
    useState(false);

  const classifyItem = async (inputItem) => {
    const result = await fetch(
      "https://api.us-south.natural-language-classifier.watson.cloud.ibm.com/instances/badedd77-8003-48e6-943b-861ea34e66af/v1/classifiers/b9a0dbx961-nlc-19/classify?" +
        new URLSearchParams({
          text: inputItem.name
        }),
      {
        method: "GET",
        headers: new Headers({
          'Authorization': 'Basic '+btoa('apikey:n2Se7LEGkNIQsVt3AGiS6mhvP7A_heT_PbAcU_PYJJW3'),
        })
      }
    );
    if (!result.ok) {
      const message = `An error has occured: ${result.status}`;
      console.log(message);
      return;
    }
    const classResult = await result.json();
    console.log("CLASSIFICATION RESULT: ", classResult)
    inputItem.item_class = classResult.top_class;
    inputItem.category = foodClasses[inputItem.item_class]["category"];
    inputItem.emoji = foodClasses[inputItem.item_class]["emoji"];
    inputItem.category = foodClasses[inputItem.item_class]["category"];
    inputItem.purchase_date = new Date();
    inputItem.expiry_date = inputItem.purchase_date.addDays(foodClasses[inputItem.item_class]["expiry"]);
    setUpdateInventoryToggle(!updateInventoryToggle);
    return inputItem;
  }

  const DatePickerComponent = ({
    dateValue,
    setDateValue,
    setItem,
    itemParameter,
    isDatePickerVisible,
    setDatePickerVisibility,
  }) => (
    <>
      {Platform.OS === "ios" ? (
        <DateTimePicker
          style={{ width: 200 }}
          value={dateValue}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={(e, selectedDate) => {
            setDateValue(selectedDate);
            setItem({ ...item, [itemParameter]: selectedDate });
          }}
        />
      ) : (
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => setDatePickerVisibility(true)}
        >
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            style={{ width: 200 }}
            value={dateValue}
            mode="date"
            is24Hour={true}
            display="default"
            onConfirm={(selectedDate) => {
              setDateValue(selectedDate);
              setItem({ ...item, [itemParameter]: selectedDate });
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
    </>
  );

  return (
    <View
      style={{
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
    >
      <KeyboardAwareScrollView
        style={{
          flex: 1,
          width: "100%",
          paddingVertical: "5%", // Modal overflows on smaller screen if value is too high
        }}
      >
        <View
          style={{
            marginHorizontal: 20, //can change this number
            backgroundColor: "white",
            borderRadius: 20,
            padding: 15,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            width: "90%",
            backgroundColor: "#FAF6ED",
          }}
        >
          <TouchableOpacity onPress={ () => {setExpanded(!expanded)} }>
            <View
              style={
                expanded
                  ? styles.autoClassifyButton
                  : styles.autoClassifyButtonSelected
              }
            >
              <Text
                style={{ fontFamily: "SFProDisplay-Semibold" }}
              >
                {expanded ? "auto-classify: off" : "auto-classify: on"}
              </Text>
            </View>
          </TouchableOpacity>
          <Input
            placeholder="name"
            label="name"
            onChangeText={(text) => setItem({ ...item, name: text })}
            value={item.name}
          />
          <Input
            placeholder="price"
            label="price"
            keyboardType="numeric"
            onChangeText={(text) => setItem({ ...item, price: Number(text) })}
            value={String(item.price)}
            returnKeyType="done"
          />
          <Input
            placeholder="quantity"
            label="quantity"
            keyboardType="numeric"
            onChangeText={(text) =>
              setItem({ ...item, quantity: Number(text) })
            }
            value={String(item.quantity)}
            returnKeyType="done"
          />
          {expanded ? (
            <>
              <Input
                placeholder="😎"
                label="emoji"
                onChangeText={(text) => setItem({ ...item, emoji: text })}
                value={item.emoji}
              />
              <Input
                placeholder="category"
                label="category"
                onChangeText={(text) => setItem({ ...item, category: text })}
                value={item.category}
              />
              <Input
                label="purchase date"
                value="hello"
                InputComponent={() => (
                  <DatePickerComponent
                    dateValue={purchaseDateValue}
                    setDateValue={setPurchaseDateValue}
                    setItem={setItem}
                    itemParameter="purchase_date"
                    isDatePickerVisible={isPurchaseDatePickerVisible}
                    setDatePickerVisibility={setPurchaseDatePickerVisibility}
                  />
                )}
              />
              <Input
                label="expiry date"
                InputComponent={() => (
                  <DatePickerComponent
                    dateValue={expiryDateValue}
                    setDateValue={setExpiryDateValue}
                    setItem={setItem}
                    itemParameter="expiry_date"
                    isDatePickerVisible={isExpiryDatePickerVisible}
                    setDatePickerVisibility={setExpiryDatePickerVisibility}
                  />
                )}
              />
            </>
          ) : null }
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => {
                setSelectedItem(-1);
                setModalVisible(false);
              }}
              style={{
                width: 100,
                borderRadius: 4,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                height: 40,
              }}
            >
              <Text
                style={{
                  color: "black",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (!expanded) {
                  const itemCopy = item;
                  itemCopy.item_class = "classifying";
                  setItem(itemCopy);
                  setItem(classifyItem(item));
                }
                if (selectedItem === -1) {
                  //new item - concat to array
                  setLocalInventoryList(localInventoryList.concat(item));
                } else {
                  localInventoryList[selectedItem] = item;
                  setLocalInventoryList(localInventoryList);
                  setUpdateInventoryToggle(!updateInventoryToggle);
                }
                setSelectedItem(-1);
                setModalVisible(false);
              }}
              style={{
                width: 100,
                borderRadius: 20,
                borderWidth: 2,
                paddingHorizontal: 20,
                // paddingVertical: 1,
                borderColor: "black",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  autoClassifyButton: {
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "black",
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: "#FAF6ED", 
  },
  autoClassifyButtonSelected: {
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#4AC79F",
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: "#4AC79F",
  },
});