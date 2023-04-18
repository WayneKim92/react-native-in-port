import React, { ReactElement, useCallback, useEffect, useRef } from 'react';
import { View, DeviceEventEmitter, ScrollView, Dimensions } from 'react-native';
import _ from 'lodash';

// 특정 컴포넌트
interface OnViewportProps {
  children: ReactElement<typeof ScrollView>;
  delay?: number;
}

// 구독-발행
export const OnViewport = (props: OnViewportProps) => {
  const { delay = 1000, children } = props;

  const trackWithDelay = _.throttle(() => {
    DeviceEventEmitter.emit('track');
  }, delay);

  const _onScroll = useCallback((event) => {
    const childOnScroll = props.children.props.onScroll;

    childOnScroll && childOnScroll(event);

    trackWithDelay();
  }, []);

  // console.log('dd', props.children instanceof ScrollView);
  // if(React.Children.only(children).type === ScrollView){
  //   console.log('!!!')
  // }

  return (
    React.cloneElement(props.children, {
      onScroll: _onScroll,
    })
  );
};

interface IsOnViewportProps {
  id?: string | number;
  children: ReactElement;
  onViewport: () => void;
  // detectType: ''
  // condition?: (measure: { x: number, y: number, width: number, height: number, pageX: number, pageY: number, exposureCount: number }) => boolean;
  // countRange?: {
  //   min: 0,
  //   max: 1
  // };
}

export const IsOnViewport = (props: IsOnViewportProps) => {
  const { id, onViewport } = props;
  // const exposureCount = useRef(0);

  const ref = useRef(null);

  const handleMeasure = (x, y, width, height, pageX, pageY) => {
    const windowHeight = Dimensions.get('window').height;
    const windowWidth = Dimensions.get('window').width;
    // 조금이라고 걸치면, viewport 진입이라고 취급하기

    // Viewport의 좌측 상단은 항상 (0,0) 이다.
    const viewport = {
      top: 0,
      right: windowWidth,
      bottom: windowHeight,
      left: 0,
    };

    const element = {
      top: pageY,
      right: pageX + width,
      bottom: pageY + height,
      left: pageX,
    };

    // 완전히 들어온 경우,
    const isFullyContained = element.top >= viewport.top && element.right <= viewport.right && element.bottom <= viewport.bottom && element.left >= viewport.left

    // 조금이라도 걸친 경우

    const status = isFullyContained;

    onViewport && onViewport(status);
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
