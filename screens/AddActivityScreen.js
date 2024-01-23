import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Keyboard, Alert, Vibration } from 'react-native';
import { Input, Button } from '@rneui/themed';
import * as SQLite from 'expo-sqlite';


export default function AddActivityScreen({ navigation }) {

  const [pvm, setPvm] = useState('');
  const [activity, setActivity] = useState('');
  const [duration, setDuration] = useState('');
  const [activities, setActivities] = useState([]);

  const db = SQLite.openDatabase('activityhistory.db');

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists activityhistory (id integer primary key not null, pvm text, activity text, duration text);');
    },
      null,
      updateList
    );
  }, []);

  const saveItem = () => {
    console.log('saveItem:', pvm, activity, duration)
    Alert.alert('Aktiviteetti lisätty!')
    db.transaction(
      tx => {
        tx.executeSql('insert into activityhistory (pvm, activity, duration) values (?, ?, ?);', [pvm, activity, duration]);
      },
      null,
      updateList
    )
  };

  const updateList = () => {
    console.log('updateList ADD ACTIVITY')
    db.transaction(
      tx => {
        tx.executeSql('select * from activityhistory;', [], (_, { rows }) => {
          setActivities(rows._array);
          setPvm('');
          setActivity('');
          setDuration('');
          Keyboard.dismiss();
        });
      });
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputsContainer}>
        <Input
          label='Päivämäärä'
          placeholder='PP.KK.VVVV'
          onChangeText={setPvm}
          value={pvm}>
        </Input>
        <Input
          label='Mitä teit?'
          placeholder='Juoksu'
          onChangeText={setActivity}
          value={activity}>
        </Input>
        <Input
          label='Kesto'
          placeholder='45 minuuttia'
          onChangeText={setDuration}
          value={duration}>
        </Input>
      </View>

      <Button
        containerStyle={styles.button}
        raised icon={{ name: 'save', color: 'white' }}
        title='Tallenna'
        onPress={() => {saveItem(); Vibration.vibrate(150)}}
        color="#0492C2"
        size='lg'>
      </Button>

      <Button
        containerStyle={{ ...styles.button, marginVertical: 20}}
        raised icon={{ name: 'article', color: 'white' }}
        title='Aktiviteettihistoria'
        onPress={() => {navigation.navigate('History'); console.log('Aktiviteeteista historiaan')}}
        color="#ff6666"
        size='lg'>
      </Button>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  inputsContainer: {
    marginTop: 20,
    width: '80%'
  },
  button: {
    width: '80%'
  }
});
