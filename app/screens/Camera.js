import { StatusBar } from "expo-status-bar";
import React, { useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Platform,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import TouchableScale from "react-native-touchable-scale";
import { ListItem, Avatar } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { Camera } from "expo-camera";
import { Header, Input } from "react-native-elements";
import * as Sharing from "expo-sharing";
import * as ImageManipulator from "expo-image-manipulator";
import { AntDesign } from "@expo/vector-icons";
import SlidingUpPanel from "rn-sliding-up-panel";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useFocusEffect } from "@react-navigation/native";
import Constants from "expo-constants";

import { foodClasses } from "../components/foodClasses";

const { height } = Dimensions.get("window");
const apiUrl = Constants.manifest.extra.apiUrl;
const ocrEndpoint = Constants.manifest.extra.ocrEndpoint;

let camera;
const testInventory = [
  {
    category: "dairy",
    expiry_date: null,
    days_to_expiry: 5,
    frozen: false,
    item_class: null,
    name: "Milk",
    emoji: "🐮",
    price: 3,
    purchase_date: new Date(),
    quantity: 2,
    remove_date: null,
    status: "uneaten",
  },
  {
    category: "meat",
    expiry_date: null,
    days_to_expiry: 3,
    frozen: false,
    emoji: "🥩",
    item_class: null,
    name: "Chicken tenders",
    price: 10,
    purchase_date: new Date(),
    quantity: 5,
    remove_date: null,
    status: "uneaten",
  },
  {
    category: "grain",
    expiry_date: null,
    days_to_expiry: 10,
    frozen: false,
    item_class: null,
    emoji: "🌾",
    name: "Bread",
    price: 2,
    purchase_date: new Date(),
    quantity: 3,
    remove_date: null,
    status: "uneaten",
  },
  {
    category: "beverage",
    expiry_date: null,
    days_to_expiry: 20,
    emoji: "🥤",
    frozen: false,
    item_class: null,
    name: "Coca-cola",
    price: 1,
    purchase_date: new Date(),
    quantity: 10,
    remove_date: null,
    status: "uneaten",
  },
];

export default function App(props) {
  const { inventoryList, setInventoryList, token } = props;
  const [startCamera, setStartCamera] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ocrsend, setOcrsend] = useState(false);
  const [arrow, setArrow] = useState("arrowup");
  const [localInventoryList, setLocalInventoryList] = useState([]);
  const [allowDragging, setAllowDragging] = useState(true);
  const [selectedItem, setSelectedItem] = useState(-1);
  const [modalVisible, setModalVisible] = useState(false);
  const panelRef = useRef(null);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  //Automatically start camera and disable camera upon using scanner tab
  useFocusEffect(
    useCallback(() => {
      async function start() {
        await __startCamera();
      }
      start();
      return () => {
        setStartCamera(false);
      };
    }, [])
  );

  const __startCamera = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    console.log(status);
    if (status === "granted") {
      setStartCamera(true);
    } else {
      Alert.alert("Access denied");
    }
  };
  const __takePicture = async () => {
    let photo = await camera.takePictureAsync({ quality: 0.2, exif: true });
    setPreviewVisible(true);
    //setStartCamera(false)
    setCapturedImage(photo);
    setOcrsend(false);
  };

  let openShareDialogAsync = async (uri) => {
    if (!(await Sharing.isAvailableAsync())) {
      alert(`Uh oh, sharing isn't available on your platform`);
      return;
    }

    await Sharing.shareAsync(uri);
  };

  const __sendPhoto = async () => {
    setOcrsend(true);
    setLoading(true);
    let photo = capturedImage;
    //Crop based on yellow highlight
    let maninpOptions = [
      {
        crop: {
          originX: photo.width * 0.05,
          originY: photo.height * 0.05,
          width: photo.width * 0.9,
          height: photo.height * 0.8,
        },
      },
    ];
    if (Platform.OS === "ios" && capturedImage.exif.Orientation === -90) {
      console.log("Flipping!", photo.uri);
      //Fixes iOS specific issue to send image
      maninpOptions.push({
        rotate: -photo.exif.Orientation,
      });
    }
    photo = await ImageManipulator.manipulateAsync(photo.uri, maninpOptions);
    let localUri = photo.uri;
    let filename = localUri.split("/").pop();
    let formData = new FormData();
    formData.append("image", {
      uri: Platform.OS === "ios" ? localUri.replace("file://", "") : localUri,
      name: filename,
      type: "image/jpg",
    });
    const ocrResult = await fetch(ocrEndpoint, {
      method: "POST",
      body: formData,
      header: {
        "content-type": "multipart/form-data",
        accept: "application/json",
      },
    });
    const ocrResultObject = await ocrResult.json();
    if (ocrResultObject.status !== "ok") {
      Alert.alert("Something went wrong scanning your image");
      setLoading(false);
      return;
    }
    const text = ocrResultObject.text;
    console.log("Text from OCR", ocrResultObject);
    // openShareDialogAsync(photo.uri);
    const parseResult = await fetch(
      `${apiUrl}/parseImageText?` +
        new URLSearchParams({
          token: token,
        }),
      {
        method: "POST",
        body: JSON.stringify({ text: text }),
        header: {
          "content-type": "application/json",
          accept: "application/json",
        },
      }
    );
    const parseResultObject = await parseResult.json();
    if (
      parseResultObject.error ||
      parseResultObject.failed ||
      (parseResultObject.inventory_list &&
        parseResultObject.inventory_list.length === 0)
    ) {
      Alert.alert("Something went wrong parsing your image, please re-scan");
      setLocalInventoryList(testInventory);
      setLoading(false);
      return;
    }
    console.log(parseResultObject);
    let items = parseResultObject.inventory_list;
    for (item of items) {
      if (item.item_class in foodClasses) {
        item.category = foodClasses[item.item_class]["category"];
        item.emoji = foodClasses[item.item_class]["emoji"];
        Date.prototype.addDays = function (days) {
          const date = new Date(this.valueOf());
          date.setDate(date.getDate() + days);
          return date;
        };
        item.expiry_date = new Date().addDays(
          foodClasses[item.item_class]["expiry"]
        );
      }
    }
    setLocalInventoryList(items);
    setLoading(false);
  };
  const __retakePicture = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
    __startCamera();
  };

  const deleteInventoryItem = (id) => {
    const currentInventory = localInventoryList;
    console.log("Deleting item", id, currentInventory[id].name);
    currentInventory.splice(id, 1);
    setLocalInventoryList(currentInventory);
  };

  const CenterHeader = () => {
    return (
      <View
        style={{
          alignItems: "center",
        }}
      >
        <Text style={styles.title}> Scanner</Text>
        <Text style={styles.secondTitle}> Scan your barcode or receipt</Text>
      </View>
    );
  };

  const YellowOutline = () => {
    return (
      <>
        <View
          style={{
            width: 100,
            height: 100,
            position: "absolute",
            left: "7.5%",
            top: "5%",
            borderWidth: 2,
            borderLeftColor: "#FECC66",
            borderBottomColor: "transparent",
            borderRightColor: "transparent",
            borderTopColor: "#FECC66",
          }}
        />
        <View
          style={{
            width: 100,
            height: 100,
            position: "absolute",
            right: "7.5%",
            top: "5%",
            borderWidth: 2,
            borderLeftColor: "transparent",
            borderBottomColor: "transparent",
            borderRightColor: "#FECC66",
            borderTopColor: "#FECC66",
          }}
        />
        <View
          style={{
            width: 100,
            height: 100,
            position: "absolute",
            right: "7.5%",
            bottom: "15%",
            borderWidth: 2,
            borderLeftColor: "transparent",
            borderBottomColor: "#FECC66",
            borderRightColor: "#FECC66",
            borderTopColor: "transparent",
          }}
        />
        <View
          style={{
            width: 100,
            height: 100,
            position: "absolute",
            left: "7.5%",
            bottom: "15%",
            borderWidth: 2,
            borderLeftColor: "#FECC66",
            borderBottomColor: "#FECC66",
            borderRightColor: "transparent",
            borderTopColor: "transparent",
          }}
        />
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Header backgroundColor="#FAF6ED" centerComponent={<CenterHeader />} />
      {startCamera ? (
        <View
          style={{
            flex: 1,
            width: "100%",
          }}
        >
          {previewVisible && capturedImage ? (
            <CameraPreview
              photo={capturedImage}
              savePhoto={__sendPhoto}
              retakePicture={__retakePicture}
              ocrsend={ocrsend}
              panelRef={panelRef}
              arrow={arrow}
              setArrow={setArrow}
              loading={loading}
              allowDragging={allowDragging}
              setAllowDragging={setAllowDragging}
              localInventoryList={localInventoryList}
              deleteInventoryItem={deleteInventoryItem}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              setLocalInventoryList={setLocalInventoryList}
              inventoryList={inventoryList}
              setInventoryList={setInventoryList}
              setIsDatePickerVisible={setIsDatePickerVisible}
              isDatePickerVisible={isDatePickerVisible}
            />
          ) : (
            <Camera
              type={Camera.Constants.Type.back}
              flashMode={"off"}
              style={{ flex: 1 }}
              ref={(r) => {
                camera = r;
              }}
            >
              <YellowOutline />
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  flexDirection: "row",
                  flex: 1,
                  width: "100%",
                  padding: 20,
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    alignSelf: "center",
                    flex: 1,
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={__takePicture}
                    style={{
                      width: 70,
                      height: 70,
                      bottom: 0,
                      borderRadius: 50,
                      backgroundColor: "#fff",
                    }}
                  />
                </View>
              </View>
            </Camera>
          )}
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={__startCamera}
            style={{
              width: 130,
              borderRadius: 4,
              backgroundColor: "#14274e",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              height: 40,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Take picture
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <StatusBar style="auto" backgroundColor="#FAF6ED" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 0,
  },
  title: {
    fontFamily: "SFProDisplay-Heavy",
    fontSize: 24,
    color: "#000",
  },
  secondTitle: {
    fontFamily: "SFProDisplay-Regular",
    fontSize: 15,
    color: "#000",
  },
  listItem: {
    borderRadius: 10,
    marginHorizontal: 30,
    marginTop: 7,
    marginBottom: 7,
  },
  text: {
    fontFamily: "SFProDisplay-Semibold",
    fontSize: 18,
    color: "#000",
  },
});

const CameraPreview = ({
  photo,
  retakePicture,
  savePhoto,
  ocrsend,
  panelRef,
  arrow,
  setArrow,
  loading,
  allowDragging,
  setAllowDragging,
  localInventoryList,
  deleteInventoryItem,
  selectedItem,
  setSelectedItem,
  modalVisible,
  setModalVisible,
  setLocalInventoryList,
  inventoryList,
  setInventoryList,
  isDatePickerVisible,
  setIsDatePickerVisible,
}) => {
  return (
    <View
      style={{
        backgroundColor: "transparent",
        flex: 1,
        width: "100%",
        height: "100%",
      }}
    >
      <ImageBackground
        source={{ uri: photo && photo.uri }}
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
          }}
        >
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}
          >
            <ModalContent
              selectedItem={selectedItem}
              localInventoryList={localInventoryList}
              setSelectedItem={setSelectedItem}
              setModalVisible={setModalVisible}
              setLocalInventoryList={setLocalInventoryList}
              setIsDatePickerVisible={setIsDatePickerVisible}
              isDatePickerVisible={isDatePickerVisible}
            />
          </Modal>
          <SlidingUpPanel
            ref={(c) => (panelRef = c)}
            draggableRange={{ top: height / 1.5, bottom: 50 }}
            onDragEnd={(position, gestureState) => {
              if (gestureState.dy < 0) {
                setArrow("arrowdown");
              } else {
                setArrow("arrowup");
              }
            }}
            allowDragging={allowDragging}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "#FAF6ED",
                position: "relative",
                borderTopLeftRadius: 50,
                borderTopRightRadius: 50,
                maxHeight: height / 1.5,
              }}
            >
              <View
                style={{
                  height: 50,
                  backgroundColor: "#FAF6ED",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderTopLeftRadius: 50,
                  borderTopRightRadius: 50,
                  flexDirection: "row",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    panelRef.hide();
                    setArrow("arrowup");
                    retakePicture();
                  }}
                  style={{
                    paddingHorizontal: 40,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      fontSize: 20,
                    }}
                  >
                    Re-take
                  </Text>
                </TouchableOpacity>
                {arrow === "arrowdown" && ocrsend && (
                  <TouchableOpacity
                    onPress={() => {
                      console.log("Opening modal");
                      setSelectedItem(-1);
                      setModalVisible(!modalVisible);
                    }}
                    style={{
                      marginLeft: 100,
                      padding: 10,
                      alignItems: "center",
                    }}
                  >
                    <AntDesign name="pluscircleo" size={30} color="black" />
                  </TouchableOpacity>
                )}
                {ocrsend ? (
                  <TouchableOpacity
                    onPress={() => {
                      if (arrow === "arrowup") {
                        panelRef.show();
                        setArrow("arrowdown");
                      } else {
                        panelRef.hide();
                        setArrow("arrowup");
                      }
                    }}
                    style={{
                      paddingRight: 40,
                      alignItems: "center",
                    }}
                  >
                    <AntDesign name={arrow} size={30} color="black" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={savePhoto}
                    style={{
                      paddingRight: 40,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "black",
                        fontSize: 20,
                      }}
                    >
                      Scan
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  paddingTop: 0,
                }}
              >
                {loading ? (
                  <ActivityIndicator
                    style={{ marginBottom: 250 }}
                    size="large"
                    color="black"
                  />
                ) : (
                  <View style={{ flex: 1 }}>
                    {Object.keys(localInventoryList).length > 0 && (
                      <View
                        style={{
                          flexDirection: "row",
                          direction: "rtl",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            let localInventoryWithou;

                            setInventoryList(
                              inventoryList.concat(localInventoryList)
                            );
                            retakePicture();
                          }}
                          style={{
                            borderRadius: 20,
                            borderWidth: 2,
                            paddingHorizontal: 30,
                            borderColor: "black",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            marginLeft: 30,
                          }}
                        >
                          <Text
                            style={{
                              fontWeight: "bold",
                              textAlign: "center",
                            }}
                          >
                            add all items
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            console.log("Clearing all inventoryList");
                            setLocalInventoryList([]);
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
                            clear all
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    <ScrollView
                      onTouchStart={() => setAllowDragging(false)}
                      onTouchEnd={() => setAllowDragging(true)}
                      onTouchCancel={() => setAllowDragging(false)}
                    >
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "column",
                        }}
                      >
                        <ListItems
                          localInventoryList={localInventoryList}
                          deleteInventoryItem={deleteInventoryItem}
                          setSelectedItem={setSelectedItem}
                          setModalVisible={setModalVisible}
                          modalVisible={modalVisible}
                        />
                        <Text
                          style={{
                            fontFamily: "SFProDisplay-Semibold",
                            fontSize: 18,
                            color: "#000",
                            textAlign: "center",
                            padding: 10,
                          }}
                        >
                          no more items 👀
                        </Text>
                      </View>
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>
          </SlidingUpPanel>
        </View>
      </ImageBackground>
    </View>
  );
};

const ListItems = ({
  localInventoryList,
  deleteInventoryItem,
  setSelectedItem,
  setModalVisible,
  modalVisible,
}) => {
  if (Object.keys(localInventoryList).length === 0) {
    return null;
  }
  return localInventoryList.map((item, key) => {
    return (
      <ListItem
        key={key}
        containerStyle={styles.listItem}
        Component={TouchableScale}
        friction={90}
        tension={100}
        activeScale={0.95}
        onPress={() => {
          setSelectedItem(key);
          setModalVisible(!modalVisible);
        }}
      >
        {item.emoji ? (
          <Text style={{ fontSize: 30 }}>{item.emoji}</Text>
        ) : (
          <Text>{"      "}</Text>
        )}
        <ListItem.Content>
          <ListItem.Title>
            <Text style={styles.text}>{item.item_class}</Text>
          </ListItem.Title>
          <ListItem.Subtitle
            style={{
              color: "black",
              fontSize: 12,
              fontWeight: "600",
            }}
          >
            {item.name}
          </ListItem.Subtitle>
        </ListItem.Content>
        <TouchableOpacity
          onPress={() => deleteInventoryItem(key)}
          style={{
            paddingRight: 5,
          }}
        >
          <AntDesign name="close" size={30} color="black" />
        </TouchableOpacity>
      </ListItem>
    );
  });
};

const ModalContent = ({
  selectedItem,
  localInventoryList,
  setSelectedItem,
  setModalVisible,
  setLocalInventoryList,
  isDatePickerVisible,
  setIsDatePickerVisible,
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

  const [dateValue, setDateValue] = useState(
    item && item.days_to_expiry
      ? new Date().addDays(item.days_to_expiry)
      : new Date()
  );

  const DatePickerComponent = () => (
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
            setItem({ ...item, expiry_date: selectedDate });
          }}
        />
      ) : (
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => setIsDatePickerVisible(true)}
        >
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            style={{ width: 200 }}
            value={dateValue}
            mode="time"
            is24Hour={true}
            display="default"
            onConfirm={(selectedDate) => {
              setDateValue(selectedDate);
              setItem({ ...item, expiry_date: selectedDate });
              setIsDatePickerVisible(false);
            }}
            onCancel={() => {
              setIsDatePickerVisible(false);
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
          paddingTop: 100,
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
          <Input label="expiry date" InputComponent={DatePickerComponent} />
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
