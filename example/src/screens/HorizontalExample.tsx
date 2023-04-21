import * as React from 'react';
import { View, ScrollView, StyleSheet, FlatList } from 'react-native';
import { createPort } from 'react-native-in-port';
import { colors } from '../constant';

const { LightHouse: LightHouse1, Ship: Ship1 } = createPort('alpha');
const { LightHouse: LightHouse2, Ship: Ship2 } = createPort('beta');

const HorizontalExample = () => {
  return (
    <View style={{ flex:1 }}>
      <LightHouse1 throttleTime={100}>
        <ScrollView
          horizontal={true}
          style={styles.scrollView}
          scrollEventThrottle={1}
        >
          {colors.map((color, index) => (
            <Ship1
              key={index}
              detectType={'completely'}
              detectDirection={'horizontal'}
              onPort={(isIn) => {
                return { backgroundColor: isIn ? 'black' : color };
              }}
            >
              <View style={{ width: 150, height: 300, backgroundColor: color }} />
            </Ship1>
          ))}
        </ScrollView>
      </LightHouse1>

      <LightHouse2 throttleTime={100}>
        <FlatList
          horizontal={true}
          data={colors}
          renderItem={(data) => {
            return (
              <Ship2
                detectType={'completely'}
                detectDirection={'horizontal'}
                viewportMargin={{ left: 10,right: 10 }}
                onPort={(isIn) => {
                  return { backgroundColor: isIn ? 'black' : data.item };
                }}
              >
                <View style={{ width: 200, height: 300, backgroundColor: data.item }} />
              </Ship2>
            );
          }} />
      </LightHouse2>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: { flexGrow: 1, flexShrink: 1 },

});

export default HorizontalExample;
