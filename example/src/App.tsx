import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ScrollViewExample from './screens/ScrollViewExample';
import FlatListExample from './screens/FlatListExample';
import HorizontalExample from './screens/HorizontalExample';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarIconStyle: { display: 'none' },
          tabBarLabelStyle: { fontSize: 18 },
        }}
      >
        <Tab.Screen name="ScrollView" component={ScrollViewExample} />
        <Tab.Screen name="FlatList" component={FlatListExample} />
        <Tab.Screen name="Horizontal" component={HorizontalExample} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
