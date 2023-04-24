import React, { ReactElement, useCallback, useRef } from 'react';
import {
  DeviceEventEmitter,
  FlatList,
  ScrollView,
  LayoutChangeEvent,
} from 'react-native';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import _ from 'lodash';

export interface LightHouseProps {
  children: ReactElement;
  radarBeacon: string;
  throttleTime?: number;
}

const LightHouse = (props: LightHouseProps) => {
  const { radarBeacon, throttleTime = 500, children } = props;

  const isFirstFocus = useRef(true);

  const isFocused = useIsFocused();

  const emitTrackEvent = (message: string) => {
    DeviceEventEmitter.emit(radarBeacon, message);
  };

  const trackWithDelay = _.throttle(emitTrackEvent, throttleTime);

  const _onScroll = (event: LayoutChangeEvent) => {
    if (isFocused) {
      trackWithDelay('scroll');
    }

    const childOnScroll = children.props.onScroll;
    childOnScroll && childOnScroll(event);
  };

  useFocusEffect(
    useCallback(() => {
      // When useFocusEffect is executed for the first time, it is before the onLayout event occurs.
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }

      trackWithDelay('focus');
    }, [trackWithDelay])
  );

  const childrenType = React.Children.only(children).type;
  if (childrenType !== ScrollView && childrenType !== FlatList) {
    console.warn(
      '🐞[react-native-in-port]: children prop of LightHouse can only be ScrollView or FlatList.'
    );
  }

  return React.cloneElement(children, {
    onScroll: _onScroll,
  });
};

export default LightHouse;
