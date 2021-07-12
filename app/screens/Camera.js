import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Image,
  Platform,
} from "react-native";
import { Camera } from "expo-camera";
import { Header } from "react-native-elements";
import * as Sharing from "expo-sharing";
import * as ImageManipulator from "expo-image-manipulator";

let camera;

export default function App() {
  const [startCamera, setStartCamera] = React.useState(false);
  const [previewVisible, setPreviewVisible] = React.useState(false);
  const [capturedImage, setCapturedImage] = React.useState(null);
  const [cameraType, setCameraType] = React.useState(
    Camera.Constants.Type.back
  );
  const [flashMode, setFlashMode] = React.useState("off");

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
  };

  let openShareDialogAsync = async (uri) => {
    if (!(await Sharing.isAvailableAsync())) {
      alert(`Uh oh, sharing isn't available on your platform`);
      return;
    }

    await Sharing.shareAsync(uri);
  };

  const __sendPhoto = async () => {
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
    const fetchResult = await fetch(
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
    const result = await fetchResult.json();
    if (result.status !== "ok") {
      Alert.alert("Something went wrong scanning your image");
      return;
    }
    const text = result.text;
    console.log("Text from OCR", result);
    // openShareDialogAsync(photo.uri);
    //TODO Send to our API to parse
    //Get result and add  to state
    //Show different view
  };
  const __retakePicture = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
    __startCamera();
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
            />
          ) : (
            <Camera
              type={cameraType}
              flashMode={flashMode}
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
});

const CameraPreview = ({ photo, retakePicture, savePhoto }) => {
  console.log("photo is", photo);
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
            position: "absolute",
            bottom: 0,
            flexDirection: "row",
            flex: 1,
            width: "100%",
            justifyContent: "space-between",
            backgroundColor: "#FAF6ED",
            height: 70,
            borderTopLeftRadius: "50",
            borderTopRightRadius: "50",
          }}
        ></View>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={retakePicture}
              style={{
                width: 130,
                height: 40,

                alignItems: "center",
                borderRadius: 4,
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
            <TouchableOpacity
              onPress={savePhoto}
              style={{
                width: 130,
                height: 40,

                alignItems: "center",
                borderRadius: 4,
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
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
