import * as React from 'react';

import { View, ScrollView, ColorValue } from 'react-native';
import { IsOnViewport, OnViewport } from 'react-native-on-viewport';

const Box = ({ backgroundColor }: { backgroundColor: ColorValue }) => <View
  style={{ backgroundColor, height: 300, width: 400 }} />;

const colors = ['blue', 'red', 'green', 'yellow', 'black'];

export default function App() {
  // @ts-ignore
  return (
    <View>
      <OnViewport>
        <ScrollView style={{ flexGrow: 1, flexShrink: 1 }} scrollEventThrottle={1}>
          {colors.map((color, index) => (
            <IsOnViewport
              id={`${index}${color}`}
              onViewport={(status) => {
                if (status) console.log(`${color} IN`);
                else console.log(`${color} OUT`);
              }}
              key={index}
            >
              <Box backgroundColor={color} />
            </IsOnViewport>
          ))}
        </ScrollView>
      </OnViewport>
    </View>

  );
}
