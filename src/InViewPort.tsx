import React, { ReactElement, useEffect, useRef } from 'react';
import { DeviceEventEmitter, Dimensions, EmitterSubscription, View } from 'react-native';

type DetectType = 'completely' | 'incompletely';

type DetectTypeObject = {
  [key in DetectType]: boolean;
};

interface IsOnViewportProps {
  children: ReactElement;
  onViewport: (isDetected: boolean) => void;
  subscribeScroll?: boolean;
  detectType?: DetectType;
  viewportMargin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

const InViewPort = (props: IsOnViewportProps) => {
  const { onViewport, viewportMargin, detectType = 'completely', subscribeScroll = true } = props;
  // const exposureCount = useRef(0);

  const ref = useRef<View>(null);

  const handleMeasure = (_x: number, _y: number, width: number, height: number, pageX: number, pageY: number) => {
    const windowHeight = Dimensions.get('window').height;
    const windowWidth = Dimensions.get('window').width;

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

    onViewport && onViewport(isDetected);
  };

  const handleLayout = () => {
    if (ref.current) {
      ref.current.measure(handleMeasure);
    }
  };

  const handleScroll = () => {
    // @ts-ignore
    ref.current.measure(handleMeasure);
  };

  useEffect(() => {
    let eventListener: EmitterSubscription | undefined;

    if(subscribeScroll){
      eventListener = DeviceEventEmitter.addListener('track', handleScroll);
    }

    return () => {
      if(eventListener && eventListener.remove){
        eventListener.remove();
      }
    };
  }, []);

  // TODO: React Navigation 지원하자.

  return (
    <View ref={ref} onLayout={handleLayout}>
      {props.children}
    </View>
  );
};

export default InViewPort;
