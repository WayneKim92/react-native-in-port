import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { DeviceEventEmitter, Dimensions, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

type Enumerate<
  N extends number,
  Acc extends number[] = []
> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>;

type IntRange<F extends number, T extends number> = Exclude<
  Enumerate<T>,
  Enumerate<F>
>;

type DetectPercent = IntRange<1, 101>;

type ViewportMargin = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

export interface ShipProps {
  radarBeacon: string;
  children: ReactElement;
  // The return value is passed as children's props.
  onPort: (isDetected: boolean) => any;
  viewportMargin?: ViewportMargin;
  detectPercent?: DetectPercent;
}

interface Rectangle {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

function calculatePercentContaining(a: Rectangle, b: Rectangle): number {
  // calculate the area of intersection between a and b
  const overlapLeft = Math.max(a.left, b.left);
  const overlapRight = Math.min(a.right, b.right);
  const overlapTop = Math.max(a.top, b.top);
  const overlapBottom = Math.min(a.bottom, b.bottom);

  const overlapWidth = overlapRight - overlapLeft;
  const overlapHeight = overlapBottom - overlapTop;
  const overlapArea = Math.max(0, overlapWidth) * Math.max(0, overlapHeight);

  // calculate the area of a
  const aWidth = a.right - a.left;
  const aHeight = a.bottom - a.top;
  const aArea = aWidth * aHeight;

  // calculate the percent of a that overlaps with b
  const percent = (overlapArea / aArea) * 100;

  return percent;
}

const getViewportWithSpaceVariation = (
  viewportMargin: ViewportMargin | undefined
) => {
  const { height: windowHeight, width: windowWidth } = Dimensions.get('window');

  return viewportMargin
    ? {
        top: viewportMargin.top ? viewportMargin.top : 0,
        right: viewportMargin.right
          ? windowWidth - viewportMargin.right
          : windowWidth,
        bottom: viewportMargin.bottom
          ? windowHeight - viewportMargin.bottom
          : windowHeight,
        left: viewportMargin.left ? viewportMargin.left : 0,
      }
    : undefined;
};

const Ship = (props: ShipProps) => {
  const {
    radarBeacon,
    children,
    onPort,
    viewportMargin,
    detectPercent = 50,
  } = props;

  const [childrenProps, setChildrenProps] = useState(null);
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
        const newChildrenProps = onPort(isDetected);

        if (newChildrenProps) {
          setChildrenProps(newChildrenProps);
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
    const eventListener = DeviceEventEmitter.addListener(radarBeacon, () => {
      // @ts-ignore
      viewRef.current.measure(handleMeasure);
    });

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
