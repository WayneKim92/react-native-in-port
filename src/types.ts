type Enumerate<
  N extends number,
  Acc extends number[] = []
> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>;

export type IntRange<F extends number, T extends number> = Exclude<
  Enumerate<T>,
  Enumerate<F>
>;

export interface Rectangle {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export type ViewportMargin = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};
