import * as React from 'react';
import { View, ScrollView, StyleSheet, FlatList } from 'react-native';
import { createPort } from 'react-native-in-port';
import { colors } from '../constant';

/**
 * Do not use radar beacons that have been used on other screens unless you have a specific intent.
 * LightHouse and Ship measure when radarBeacon event registered in createPort occurs.
 */
const { LightHouse: LightHouse1, Ship: Ship1 } = createPort('HORIZONTAL1');
const { LightHouse: LightHouse2, Ship: Ship2 } = createPort('HORIZONTAL2');

// @ts-ignore
const Box = ({ color }) => (
  <View style={{ width: 150, height: '100%', backgroundColor: color }} />
);

const HorizontalExample = () => {
  return (
    <View style={{ flex: 1 }}>
      <LightHouse1 throttleTime={100}>
        <ScrollView
          horizontal={true}
          style={styles.scrollView}
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
        >
          {colors.map((color, index) => (
            <Ship1
              key={index}
              detectPercent={100}
              onPort={(state) => {
                const { isInPort, inPortCount } = state;

                return {
                  nextProps: { color: isInPort ? 'gray' : color },
                  isValidInPort: inPortCount < 1,
                };
              }}
            >
              <Box color={color} />
            </Ship1>
          ))}
        </ScrollView>
      </LightHouse1>

      <LightHouse2 throttleTime={100}>
        <FlatList
          data={colors}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={(data) => {
            return (
              <Ship2
                detectPercent={100}
                viewportMargin={{ left: 10, right: 10 }}
                onPort={(state) => {
                  const { isInPort, inPortCount } = state;

                  return {
                    nextProps: {
                      color: isInPort ? 'gray' : data.item,
                    },
                    isValidInPort: inPortCount < 1,
                  };
                }}
              >
                <Box color={data.item} />
              </Ship2>
            );
          }}
        />
      </LightHouse2>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: { flexGrow: 1, flexShrink: 1 },
});

export default HorizontalExample;
