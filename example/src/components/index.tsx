import { ColorValue, View } from 'react-native';
import * as React from 'react';

const HEIGHT = 300;

export const Box = ({ backgroundColor }: { backgroundColor: ColorValue }) => (
  <View style={{ backgroundColor, height: HEIGHT, width: '100%' }}>
    <View
      style={{
        backgroundColor: 'black',
        opacity: 0.3,
        height: HEIGHT / 2,
        width: '100%',
      }}
    />
    <View
      style={{
        backgroundColor: 'black',
        opacity: 0.6,
        height: HEIGHT / 2,
        width: '100%',
      }}
    />
  </View>
);
