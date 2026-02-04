import { useEffect, useRef, useState, useCallback } from 'react';
import React from 'react';
import { Player, Barrier, Coin, GameState, ControlMode } from '../types/game';
import {
  checkCollision,
  generateBarrier,
  generateCoin,
  updateBarrier,
  isBarrierOffScreen,
  generateSessionId,
} from '../utils/gameUtils';
import { supabase, GameScore } from '../lib/supabase';
import GameControls from './GameControls';
import GameCanvas from './GameCanvas';
import StartScreen from './StartScreen';
import GameOverScreen from './GameOverScreen';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PLAYER_SIZE = 40;
const INITIAL_SPEED = 3;
const SPEED_INCREMENT = 0.001;
const MAX_SPEED = 12;
const BARRIER_SPAWN_RATE = 0.02;
const COIN_SPAWN_RATE = 0.015;

const Game = () => {
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isPaused: false,
    score: 0,
    coins: 0,
    distance: 0,
    speed: INITIAL_SPEED,
    gameOver: false,
  });

  const [player, setPlayer] = useState<Player>({
    id: 'player',
    x: CANVAS_WIDTH / 2 - PLAYER_SIZE / 2,
    y: CANVAS_HEIGHT / 2 - PLAYER_SIZE / 2,
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    lane: 0,
  });

  const [barriers, setBarriers] = useState<Barrier[]>([]);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [controlMode, setControlMode] = useState<ControlMode>('buttons');
  const [playerName, setPlayerName] = useState('Anonymous');
  const [personalBest, setPersonalBest] = useState(0);
  const [worldRecord, setWorldRecord] = useState(0);
  const sessionIdRef = useRef(generateSessionId());
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    const { data: worldData } = await supabase
      .from('game_scores')
      .select('score')
      .order('score', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (worldData) {
      setWorldRecord(worldData.score);
    }

    const { data: personalData } = await supabase
      .from('game_scores')
      .select('score')
      .eq('session_id', sessionIdRef.current)
      .order('score', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (personalData) {
      setPersonalBest(personalData.score);
    }
  };

  const saveScore = async () => {
    const scoreData: GameScore = {
      player_name: playerName,
      score: gameState.score,
      coins: gameState.coins,
      distance: gameState.distance,
      session_id: sessionIdRef.current,
    };

    await supabase.from('game_scores').insert([scoreData]);

    if (gameState.score > personalBest) {
      setPersonalBest(gameState.score);
    }

    fetchScores();
  };

  const movePlayer = useCallback((dx: number, dy: number) => {
    setPlayer((prev) => {
      const newX = Math.max(0, Math.min(CANVAS_WIDTH - PLAYER_SIZE, prev.x + dx));
      const newY = Math.max(0, Math.min(CANVAS_HEIGHT - PLAYER_SIZE, prev.y + dy));
      return { ...prev, x: newX, y: newY };
    });
  }, []);

  const gameLoop = useCallback(() => {
    if (!gameState.isPlaying || gameState.isPaused || gameState.gameOver) return;

    setGameState((prev) => ({
      ...prev,
      score: prev.score + 1,
      distance: prev.distance + 1,
      speed: Math.min(MAX_SPEED, prev.speed + SPEED_INCREMENT),
    }));

    setBarriers((prevBarriers) => {
      let updatedBarriers = prevBarriers
        .map((barrier) => updateBarrier(barrier, gameState.speed, CANVAS_WIDTH, CANVAS_HEIGHT))
        .filter((barrier) => !isBarrierOffScreen(barrier, CANVAS_WIDTH, CANVAS_HEIGHT));

      if (Math.random() < BARRIER_SPAWN_RATE * (1 + gameState.speed / 10)) {
        updatedBarriers.push(generateBarrier(CANVAS_WIDTH, CANVAS_HEIGHT, gameState.speed));
      }

      return updatedBarriers;
    });

    setCoins((prevCoins) => {
      let updatedCoins = prevCoins.filter((coin) => !coin.collected);

      if (Math.random() < COIN_SPAWN_RATE && updatedCoins.length < 5) {
        updatedCoins.push(generateCoin(CANVAS_WIDTH, CANVAS_HEIGHT));
      }

      return updatedCoins;
    });

    barriers.forEach((barrier) => {
      if (checkCollision(player, barrier)) {
        handleGameOver();
      }
    });

    coins.forEach((coin) => {
      if (!coin.collected && checkCollision(player, coin)) {
        setCoins((prev) =>
          prev.map((c) => (c.id === coin.id ? { ...c, collected: true } : c))
        );
        setGameState((prev) => ({
          ...prev,
          coins: prev.coins + 1,
          score: prev.score + 50,
        }));
      }
    });

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, player, barriers, coins]);

  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused && !gameState.gameOver) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.isPaused, gameState.gameOver, gameLoop]);

  const handleGameOver = () => {
    setGameState((prev) => ({ ...prev, gameOver: true, isPlaying: false }));
    saveScore();
  };

  const startGame = (name: string) => {
    setPlayerName(name);
    setGameState({
      isPlaying: true,
      isPaused: false,
      score: 0,
      coins: 0,
      distance: 0,
      speed: INITIAL_SPEED,
      gameOver: false,
    });
    setPlayer({
      id: 'player',
      x: CANVAS_WIDTH / 2 - PLAYER_SIZE / 2,
      y: CANVAS_HEIGHT / 2 - PLAYER_SIZE / 2,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE,
      lane: 0,
    });
    setBarriers([]);
    setCoins([]);
  };

  const restartGame = () => {
    startGame(playerName);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-4">
      {!gameState.isPlaying && !gameState.gameOver && (
        <StartScreen
          onStart={startGame}
          personalBest={personalBest}
          worldRecord={worldRecord}
        />
      )}

      {gameState.isPlaying && !gameState.gameOver && (
        <div className="flex flex-col items-center gap-4">
          <div className="bg-white/5 backdrop-blur-sm px-6 py-3 rounded-lg flex gap-8 text-white font-bold border border-white/10">
            <div>Score: {gameState.score}</div>
            <div>Coins: {gameState.coins}</div>
            <div>Speed: {gameState.speed.toFixed(1)}x</div>
          </div>

          <GameCanvas
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            player={player}
            barriers={barriers}
            coins={coins}
            controlMode={controlMode}
            onMove={movePlayer}
          />

          <GameControls
            controlMode={controlMode}
            onControlModeChange={setControlMode}
            onMove={movePlayer}
          />
        </div>
      )}

      {gameState.gameOver && (
        <GameOverScreen
          score={gameState.score}
          coins={gameState.coins}
          distance={gameState.distance}
          personalBest={personalBest}
          worldRecord={worldRecord}
          onRestart={restartGame}
        />
      )}
    </div>
  );
};

export default Game;
