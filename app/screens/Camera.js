import { StatusBar } from "expo-status-bar";
import React from "react";
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
} from "react-native";
import TouchableScale from "react-native-touchable-scale";
import { ListItem, Avatar } from "react-native-elements";

import { Camera } from "expo-camera";
import { Header } from "react-native-elements";
import * as Sharing from "expo-sharing";
import * as ImageManipulator from "expo-image-manipulator";
import { AntDesign } from "@expo/vector-icons";
import SlidingUpPanel from "rn-sliding-up-panel";

const { height } = Dimensions.get("window");

let camera;

const testInventory = [
  {
    category: "dairy",
    expiry_date: null,
    frozen: false,
    item_class: null,
    name: "Milk",
    emoji: "🐮",
    price: 3,
    purchase_date: null,
    quantity: 2,
    remove_date: null,
    status: "uneaten",
  },
  {
    category: "meat",
    expiry_date: null,
    frozen: false,
    emoji: "🥩",
    item_class: null,
    name: "Chicken tenders",
    price: 3,
    purchase_date: null,
    quantity: 2,
    remove_date: null,
    status: "uneaten",
  },
  {
    category: "grain",
    expiry_date: null,
    frozen: false,
    item_class: null,
    // emoji: "🌾",
    name: "Bread",
    price: 3,
    purchase_date: null,
    quantity: 2,
    remove_date: null,
    status: "uneaten",
  },
  {
    category: "beverage",
    expiry_date: null,
    emoji: "🥤",
    frozen: false,
    item_class: null,
    name: "Coca-cola",
    price: 3,
    purchase_date: null,
    quantity: 2,
    remove_date: null,
    status: "uneaten",
  },
  {
    category: "dairy",
    expiry_date: null,
    frozen: false,
    item_class: null,
    name: "Milk",
    emoji: "🐮",
    price: 3,
    purchase_date: null,
    quantity: 2,
    remove_date: null,
    status: "uneaten",
  },
  {
    category: "meat",
    expiry_date: null,
    frozen: false,
    emoji: "🥩",
    item_class: null,
    name: "Chicken tenders",
    price: 3,
    purchase_date: null,
    quantity: 2,
    remove_date: null,
    status: "uneaten",
  },
  {
    category: "grain",
    expiry_date: null,
    frozen: false,
    item_class: null,
    // emoji: "🌾",
    name: "Bread",
    price: 3,
    purchase_date: null,
    quantity: 2,
    remove_date: null,
    status: "uneaten",
  },
  {
    category: "beverage",
    expiry_date: null,
    emoji: "🥤",
    frozen: false,
    item_class: null,
    name: "Coca-cola",
    price: 3,
    purchase_date: null,
    quantity: 2,
    remove_date: null,
    status: "uneaten",
  },
  {
    category: "dairy",
    expiry_date: null,
    frozen: false,
    item_class: null,
    name: "Milk",
    emoji: "🐮",
    price: 3,
    purchase_date: null,
    quantity: 2,
    remove_date: null,
    status: "uneaten",
  },
  {
    category: "meat",
    expiry_date: null,
    frozen: false,
    emoji: "🥩",
    item_class: null,
    name: "Chicken tenders",
    price: 3,
    purchase_date: null,
    quantity: 2,
    remove_date: null,
    status: "uneaten",
  },
  {
    category: "grain",
    expiry_date: null,
    frozen: false,
    item_class: null,
    // emoji: "🌾",
    name: "Bread",
    price: 3,
    purchase_date: null,
    quantity: 2,
    remove_date: null,
    status: "uneaten",
  },
  {
    category: "beverage",
    expiry_date: null,
    emoji: "🥤",
    frozen: false,
    item_class: null,
    name: "Coca-cola",
    price: 3,
    purchase_date: null,
    quantity: 2,
    remove_date: null,
    status: "uneaten",
  },
];

export default function App() {
  const [startCamera, setStartCamera] = React.useState(false);
  const [previewVisible, setPreviewVisible] = React.useState(false);
  const [capturedImage, setCapturedImage] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [ocrsend, setOcrsend] = React.useState(false);
  const [arrow, setArrow] = React.useState("arrowup");
  const [inventoryList, setInventoryList] = React.useState([]);
  const [allowDragging, setAllowDragging] = React.useState(true);
  const panelRef = React.useRef(null);

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
      //Fix iOS specific issue to send image
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
    const ocrResult = await fetch(
      "http://max-ocr.codait-prod-41208c73af8fca213512856c7a09db52-0000.us-east.containers.appdomain.cloud/model/predict",
      {
        method: "POST",
        body: formData,
        header: {
          "content-type": "multipart/form-data",
          accept: "application/json",
        },
      }
    );
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
      "https://02f401bd.au-syd.apigw.appdomain.cloud/api/parseImageText",
      {
        method: "POST",
        body: { text: text },
        header: {
          "content-type": "application/json",
          accept: "application/json",
        },
      }
    );
    const parseResultObject = await parseResult.json();
    if (parseResultObject.error) {
      Alert.alert("Something went wrong parsing your image, please re-scan");
      setInventoryList(testInventory);
      setLoading(false);
      return;
    }
    console.log(parseResultObject);
    setInventoryList(parseResultObject.inventoryList);
    setLoading(false);
  };
  const __retakePicture = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
    __startCamera();
  };

  const deleteInventoryItem = (id) => {
    const currentInventory = inventoryList;
    console.log("Deleting item", id, currentInventory[id].name);
    delete currentInventory[id];
    // currentInventory.delete(id);
    setInventoryList(currentInventory);
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
              inventoryList={inventoryList}
              deleteInventoryItem={deleteInventoryItem}
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
    // marginRight: 30,
    marginHorizontal: 30,
    marginTop: 7,
    marginBottom: 7,
    // flex: 1,
    // shadowOffset:{  width: 10,  height: 10,  },
    // shadowColor: '#FFFFFF',
    // shadowRadius: 100,
    // shadowOpacity: 1,
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
  inventoryList,
  deleteInventoryItem,
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
                  <ScrollView
                    onTouchStart={() => setAllowDragging(false)}
                    onTouchEnd={() => setAllowDragging(true)}
                    onTouchCancel={() => setAllowDragging(false)}
                  >
                    {/* For each object in inventoryList render listItem, add handlers for object click (modal) and delete (array position) */}
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "column",
                      }}
                    >
                      <ListItems
                        inventoryList={inventoryList}
                        deleteInventoryItem={deleteInventoryItem}
                      />
                    </View>
                  </ScrollView>
                )}
              </View>
            </View>
          </SlidingUpPanel>
        </View>
      </ImageBackground>
    </View>
  );
};

const ListItems = ({ inventoryList, deleteInventoryItem }) => {
  // console.log("inside ListItems", inventoryList);
  return inventoryList.map((item, key) => {
    console.log("KEY", key, item);
    return (
      <ListItem
        key={key}
        containerStyle={styles.listItem}
        Component={TouchableScale}
        friction={90}
        tension={100}
        activeScale={0.95}
      >
        {item.emoji ? (
          <Text style={{ fontSize: 30 }}>{item.emoji}</Text>
        ) : (
          <Text>{"      "}</Text>
        )}
        <ListItem.Content>
          <ListItem.Title>
            <Text style={styles.text}>{item.name}</Text>
          </ListItem.Title>
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
