import * as React from 'react';
import { FlatList, View } from 'react-native';
import { Box } from '../components';

import { createPort } from 'react-native-on-viewport';

const colors = ['Violet', 'gray', 'brown', 'black'];

const { LightHouse, Ship } = createPort('1');

const FlatListExample = () => {
  return (
    <View>
      <LightHouse throttleTime={1000}>
        <FlatList data={colors} renderItem={(data) => {
          return (
            <Ship
              detectType={'incompletely'}
              onPort={(status: any) => {
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
