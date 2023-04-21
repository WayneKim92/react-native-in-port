import _ from 'lodash';
import { DeviceEventEmitter, FlatList, ScrollView } from 'react-native';
import React, { ReactElement, useCallback } from 'react';

export interface LightHouseProps {
  children: ReactElement;
  radarBeacon: string;
  throttleTime?: number;
  isFocused?: boolean;
}

const LightHouse = (props: LightHouseProps) => {
  const {
    radarBeacon,
    throttleTime = 500,
    children,
    isFocused,
  } = props;

  const childrenType = React.Children.only(children).type;
  if (childrenType !== ScrollView && childrenType !== FlatList) {
    throw Error('🐞 In Ship Package : children prop of LightHouse can only be ScrollView or FlatList.');
  }

  const emitTrackEvent = (message: string) => {
    console.debug(message);
    DeviceEventEmitter.emit(radarBeacon, message);
  };

  const trackWithDelay = _.throttle(emitTrackEvent, throttleTime);

  const _onScroll = useCallback((event) => {
    const childOnScroll = children.props.onScroll;

    childOnScroll && childOnScroll(event);
    trackWithDelay('scroll');
  }, []);

  if (isFocused) {
    emitTrackEvent('focus');
  }

  return (
    React.cloneElement(children, {
      onScroll: _onScroll,
    })
  );
};

export default LightHouse;
