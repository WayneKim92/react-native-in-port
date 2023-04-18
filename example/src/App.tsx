import * as React from 'react';

import { View, ScrollView, ColorValue, FlatList } from 'react-native';
import { IsOnViewport, InViewPortScrollEmitter } from 'react-native-on-viewport';

const Box = ({ backgroundColor }: { backgroundColor: ColorValue }) => <View
  style={{ backgroundColor, height: 300, width: 400 }} />;

const colors = ['blue', 'red', 'green', 'yellow', 'black'];

// @ts-ignore TODO: 별도의 스크린으로 빼자.
const AppForScrollViewExample = () => {
  return (
    <View>
      <InViewPortScrollEmitter throttleTime={100}>
        <ScrollView style={{ flexGrow: 1, flexShrink: 1 }} scrollEventThrottle={1}>
          {colors.map((color, index) => (
            <IsOnViewport
              viewportMargin={{ top: 0 }}
              detectType={'incompletely'}
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
      </InViewPortScrollEmitter>
    </View>
  );
};

const AppForFlatListExample = () => {
  return (
    <View>
      <InViewPortScrollEmitter throttleTime={500}>
        <FlatList data={colors} renderItem={(data) => {
          return (
            <IsOnViewport
              viewportMargin={{ top: 0 }}
              detectType={'incompletely'}
              onViewport={(status) => {
                if (status) console.log(`${data.item} IN`);
                else console.log(`${data.item} OUT`);
              }}
            >
              <Box backgroundColor={data.item} />
            </IsOnViewport>
          );
        }} />
      </InViewPortScrollEmitter>
    </View>
  );
}

export default AppForFlatListExample
