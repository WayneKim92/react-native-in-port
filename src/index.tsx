export { default as InViewPortScrollEmitter } from './InViewPortScrollEmitter';
export { default as InViewPort } from './InViewPort';

export const EVENT = 'TRACKING';
export interface Payload {
  origin: string;
  data?: any;
}
