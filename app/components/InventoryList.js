import React from "react";
import { RefreshControl, FlatList, StyleSheet, Text, View } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import TouchableScale from "react-native-touchable-scale";

const list = [
  {
    name: "🍌bananas🍌",
    avatar_url:
      "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg",
    subtitle: "2",
  },
  {
    name: "🍌bananas🍌",
    avatar_url:
      "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg",
    subtitle: "5",
  },
  {
    name: "🍌bananas🍌",
    avatar_url:
      "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg",
    subtitle: "2",
  },
  {
    name: "🍌bananas🍌",
    avatar_url:
      "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg",
    subtitle: "5",
  },
  {
    name: "🍌bananas🍌",
    avatar_url:
      "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg",
    subtitle: "2",
  },
  {
    name: "🍌bananas🍌",
    avatar_url:
      "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg",
    subtitle: "5",
  },
  {
    name: "🍌bananas🍌",
    avatar_url:
      "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg",
    subtitle: "2",
  },
  {
    name: "🍌bananas🍌",
    avatar_url:
      "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg",
    subtitle: "5",
  },
  {
    name: "🍌bananas🍌",
    avatar_url:
      "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg",
    subtitle: "2",
  },
  {
    name: "🍌bananas🍌",
    avatar_url:
      "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg",
    subtitle: "5",
  },
  {
    name: "🍌bananas🍌",
    avatar_url:
      "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg",
    subtitle: "2",
  },
  {
    name: "🍌bananas🍌",
    avatar_url:
      "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg",
    subtitle: "5",
  },
  {
    name: "🍌bananas🍌",
    avatar_url:
      "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg",
    subtitle: "2",
  },
  {
    name: "🍌bananas🍌",
    avatar_url:
      "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg",
    subtitle: "5",
  },
  {
    name: "🍌bananas🍌",
    avatar_url:
      "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg",
    subtitle: "2",
  },
  {
    name: "🍌bananas🍌",
    avatar_url:
      "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg",
    subtitle: "5",
  },
];

keyExtractor = (item, index) => index.toString();

renderItem = ({ item }) => (
  <ListItem
    // bottomDivider
    containerStyle={styles.listItem}
    Component={TouchableScale}
    friction={90}
    tension={100}
    activeScale={0.95}
  >
    <Avatar
      rounded
      title={item.name[0]}
      source={item.avatar_url && { uri: item.avatar_url }}
    />
    <ListItem.Content>
      <ListItem.Title>
        <Text style={styles.text}>{item.name}</Text>
      </ListItem.Title>
      <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle>
    </ListItem.Content>
    {/* <ListItem.Chevron /> */}
  </ListItem>
);

const InventoryList = () => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={keyExtractor}
        data={list}
        renderItem={renderItem}
        // extraData={this.state}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

// const onRefresh = React.useCallback(async () => {
//   setRefreshing(true);
//   if (listData.length < 10) {
//     try {
//       let response = await fetch(
//         'http://www.mocky.io/v2/5e3315753200008abe94d3d8?mocky-delay=2000ms',
//       );
//       let responseJson = await response.json();
//       console.log(responseJson);
//       setListData(responseJson.result.concat(initialData));
//       setRefreshing(false)
//     } catch (error) {
//       console.error(error);
//     }
//   }
//   else{
//     ToastAndroid.show('No more new data available', ToastAndroid.SHORT);
//     setRefreshing(false)
//   }
// }, [refreshing]);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    marginLeft: 30,
    marginRight: 15,
    justifyContent: "center",
    flexDirection: "row",
  },
  list: {
    // borderRadius: 20,
    // paddingTop: 50
  },
  listItem: {
    borderRadius: 10,
    marginRight: 15,
    marginTop: 7,
    marginBottom: 7,
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

export default InventoryList;
