import React, { useState } from "react";
import { Alert } from "react-native";
import { StyleSheet, View } from "react-native";
import { Header, Button, Input, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import jwt_decode from "jwt-decode";
import * as SecureStore from "expo-secure-store";

export default function Auth(props) {
  const [authState, setAuthState] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");
  const [name, setName] = useState("");

  async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
  }

  async function onLogin() {
    const result = await fetch(
      "https://02f401bd.au-syd.apigw.appdomain.cloud/api/login?" +
        new URLSearchParams({
          email: email,
          password: password,
        })
    );
    if (!result.ok) {
      const message = `An error has occured: ${result.status}`;
      throw new Error(message);
    }
    const jsonResult = await result.json();
    if (jsonResult.failed) {
      Alert.alert("Username or email was incorrect");
    } else {
      console.log("logged in", jsonResult);
      console.log(jwt_decode(jsonResult.token));
      save("token", jsonResult.token);
      setEmail("");
      setPassword("");
      props.setLoggedIn(true);
    }
  }

  async function onRegister() {
    if (password !== secondPassword) {
      Alert.alert("Passwords do not match");
      return;
    }
    console.log(email, password, name);
    const result = await fetch(
      "https://02f401bd.au-syd.apigw.appdomain.cloud/api/register?" +
        new URLSearchParams({
          email: email,
          password: password,
          name: name,
        }),
      { method: "POST" }
    ).catch((err) => err);
    if (!result.ok) {
      const message = `An error has occured: ${result.status}`;
      throw new Error(message);
    }
    const jsonResult = await result.json();
    if (jsonResult.failed) {
      Alert.alert("Email is already taken");
    } else {
      console.log("registerd", jsonResult);
      console.log(jwt_decode(jsonResult.token));
      save("token", jsonResult.token);
      setEmail("");
      setPassword("");
      setSecondPassword("");
      setName("");
      props.setLoggedIn(true);
    }
  }

  console.log("AuthsTate", authState);
  return (
    <View style={styles.container}>
      {authState === false ? (
        <View style={styles.container}>
          <Header
            placement="left"
            backgroundColor="#FAF6ED"
            centerComponent={{
              text: "Login",
              style: styles.title,
            }}
          />
          <Input
            placeholder="email@address.com"
            label="Email"
            autoCapitalize="none"
            style={{ paddingLeft: 10 }}
            containerStyle={{ paddingHorizontal: 20 }}
            leftIcon={<Icon name="envelope" size={24} color="black" />}
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
          <Input
            placeholder="Password"
            label="Password"
            secureTextEntry={true}
            style={{ paddingLeft: 10 }}
            containerStyle={{ paddingHorizontal: 20 }}
            leftIcon={<Icon name="lock" size={34} color="black" />}
            onChangeText={(text) => setPassword(text)}
            value={password}
          />
          <Button
            icon={
              <Icon
                style={{ paddingLeft: 10 }}
                name="arrow-right"
                size={15}
                color="white"
              />
            }
            style={{ paddingHorizontal: 20 }}
            iconRight
            onPress={onLogin}
            title="Login"
          />
          <Text
            style={{
              textAlignVertical: "center",
              textAlign: "center",
              paddingVertical: 20,
            }}
          >
            Don't have an account yet?
          </Text>
          <Button
            icon={
              <Icon
                style={{ paddingLeft: 10 }}
                name="user"
                size={15}
                color="white"
              />
            }
            style={{ paddingHorizontal: 20 }}
            iconRight
            onPress={() => setAuthState(true)}
            title="Create an account"
          />
        </View>
      ) : (
        <View style={styles.container}>
          <Header
            placement="left"
            backgroundColor="#FAF6ED"
            centerComponent={{
              text: "Register",
              style: styles.title,
            }}
          />
          <Input
            placeholder="Name"
            label="Name"
            style={{ paddingLeft: 10 }}
            containerStyle={{ paddingHorizontal: 20 }}
            leftIcon={<Icon name="user" size={24} color="black" />}
            onChangeText={(text) => setName(text)}
            value={name}
          />
          <Input
            placeholder="email@address.com"
            label="Email"
            autoCapitalize="none"
            secureTextEntry={false}
            style={{ paddingLeft: 10 }}
            containerStyle={{ paddingHorizontal: 20 }}
            leftIcon={<Icon name="envelope" size={24} color="black" />}
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
          <Input
            placeholder="Password"
            label="Password"
            secureTextEntry={true}
            style={{ paddingLeft: 10 }}
            containerStyle={{ paddingHorizontal: 20 }}
            leftIcon={<Icon name="lock" size={34} color="black" />}
            onChangeText={(text) => setPassword(text)}
            value={password}
          />
          <Input
            placeholder="Password"
            label="Re-enter Password"
            secureTextEntry={true}
            style={{ paddingLeft: 10 }}
            containerStyle={{ paddingHorizontal: 20 }}
            leftIcon={<Icon name="lock" size={34} color="black" />}
            onChangeText={(text) => setSecondPassword(text)}
            value={secondPassword}
          />
          <Button
            icon={
              <Icon
                style={{ paddingLeft: 10 }}
                name="arrow-right"
                size={15}
                color="white"
              />
            }
            style={{ paddingHorizontal: 20 }}
            iconRight
            onPress={onRegister}
            title="Register"
          />
          <Button
            style={{ paddingHorizontal: 20, paddingVertical: 20 }}
            title="Go back"
            onPress={() => setAuthState(false)}
          ></Button>
        </View>
      )}
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
