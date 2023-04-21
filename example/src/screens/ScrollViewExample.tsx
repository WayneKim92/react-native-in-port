import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Box } from '../components';

import { Ship, LightHouse } from 'react-native-on-viewport';

const colors = ['blue', 'red', 'green', 'yellow', 'black'];

const ScrollViewExample = () => {
  return (
    <View>
      <LightHouse throttleTime={1000}>
        <ScrollView style={{ flexGrow: 1, flexShrink: 1 }} scrollEventThrottle={1}>
          {colors.map((color, index) => (
            <Ship
              viewportMargin={{ top: 0 }}
              detectType={'incompletely'}
              onViewport={(status) => {
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
