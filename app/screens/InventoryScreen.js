import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import InventoryList from '../components/InventoryList';
import { Header } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

export default function InventoryScreen() {
    return (
      <View style={styles.container}>
        <Header
          style={styles.header}
          placement="left"  
          // leftComponent={{ icon: 'menu', color: '#fff' }}
          centerComponent={{ text: 'Inventory', style: { color: '#000' } }}
          rightComponent={<Ionicons name="add-circle-outline" size={32} color="white" />}
        />

        {InventoryList()}
      </View>
    );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0
  },
  header: {
    fontSize: 32,
    backgroundColor: '#fff',
  },
});
