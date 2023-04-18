import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ScrollViewExample from './screens/ScrollViewExample';
import FlatListExample from './screens/FlatListExample';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{
        tabBarIconStyle: { display: 'none' },
        tabBarLabelStyle: { fontSize: 18 },
      }}>
        <Tab.Screen
          name='ScrollViewExample'
          component={ScrollViewExample}
        />
        <Tab.Screen
          name='FlatListExample'
          component={FlatListExample}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
