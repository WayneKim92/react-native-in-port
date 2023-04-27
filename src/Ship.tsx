import React, {
  ReactElement,
  ReactPropTypes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { DeviceEventEmitter, Dimensions, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import {
  calculatePercentContaining,
  getViewportWithSpaceVariation,
} from './utils';
import type { IntRange, ViewportMargin } from './types';

type DetectPercent = IntRange<1, 101>;

export interface ShipProps {
  radarBeacon: string;
  children: ReactElement;
  // The return value is passed as children's props.
  onPort: (state: {
    isInPort: boolean;
    inPortCount: number;
  }) => { nextProps?: any; isValidInPort?: boolean } | void;
  viewportMargin?: ViewportMargin;
  detectPercent?: DetectPercent;
}

const Ship = (props: ShipProps) => {
  const {
    radarBeacon,
    children,
    onPort,
    viewportMargin,
    detectPercent = 50,
  } = props;

  const inPortCountRef = useRef(0);
  const [childrenProps, setChildrenProps] = useState<
    ReactPropTypes | undefined
  >();
  const viewRef = useRef<View>(null);

  const isFocused = useIsFocused();

  const handleMeasure = useCallback(
    (
      _x: number,
      _y: number,
      width: number,
      height: number,
      pageX: number,
      pageY: number
    ) => {
      const { height: windowHeight, width: windowWidth } =
        Dimensions.get('window');

      const defaultViewport = {
        top: 0,
        right: windowWidth,
        bottom: windowHeight,
        left: 0,
      };
      const viewportWithSpaceVariation =
        getViewportWithSpaceVariation(viewportMargin);
      const viewport = viewportWithSpaceVariation
        ? viewportWithSpaceVariation
        : defaultViewport;

      const element = {
        top: pageY,
        right: pageX + width,
        bottom: pageY + height,
        left: pageX,
      };

      // calculate the area of intersection between element and viewport
      const isDetected =
        calculatePercentContaining(element, viewport) >= detectPercent;

      if (onPort) {
        const payload = onPort({
          isInPort: isDetected,
          inPortCount: inPortCountRef.current,
        });

        if (payload) {
          const { nextProps = undefined, isValidInPort = false } = payload;

          if (isValidInPort) {
            inPortCountRef.current = inPortCountRef.current + 1;
          }

          if (nextProps) {
            setChildrenProps(nextProps);
          }
        }
      }
    },
    [viewportMargin, detectPercent, onPort]
  );

  const handleLayout = useCallback(() => {
    if (viewRef.current) {
      if (isFocused) {
        viewRef.current.measure(handleMeasure);
      }
    }
  }, [isFocused, handleMeasure]);

  useEffect(() => {
    const eventListener = DeviceEventEmitter.addListener(
      radarBeacon,
      ({ event, isNeedResetCountOnFocus }) => {
        viewRef?.current?.measure(handleMeasure);

        if (event === 'focus' && isNeedResetCountOnFocus) {
          inPortCountRef.current = 0;
        }
      }
    );

    return () => {
      eventListener.remove();
    };
  }, [handleMeasure, radarBeacon]);

  const newChildren = childrenProps
    ? React.cloneElement(children, childrenProps)
    : children;

  return (
    <View ref={viewRef} onLayout={handleLayout}>
      {newChildren ? newChildren : children}
    </View>
  );
};

export default Ship;
