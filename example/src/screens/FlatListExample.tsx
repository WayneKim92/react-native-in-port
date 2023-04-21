import * as React from 'react';
import { FlatList } from 'react-native';
import { createPort } from 'react-native-on-viewport';

import { Box } from '../components';
import { colors } from '../constant';

const { LightHouse, Ship } = createPort('alpha');

const FlatListExample = () => {
  return (
    <LightHouse throttleTime={100}>
      <FlatList
        data={colors}
        renderItem={(data) => {
          return (
            <Ship
              detectType={'completely'}
              viewportMargin={{ top: 64, bottom: 48 }}
              onPort={(isIn) => {
                return { backgroundColor: isIn ? 'black' : data.item };
              }}
            >
              <Box backgroundColor={data.item} />
            </Ship>
          );
        }} />
    </LightHouse>
  );
};

export default FlatListExample;
