import * as React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { createPort } from 'react-native-on-viewport';
import { Box } from '../components';
import { colors } from '../constant';

const { LightHouse, Ship } = createPort('beta');

const ScrollViewExample = () => {
  return (
    <View>
      <LightHouse throttleTime={100}>
        <ScrollView
          style={styles.scrollView}
          scrollEventThrottle={1}
        >
          {colors.map((color, index) => (
            <Ship
              key={index}
              detectType={'completely'}
              onPort={(isIn) => {
                return { backgroundColor: isIn ? 'black' : color };
              }}
            >
              <Box backgroundColor={color} />
            </Ship>
          ))}
        </ScrollView>
      </LightHouse>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: { flexGrow: 1, flexShrink: 1 },

});

export default ScrollViewExample;
