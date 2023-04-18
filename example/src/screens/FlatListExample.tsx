import * as React from 'react';
import { FlatList, View } from 'react-native';
import { Box } from '../components';

import { InViewPort, InViewPortScrollEmitter } from 'react-native-on-viewport';

const colors = ['pink', 'gray', 'brown', 'yellow', 'black'];

const FlatListExample = () => {
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
};

export default FlatListExample;
