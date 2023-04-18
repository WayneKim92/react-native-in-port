import _ from 'lodash';
import { DeviceEventEmitter, FlatList, ScrollView } from 'react-native';
import React, { ReactElement, useCallback } from 'react';

interface InViewPortScrollEmitterProps {
  children: ReactElement;
  throttleTime?: number;
}

const InViewPortScrollEmitter = (props: InViewPortScrollEmitterProps) => {
  const { throttleTime = 500, children } = props;

  const trackWithDelay = _.throttle(() => {
    DeviceEventEmitter.emit('track');
  }, throttleTime);

  const _onScroll = useCallback((event) => {
    const childOnScroll = children.props.onScroll;

    childOnScroll && childOnScroll(event);

    trackWithDelay();
  }, []);

  const childrenType = React.Children.only(children).type;
  if(childrenType !== ScrollView && childrenType !== FlatList ){
    throw Error('🐞 In InViewPort Package : children prop of InViewPortScrollEmitter can only be ScrollView or FlatList.')
  }

  return (
    React.cloneElement(children, {
      onScroll: _onScroll,
    })
  );
};

export default InViewPortScrollEmitter;
