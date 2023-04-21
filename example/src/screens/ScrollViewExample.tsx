import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { createPort } from 'react-native-on-viewport';
import { Box } from '../components';
import { colors } from '../constant';

const { LightHouse, Ship } = createPort('beta');

const ScrollViewExample = () => {
  return (
    <LightHouse throttleTime={100}>
      <ScrollView
        style={styles.scrollView}
        scrollEventThrottle={1}
      >
        {colors.map((color, index) => (
          <Ship
            key={index}
            detectType={'completely'}
            viewportMargin={{ top: 400, bottom: 400}}
            onPort={(isIn) => {
              return { backgroundColor: isIn ? 'black' : color };
            }}
          >
            <Box backgroundColor={color} />
          </Ship>
        ))}
      </ScrollView>
    </LightHouse>
  );
};

const styles = StyleSheet.create({
  scrollView: { flexGrow: 1, flexShrink: 1 },

});

export default ScrollViewExample;
