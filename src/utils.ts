import { Dimensions } from 'react-native';

import type { ViewportMargin, Rectangle } from './types';

export const getViewportWithSpaceVariation = (
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

export function calculatePercentContaining(a: Rectangle, b: Rectangle): number {
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
