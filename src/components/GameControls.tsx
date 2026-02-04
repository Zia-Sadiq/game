import { useEffect, useState } from 'react';
import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Smartphone, Hand, Gamepad2 } from 'lucide-react';
import { ControlMode } from '../types/game';

interface GameControlsProps {
  controlMode: ControlMode;
  onControlModeChange: (mode: ControlMode) => void;
  onMove: (dx: number, dy: number) => void;
}

const MOVE_SPEED = 15;

const GameControls = ({ controlMode, onControlModeChange, onMove }: GameControlsProps) => {
  const [tiltSupported, setTiltSupported] = useState(false);

  useEffect(() => {
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      setTiltSupported(true);
    } else if (window.DeviceOrientationEvent) {
      setTiltSupported(true);
    }
  }, []);

  useEffect(() => {
    if (controlMode !== 'tilt' || !tiltSupported) return;

    let lastBeta = 0;
    let lastGamma = 0;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const beta = event.beta || 0;
      const gamma = event.gamma || 0;

      if (lastBeta !== 0 || lastGamma !== 0) {
        const dx = (gamma - lastGamma) * 2;
        const dy = (beta - lastBeta) * 2;

        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
          onMove(dx, dy);
        }
      }

      lastBeta = beta;
      lastGamma = gamma;
    };

    const requestPermission = async () => {
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        } catch (error) {
          console.error('Error requesting device orientation permission:', error);
        }
      } else {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    };

    requestPermission();

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [controlMode, tiltSupported, onMove]);

  useEffect(() => {
    if (controlMode !== 'buttons') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          onMove(0, -MOVE_SPEED);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          onMove(0, MOVE_SPEED);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          onMove(-MOVE_SPEED, 0);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          onMove(MOVE_SPEED, 0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [controlMode, onMove]);

  const handleButtonPress = (dx: number, dy: number) => {
    onMove(dx, dy);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2 bg-white/5 backdrop-blur-sm p-2 rounded-lg border border-white/10">
        <button
          onClick={() => onControlModeChange('buttons')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
            controlMode === 'buttons'
              ? 'bg-amber-500 text-white shadow-lg'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          <Gamepad2 size={20} />
          Buttons
        </button>
        <button
          onClick={() => onControlModeChange('swipe')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
            controlMode === 'swipe'
              ? 'bg-amber-500 text-white shadow-lg'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          <Hand size={20} />
          Swipe
        </button>
        {tiltSupported && (
          <button
            onClick={() => onControlModeChange('tilt')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              controlMode === 'tilt'
                ? 'bg-amber-500 text-white shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Smartphone size={20} />
            Tilt
          </button>
        )}
      </div>

      {controlMode === 'buttons' && (
        <div className="flex flex-col items-center gap-2">
          <button
            onMouseDown={() => handleButtonPress(0, -MOVE_SPEED)}
            onTouchStart={(e) => {
              e.preventDefault();
              handleButtonPress(0, -MOVE_SPEED);
            }}
            className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white p-4 rounded-lg shadow-lg transition-all"
          >
            <ArrowUp size={24} />
          </button>
          <div className="flex gap-2">
            <button
              onMouseDown={() => handleButtonPress(-MOVE_SPEED, 0)}
              onTouchStart={(e) => {
                e.preventDefault();
                handleButtonPress(-MOVE_SPEED, 0);
              }}
              className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white p-4 rounded-lg shadow-lg transition-all"
            >
              <ArrowLeft size={24} />
            </button>
            <button
              onMouseDown={() => handleButtonPress(0, MOVE_SPEED)}
              onTouchStart={(e) => {
                e.preventDefault();
                handleButtonPress(0, MOVE_SPEED);
              }}
              className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white p-4 rounded-lg shadow-lg transition-all"
            >
              <ArrowDown size={24} />
            </button>
            <button
              onMouseDown={() => handleButtonPress(MOVE_SPEED, 0)}
              onTouchStart={(e) => {
                e.preventDefault();
                handleButtonPress(MOVE_SPEED, 0);
              }}
              className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white p-4 rounded-lg shadow-lg transition-all"
            >
              <ArrowRight size={24} />
            </button>
          </div>
        </div>
      )}

      {controlMode === 'swipe' && (
        <div className="text-white text-center bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
          Swipe on the game canvas to move
        </div>
      )}

      {controlMode === 'tilt' && (
        <div className="text-white text-center bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
          Tilt your device to control the character
        </div>
      )}
    </div>
  );
};

export default GameControls;
