import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Button, Text, Card, Icon, Image } from '@rneui/themed';
import * as Location from 'expo-location';


export default function HomeScreen({ navigation, route }) {

  API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
  APP_ID = process.env.EXPO_PUBLIC_OWM_APP_ID;

  const initialCoords = {
    latitude: '',
    longitude: '',
  };

  const initialWeather = {
    temperature: '-',
    feelsLike: '-',
    icon: '01d'
  }

  const [coordinates, setCoordinates] = useState(initialCoords)
  const [locationStatus, setLocationStatus] = useState('Sijainti ei tiedossa')
  const [city, setCity] = useState('Odota sijainti')
  const [weather, setWeather] = useState(initialWeather)


  const fetchLocation = async () => {
    setLocationStatus('Haetaan sijaintia...')
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('No permission to access location');
      setLocationStatus('Sijaintitietojen hakeminen kielletty')
      setCity('Hyväksy sijaintitiedot')
    } else {
      try {
        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        console.log(location);
        setCoordinates({ latitude: location.coords.latitude, longitude: location.coords.longitude })
        setLocationStatus('Sijainti löydetty')
        setCity('Paina "Hae kaupunkisi"')
      } catch (error) {
        console.log(error.message);
        Alert.alert('Virhe sijainnin hakemisessa');
      }
    }
  }

  const findCity = async () => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.latitude},${coordinates.longitude}&key=${API_KEY}`)
      const data = await response.json()
      setCity(data.results[0].address_components[2].long_name)
    } catch (error) {
      Alert.alert("Kaupungin hakeminen epäonnistui, yritä uudelleen.")
      console.log(error)
      setCity('Kaupungin hakeminen epäonnistui')
    }
  }

  const getWeather = async () => {
    try {
      const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APP_ID}`)
      const data = await response.json()
      setWeather({ temperature: data.main.temp, feelsLike: data.main.feels_like, icon: data.weather[0].icon })
    } catch (error) {
      Alert.alert("Sään hakeminen epäonnistui, yritä uudelleen.")
      console.log(error)
    }
  }

  useEffect(() => {
    fetchLocation()
  }, []);


  return (
    <View style={styles.container}>
      <Card containerStyle={{ width: 370 }}>
        <Card.Title h2 h2Style={{ color: '#0492C2' }}>Ulkoilusää nyt</Card.Title>
        <Card.Divider style={{ width: 330 }} />
        <View style={{ position: "relative", alignItems: "center" }}>
          <Text h4>{locationStatus}</Text>
          <Text h4 h4Style={{ color: 'green' }}>{city}</Text>
          <Button
            containerStyle={{ ...styles.button, marginVertical: 10 }}
            onPress={findCity}
            color="#0492C2"
          >
            <Icon
              name="location-sharp"
              type='ionicon'
              color='white'
              containerStyle={styles.icon}
            />
            Hae kaupunkisi
          </Button>
          <Button
            containerStyle={{ ...styles.button, marginVertical: 10 }}
            onPress={getWeather}
            color="#0492C2">
            <Icon
              name="partly-sunny-sharp"
              type='ionicon'
              color='white'
              containerStyle={styles.icon}
            />
            Hae sää
          </Button>
          <Text h4>Lämpötila: {weather.temperature} C°</Text>
          <Text h4>Tuntuu kuin: {weather.feelsLike} C°</Text>
          <Image
            source={{ uri: `http://openweathermap.org/img/w/${weather.icon}.png` }}
            containerStyle={{ aspectRatio: 1, width: 100 }}
          />
        </View>
      </Card>

      <Button
        size="lg"
        containerStyle={{ ...styles.button, marginTop: 30 }}
        raised icon={{ name: 'add', color: 'white' }}
        onPress={() => { navigation.navigate('Add Activity'); console.log('HOME -> ADD ACTIVITY') }}
        color="#0492C2">
        Lisää aktiviteetti
      </Button>
      <Button
        size="lg"
        containerStyle={{ ...styles.button, marginTop: 30 }}
        raised icon={{ name: 'article', color: 'white' }}
        title='Aktiviteettihistoria'
        onPress={() => { navigation.navigate('History'); console.log('HOME -> HISTORY') }}
        color="#ff6666">
      </Button>
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
  icon: {
    marginRight: 5
  },
  text: {
    color: '#0492C2'
  }
});
