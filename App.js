// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddTravelScreen from './screens/AddTravelScreen';
import TravelScreen from './screens/TravelScreen';
import TravelDetailScreen from './screens/TravelDetailScreen';
import { Button } from 'react-native';


const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#621FF7',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="TravelScreen"
          component={TravelScreen}
          options={{ title: 'Travel List' }}
        />
        <Stack.Screen
          name="AddTravelScreen"
          component={AddTravelScreen}
          options={{ title: 'Add Travel' }}
        />
        <Stack.Screen
          name="TravelDetailScreen"
          component={TravelDetailScreen}
          options={{ title: 'Travel Detail' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
