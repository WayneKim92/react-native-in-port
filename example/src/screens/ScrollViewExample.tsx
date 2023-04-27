import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { createPort } from 'react-native-in-port';
import { Box } from '../components';
import { colors } from '../constant';

const { LightHouse, Ship } = createPort('beta');

const ScrollViewExample = () => {
  const headerHeight = useHeaderHeight();

  return (
    <LightHouse throttleTime={100}>
      <ScrollView style={styles.scrollView} scrollEventThrottle={1}>
        {colors.map((color, index) => (
          <Ship
            key={index}
            detectPercent={50}
            viewportMargin={{ top: headerHeight, bottom: 70 }}
            onPort={(state) => {
              const { isInPort, inPortCount } = state;

              return {
                nextProps: { backgroundColor: isInPort ? 'gray' : color },
                isValidInPort: inPortCount < 1,
              };
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
