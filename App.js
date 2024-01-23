import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import HistoryScreen from './screens/HistoryScreen';
import AddActivityScreen from './screens/AddActivityScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerTitleAlign: 'center'}}>
        <Stack.Screen 
          name="Homepage" 
          component={HomeScreen} 
          options={{ title: 'Tervetuloa ActivityAppiin!', ...styles.navigationHeader }}
        />
        <Stack.Screen 
          name="History" 
          component={HistoryScreen} 
          options={{ title: 'Aktiviteettihistoria', ...styles.navigationHeader }}
        />
        <Stack.Screen 
          name="Add Activity" 
          component={AddActivityScreen} 
          options={{ title: 'Lisää aktiviteetti', ...styles.navigationHeader }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationHeader: {
    headerStyle: {
      backgroundColor: '#0492C2'
    },
    headerTintColor: '#FFF'
  }
});
