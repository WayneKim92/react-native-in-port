import { ColorValue, View } from 'react-native';
import * as React from 'react';

export const Box = ({ backgroundColor }: { backgroundColor: ColorValue }) => <View
  style={{ backgroundColor, height: 300, width: '100%' }} />;
