import * as React from 'react';
import { FlatList, View } from 'react-native';
import { createPort } from 'react-native-on-viewport';

import { Box } from '../components';
import { colors } from '../constant';

const { LightHouse, Ship } = createPort('alpha');

const FlatListExample = () => {
  return (
    <View>
      <LightHouse throttleTime={100}>
        <FlatList
          data={colors}
          renderItem={(data) => {
            return (
              <Ship
                viewportMargin={{ bottom: 400 }}
                detectType={'completely'}
                onPort={(isIn) => {
                  return { backgroundColor: isIn ? 'black' : data.item };
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
