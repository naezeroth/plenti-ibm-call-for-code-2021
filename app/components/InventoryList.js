import React, { useState } from "react";
import { RefreshControl, FlatList, StyleSheet, Text, View } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import TouchableScale from "react-native-touchable-scale";

import { Alert } from "react-native";

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
    <Text> {item.emoji} </Text>
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

const InventoryList = (props) => {
  const { inventoryList, refreshInventory } = props;

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    //Refreshing inventory by toggling a boolean
    refreshInventory();
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={keyExtractor}
        data={inventoryList}
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
