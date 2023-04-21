import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter, Dimensions, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

type DetectType = 'completely' | 'incompletely';
type DetectDirection = 'both' | 'vertical' | 'horizontal';

type DetectTypeObject = {
  [key in DetectType]: boolean;
};

type ViewportMargin = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface ShipProps {
  radarBeacon: string;
  children: ReactElement;
  // The return value is passed as children's props.
  onPort: (isDetected: boolean) => any;
  subscribeScroll?: boolean;
  detectType?: DetectType;
  detectDirection?: DetectDirection;
  viewportMargin?: ViewportMargin;
}

const getViewportWithSpaceVariation = (viewportMargin: ViewportMargin | undefined) => {
  const { height: windowHeight, width: windowWidth } = Dimensions.get('window');

  return viewportMargin ? {
    top: viewportMargin.top ? viewportMargin.top : 0,
    right: viewportMargin.right ? windowWidth - viewportMargin.right : windowWidth,
    bottom: viewportMargin.bottom ? windowHeight - viewportMargin.bottom : windowHeight,
    left: viewportMargin.left ? viewportMargin.left : 0,
  } : undefined;
};

const Ship = (props: ShipProps) => {
  const {
    radarBeacon,
    children,
    onPort,
    viewportMargin,
    detectType = 'completely',
    detectDirection = 'both',
  } = props;

  const [childrenProps, setChildrenProps] = useState(null);
  const viewRef = useRef<View>(null);

  const isFocused = useIsFocused();

  const handleMeasure = (_x: number, _y: number, width: number, height: number, pageX: number, pageY: number) => {
    const { height: windowHeight, width: windowWidth } = Dimensions.get('window');

    const defaultViewport = {
      top: 0,
      right: windowWidth,
      bottom: windowHeight,
      left: 0,
    };

    const viewportWithSpaceVariation = getViewportWithSpaceVariation(viewportMargin);

    const viewport = viewportWithSpaceVariation ? viewportWithSpaceVariation : defaultViewport;

    const element = {
      top: pageY,
      right: pageX + width,
      bottom: pageY + height,
      left: pageX,
    };

    const isCompletelyVerticalContained = element.top >= viewport.top && element.bottom <= viewport.bottom;
    const isCompletelyHorizontalContained = element.left >= viewport.left && element.right <= viewport.right;
    const isCompletelyContained =
      detectDirection === 'both' ? (isCompletelyVerticalContained && isCompletelyHorizontalContained)
        : detectDirection === 'horizontal'
          ? isCompletelyHorizontalContained
          : isCompletelyVerticalContained;

    const isIncompletelyVerticalContained = viewport.left < element.right && viewport.right > element.left;
    const isIncompletelyHorizontalContained = viewport.top < element.bottom && viewport.bottom > element.top;
    const isIncompletelyContained =
      detectDirection === 'both' ? (isIncompletelyVerticalContained && isIncompletelyHorizontalContained)
        : detectDirection === 'horizontal'
          ? isIncompletelyHorizontalContained
          : isIncompletelyVerticalContained;


    const detectCondition: DetectTypeObject = {
      'completely': isCompletelyContained,
      'incompletely': isIncompletelyContained,
    };
    const isDetected = detectCondition[detectType];

    if (onPort) {
      const newChildrenProps = onPort(isDetected);

      if (newChildrenProps) {
        setChildrenProps(newChildrenProps);
      }
    }
  };

  const handleLayout = useCallback(() => {
    if (viewRef.current) {
      if (isFocused) {
        viewRef.current.measure(handleMeasure);
      }
    }
  }, [isFocused]);

  useEffect(() => {
    const eventListener = DeviceEventEmitter.addListener(radarBeacon, () => {
      // @ts-ignore
      viewRef.current.measure(handleMeasure);
    });

    return () => {
      eventListener.remove();
    };
  }, []);

  const newChildren = childrenProps ?
    React.cloneElement(children, childrenProps) : children;

  return (
    <View ref={viewRef} onLayout={handleLayout}>
      {newChildren ? newChildren : children}
    </View>
  );
};

export default Ship;
