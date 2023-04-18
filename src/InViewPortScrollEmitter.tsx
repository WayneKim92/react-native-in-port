import _ from 'lodash';
import { DeviceEventEmitter, FlatList, ScrollView } from 'react-native';
import React, { ReactElement, useCallback } from 'react';
import { EVENT, Payload } from './index';

interface InViewPortScrollEmitterProps {
  children: ReactElement;
  throttleTime?: number;
  isFocused?: boolean;
}

const InViewPortScrollEmitter = (props: InViewPortScrollEmitterProps) => {
  const {
    throttleTime = 500,
    children,
    isFocused,
  } = props;

  const childrenType = React.Children.only(children).type;
  if (childrenType !== ScrollView && childrenType !== FlatList) {
    throw Error('🐞 In InViewPort Package : children prop of InViewPortScrollEmitter can only be ScrollView or FlatList.');
  }

  const emitTrackEvent = (payload: Payload) => {
    console.debug(payload);
    DeviceEventEmitter.emit(EVENT, payload);
  };

  const trackWithDelay = _.throttle(emitTrackEvent, throttleTime);

  const _onScroll = useCallback((event) => {
    const childOnScroll = children.props.onScroll;

    childOnScroll && childOnScroll(event);
    trackWithDelay({ origin: 'scroll' });
  }, []);

  if (isFocused) {
    emitTrackEvent({ origin: 'focus' });
  }

  return (
    React.cloneElement(children, {
      onScroll: _onScroll,
    })
  );
};

export default InViewPortScrollEmitter;
