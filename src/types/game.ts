export interface Position {
  x: number;
  y: number;
}

export interface GameObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Barrier extends GameObject {
  type: 'horizontal' | 'vertical';
  direction: 'up' | 'down' | 'left' | 'right';
}

export interface Coin extends GameObject {
  collected: boolean;
}

export interface Player extends GameObject {
  lane: number;
}

export type ControlMode = 'swipe' | 'buttons' | 'tilt';

export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  score: number;
  coins: number;
  distance: number;
  speed: number;
  gameOver: boolean;
}
