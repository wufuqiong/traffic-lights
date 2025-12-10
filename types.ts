export enum LightState {
  RED = 'RED',
  YELLOW = 'YELLOW',
  GREEN = 'GREEN'
}

export enum Mode {
  CAR = 'CAR',
  WALK = 'WALK'
}

export enum GameLevel {
  CAR_NORMAL = 'CAR_NORMAL',
  WALKER_NORMAL = 'WALKER_NORMAL',
  LONG_WAIT = 'LONG_WAIT'
}

export type Orientation = 'vertical' | 'horizontal';

export interface TrafficConfig {
  redDuration: number;
  yellowDuration: number;
  greenDuration: number;
}