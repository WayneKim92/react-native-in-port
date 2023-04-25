import * as React from 'react';
import { FlatList } from 'react-native';
import { createPort } from 'react-native-in-port';

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
              detectPercent={50}
              viewportMargin={{ top: 64, bottom: 48 }}
              onPort={(state) => {
                const { isInPort, inPortCount } = state;

                return {
                  nextProps: { backgroundColor: isInPort ? 'gray' : data.item },
                  isValidInPort: inPortCount < 1,
                };
              }}
            >
              <Box backgroundColor={data.item} />
            </Ship>
          );
        }}
      />
    </LightHouse>
  );
};

export default FlatListExample;
