import React from 'react';
import { default as LightHouse, LightHouseProps } from './LightHouse';
import { default as Ship, ShipProps } from './Ship';

type LightHouseWithoutRadarBeaconProps = Omit<LightHouseProps, 'radarBeacon'>;
type ShipPropsWithoutRadarBeaconProps = Omit<ShipProps, 'radarBeacon'>;

export const createPort = (radarBeacon: string) => {
  return {
    LightHouse: ({ children, ...otherProps }: LightHouseWithoutRadarBeaconProps) => (
      <LightHouse
        {...otherProps}
        children={children}
        radarBeacon={radarBeacon}
      />
    ),
    Ship: ({ children, ...otherProps }: ShipPropsWithoutRadarBeaconProps) => (
      <Ship
        {...otherProps}
        radarBeacon={radarBeacon}
        children={children}
      />
    ),
  };
};
