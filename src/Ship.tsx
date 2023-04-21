import React, { ReactElement, useCallback, useEffect, useRef } from 'react';
import { DeviceEventEmitter, Dimensions, EmitterSubscription, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import _ from 'lodash';

type DetectType = 'completely' | 'incompletely';

type DetectTypeObject = {
  [key in DetectType]: boolean;
};

export interface ShipProps {
  radarBeacon: string;
  children: ReactElement;
  onPort: (isDetected: boolean) => void;
  subscribeScroll?: boolean;
  detectType?: DetectType;
  viewportMargin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

const logLayoutWithThrottle = _.throttle(() => {
  console.debug({ origin: 'layout' });
}, 1000, { leading: true, trailing: false });

const Ship = (props: ShipProps) => {
  const {
    radarBeacon,
    onPort,
    viewportMargin,
    detectType = 'completely',
  } = props;
  // const exposureCount = useRef(0);

  const ref = useRef<View>(null);

  const isFocused = useIsFocused();

  const handleMeasure = (_x: number, _y: number, width: number, height: number, pageX: number, pageY: number) => {
    const { height: windowHeight, width: windowWidth } = Dimensions.get('window');

    const defaultViewport = {
      top: 0,
      right: windowWidth,
      bottom: windowHeight,
      left: 0,
    };

    const viewportWithSpaceVariation = viewportMargin ? {
      top: viewportMargin.top ? 0 + viewportMargin.top : 0,
      right: viewportMargin.right ? windowWidth - viewportMargin.right : windowWidth,
      bottom: viewportMargin.bottom ? windowHeight - viewportMargin.bottom : windowHeight,
      left: viewportMargin.left ? 0 + viewportMargin.left : 0,
    } : undefined;

    const viewport = viewportWithSpaceVariation ? viewportWithSpaceVariation : defaultViewport;

    const element = {
      top: pageY,
      right: pageX + width,
      bottom: pageY + height,
      left: pageX,
    };

    const isCompletelyContained =
      element.top >= viewport.top &&
      element.right <= viewport.right &&
      element.bottom <= viewport.bottom &&
      element.left >= viewport.left;

    const isIncompletelyContained =
      viewport.left < element.right &&
      viewport.right > element.left &&
      viewport.top < element.bottom &&
      viewport.bottom > element.top;

    const detectCondition: DetectTypeObject = {
      'completely': isCompletelyContained,
      'incompletely': isIncompletelyContained,
    };
    const isDetected = detectCondition[detectType];

    onPort && onPort(isDetected);
  };

  const handleLayout = useCallback(() => {
    if (ref.current) {
      logLayoutWithThrottle();

      if (isFocused) {
        ref.current.measure(handleMeasure);
      }
    }
  }, [isFocused]);

  const handleScroll = () => {
    // @ts-ignore
    ref.current.measure(handleMeasure);
  };

  useEffect(() => {
    let eventListener: EmitterSubscription | undefined;

    eventListener = DeviceEventEmitter.addListener(radarBeacon, handleScroll);

    return () => {
      if (eventListener && eventListener.remove) {
        eventListener.remove();
      }
    };
  }, []);

  return (
    <View ref={ref} onLayout={handleLayout}>
      {props.children}
    </View>
  );
};

export default Ship;
