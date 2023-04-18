import React, { ReactElement, useCallback, useEffect, useRef } from 'react';
import { View, DeviceEventEmitter, Dimensions } from 'react-native';
import _ from 'lodash';

// 특정 컴포넌트
interface OnViewportProps {
  children: ReactElement;
  delay?: number;
}

// 구독-발행
export const OnViewport = (props: OnViewportProps) => {
  const { delay = 1000, children } = props;

  const trackWithDelay = _.throttle(() => {
    DeviceEventEmitter.emit('track');
  }, delay);

  const _onScroll = useCallback((event) => {
    const childOnScroll = children.props.onScroll;

    childOnScroll && childOnScroll(event);

    trackWithDelay();
  }, []);

  // if(React.Children.only(children).type === ScrollView){
  //   console.log('!!!')
  // }

  return (
    React.cloneElement(children, {
      onScroll: _onScroll,
    })
  );
};

type DetectType = 'completely' | 'incompletely';

type DetectTypeObject = {
  [key in DetectType]: boolean;
};

interface IsOnViewportProps {
  children: ReactElement;
  onViewport: (isDetected: boolean) => void;
  detectType?: DetectType;
  viewportMargin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  // condition?: (measure: { x: number, y: number, width: number, height: number, pageX: number, pageY: number, exposureCount: number }) => boolean;
  // countRange?: {
  //   min: 0,
  //   max: 1
  // };
}

export const IsOnViewport = (props: IsOnViewportProps) => {
  const { onViewport, viewportMargin, detectType = 'completely' } = props;
  // const exposureCount = useRef(0);

  const ref = useRef<View>(null);

  const handleMeasure = (_x: number, _y: number, width: number, height: number, pageX: number, pageY: number) => {
    const windowHeight = Dimensions.get('window').height;
    const windowWidth = Dimensions.get('window').width;

    // Viewport의 좌측 상단은 항상 (0,0) 이다.
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

    // 완전히 들어온 경우,
    const isCompletelyContained =
      element.top >= viewport.top &&
      element.right <= viewport.right &&
      element.bottom <= viewport.bottom &&
      element.left >= viewport.left;

    // 조금이라도 걸친 경우
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
    const eventListener = DeviceEventEmitter.addListener('track', handleScroll);

    return () => {
      eventListener.remove();
    };
  }, []);

  // TODO: React Navigation 지원하자.

  return (
    <View ref={ref} onLayout={handleLayout}>
      {props.children}
    </View>
  );
};
