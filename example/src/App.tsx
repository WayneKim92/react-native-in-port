import * as React from 'react';
import { View, ScrollView, ColorValue, FlatList } from 'react-native';
import { InViewPort, InViewPortScrollEmitter } from 'react-native-on-viewport';

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
            <InViewPort
              viewportMargin={{ top: 0 }}
              detectType={'incompletely'}
              onViewport={(status) => {
                if (status) console.log(`${color} IN`);
                else console.log(`${color} OUT`);
              }}
              key={index}
            >
              <Box backgroundColor={color} />
            </InViewPort>
          ))}
        </ScrollView>
      </InViewPortScrollEmitter>
    </View>
  );
};

const AppForFlatListExample = () => {
  return (
    <View>
      <InViewPortScrollEmitter throttleTime={1000} isFocused={true}>
        <FlatList data={colors} renderItem={(data) => {
          return (
            <InViewPort
              detectType={'incompletely'}
              onViewport={(status) => {
                if (status) console.log(`${data.item} IN`);
                else console.log(`${data.item} OUT`);
              }}
            >
              <Box backgroundColor={data.item} />
            </InViewPort>
          );
        }} />
      </InViewPortScrollEmitter>
    </View>
  );
}

export default AppForFlatListExample
