import * as React from 'react';
import { FlatList, View } from 'react-native';
import { Box } from '../components';

import { Ship, LightHouse } from 'react-native-on-viewport';

const colors = ['pink', 'gray', 'brown', 'yellow', 'black'];

const FlatListExample = () => {
  return (
    <View>
      <LightHouse throttleTime={1000}>
        <FlatList data={colors} renderItem={(data) => {
          return (
            <Ship
              detectType={'incompletely'}
              onViewport={(status) => {
                if (status) console.log(`${data.item} IN`);
                else console.log(`${data.item} OUT`);
              }}
            >
              <Box backgroundColor={data.item} />
            </Ship>
          );
        }} />
      </LightHouse>
    </View>
  );
};

export default FlatListExample;
