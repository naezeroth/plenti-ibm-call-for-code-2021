import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { Input } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

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
          paddingVertical: "25%",
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
          <Input
            placeholder="name"
            label="name"
            onChangeText={(text) => setItem({ ...item, name: text })}
            value={item.name}
          />
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
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => {
                setSelectedItem(-1);
                setModalVisible(false);
              }}
              style={{
                width: 130,
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
                borderRadius: 20,
                borderWidth: 2,
                paddingHorizontal: 30,
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
