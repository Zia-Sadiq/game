import { GameObject, Barrier, Coin, Player } from '../types/game';
import React from 'react';

export const checkCollision = (obj1: GameObject, obj2: GameObject): boolean => {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
};

export const generateBarrier = (
  canvasWidth: number,
  canvasHeight: number,
  speed: number
): Barrier => {
  const types: ('horizontal' | 'vertical')[] = ['horizontal', 'vertical'];
  const type = types[Math.floor(Math.random() * types.length)];

  let barrier: Barrier;

  if (type === 'horizontal') {
    const direction: 'left' | 'right' = Math.random() > 0.5 ? 'left' : 'right';
    const y = Math.random() * (canvasHeight - 40);

    barrier = {
      id: Math.random().toString(36),
      type,
      direction,
      x: direction === 'left' ? canvasWidth : -60,
      y,
      width: 60,
      height: 40,
    };
  } else {
    const direction: 'up' | 'down' = Math.random() > 0.5 ? 'up' : 'down';
    const x = Math.random() * (canvasWidth - 40);

    barrier = {
      id: Math.random().toString(36),
      type,
      direction,
      x,
      y: direction === 'up' ? canvasHeight : -60,
      width: 40,
      height: 60,
    };
  }

  return barrier;
};

export const generateCoin = (
  canvasWidth: number,
  canvasHeight: number
): Coin => {
  return {
    id: Math.random().toString(36),
    x: Math.random() * (canvasWidth - 30) + 15,
    y: Math.random() * (canvasHeight - 30) + 15,
    width: 30,
    height: 30,
    collected: false,
  };
};

export const updateBarrier = (
  barrier: Barrier,
  speed: number,
  canvasWidth: number,
  canvasHeight: number
): Barrier => {
  const newBarrier = { ...barrier };

  switch (barrier.direction) {
    case 'left':
      newBarrier.x -= speed;
      break;
    case 'right':
      newBarrier.x += speed;
      break;
    case 'up':
      newBarrier.y -= speed;
      break;
    case 'down':
      newBarrier.y += speed;
      break;
  }

  return newBarrier;
};

export const isBarrierOffScreen = (
  barrier: Barrier,
  canvasWidth: number,
  canvasHeight: number
): boolean => {
  return (
    barrier.x + barrier.width < 0 ||
    barrier.x > canvasWidth ||
    barrier.y + barrier.height < 0 ||
    barrier.y > canvasHeight
  );
};

export const generateSessionId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
