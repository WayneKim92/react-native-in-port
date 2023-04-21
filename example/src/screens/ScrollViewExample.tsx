import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Box } from '../components';

import { createPort } from 'react-native-on-viewport';

const { LightHouse, Ship } = createPort('2');

const colors = ['red', 'orange', 'yellow', 'green', 'blue'];

const ScrollViewExample = () => {
  return (
    <View>
      <LightHouse throttleTime={1000}>
        <ScrollView
          style={{ flexGrow: 1, flexShrink: 1 }}
          scrollEventThrottle={1}
        >
          {colors.map((color, index) => (
            <Ship
              viewportMargin={{ top: 0 }}
              detectType={'incompletely'}
              onPort={(status: any) => {
                if (status) console.log(`${color} IN`);
                else console.log(`${color} OUT`);
              }}
              key={index}
            >
              <Box backgroundColor={color} />
            </Ship>
          ))}
        </ScrollView>
      </LightHouse>
    </View>
  );
};

export default ScrollViewExample;
