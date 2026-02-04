import { useEffect, useRef } from 'react';
import React from 'react';
import { Player, Barrier, Coin, ControlMode } from '../types/game';

interface GameCanvasProps {
  width: number;
  height: number;
  player: Player;
  barriers: Barrier[];
  coins: Coin[];
  controlMode: ControlMode;
  onMove: (dx: number, dy: number) => void;
}

const GameCanvas = ({
  width,
  height,
  player,
  barriers,
  coins,
  controlMode,
  onMove,
}: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    coins.forEach((coin) => {
      if (!coin.collected) {
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(coin.x + coin.width / 2, coin.y + coin.height / 2, coin.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    });

    barriers.forEach((barrier) => {
      const gradient = ctx.createLinearGradient(
        barrier.x,
        barrier.y,
        barrier.x + barrier.width,
        barrier.y + barrier.height
      );
      gradient.addColorStop(0, '#ef4444');
      gradient.addColorStop(1, '#dc2626');
      ctx.fillStyle = gradient;
      ctx.fillRect(barrier.x, barrier.y, barrier.width, barrier.height);
      ctx.strokeStyle = '#991b1b';
      ctx.lineWidth = 2;
      ctx.strokeRect(barrier.x, barrier.y, barrier.width, barrier.height);
    });

    const playerGradient = ctx.createRadialGradient(
      player.x + player.width / 2,
      player.y + player.height / 2,
      0,
      player.x + player.width / 2,
      player.y + player.height / 2,
      player.width / 2
    );
    playerGradient.addColorStop(0, '#34d399');
    playerGradient.addColorStop(1, '#10b981');
    ctx.fillStyle = playerGradient;
    ctx.beginPath();
    ctx.arc(player.x + player.width / 2, player.y + player.height / 2, player.width / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 3;
    ctx.stroke();
  }, [player, barriers, coins, width, height]);

  useEffect(() => {
    if (controlMode !== 'swipe') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!touchStartRef.current) return;

      const touch = e.touches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;

      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        onMove(dx * 0.5, dy * 0.5);
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
      }
    };

    const handleTouchEnd = () => {
      touchStartRef.current = null;
    };

    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [controlMode, onMove]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border-4 border-amber-400 rounded-lg shadow-2xl"
      style={{ touchAction: 'none' }}
    />
  );
};

export default GameCanvas;
