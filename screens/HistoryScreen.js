import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Alert, Vibration } from 'react-native';
import { Button, Card, Text } from '@rneui/themed';
import * as SQLite from 'expo-sqlite';

export default function HistoryScreen({ navigation }) {

  const [activities, setActivities] = useState([]);

  const db = SQLite.openDatabase('activityhistory.db');

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM activityhistory;', [], (_, { rows }) => {
        setActivities(rows._array);
      })
    })
  }, []);


  const deleteItem = (id) => {
    db.transaction(
      tx => tx.executeSql('DELETE FROM activityhistory WHERE id = ?;', [id]), null, updateList)
  }

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM activityhistory;', [], (_, { rows }) => {
        console.log('Rows:', rows)
        setActivities(rows._array)
        Alert.alert('Aktiviteetti poistettu.')
      });
    }, null, null);
  }

  const noActivities = () => {
    return (
      <View style={{ marginTop: 20, alignItems: 'center' }}>
        <Text h2 h2Style={{ color: '#666666' }}>Ei aktiviteetteja</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          data={activities}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) =>
            <Card containerStyle={{ width: 350 }}>
              <Card.Title h2>{item.pvm}</Card.Title>
              <Card.Divider style={{width: 330}}/>
              <Text h4>{item.activity}</Text>
              <Text h4 style={{paddingBottom: 20}}>{item.duration}</Text>
              <Button 
                raised icon={{ name: 'delete', color: 'white' }}
                containerStyle={{ }} 
                color={"red"} 
                title="POISTA" 
                onPress={() => {deleteItem(item.id); Vibration.vibrate(150)}}/>
            </Card>}
          ListEmptyComponent={noActivities}
        >
        </FlatList>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  button: {
    width: "80%"
  },
  listContainer: {
    height: '100%',
  },
});
