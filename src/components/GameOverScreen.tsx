import { useState, useEffect } from 'react';
import React from 'react';
import { RotateCcw, Trophy, Award, Coins } from 'lucide-react';
import Leaderboard from './Leaderboard';

interface GameOverScreenProps {
  score: number;
  coins: number;
  distance: number;
  personalBest: number;
  worldRecord: number;
  onRestart: () => void;
}

const GameOverScreen = ({
  score,
  coins,
  distance,
  personalBest,
  worldRecord,
  onRestart,
}: GameOverScreenProps) => {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isNewPersonalBest, setIsNewPersonalBest] = useState(false);
  const [isNewWorldRecord, setIsNewWorldRecord] = useState(false);

  useEffect(() => {
    if (score > personalBest) {
      setIsNewPersonalBest(true);
    }
    if (score > worldRecord) {
      setIsNewWorldRecord(true);
    }
  }, [score, personalBest, worldRecord]);

  return (
    <div className="flex flex-col items-center gap-6 max-w-2xl">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
          Game Over!
        </h1>
        {isNewWorldRecord && (
          <p className="text-yellow-400 text-2xl font-bold animate-pulse">
            NEW WORLD RECORD!
          </p>
        )}
        {isNewPersonalBest && !isNewWorldRecord && (
          <p className="text-cyan-400 text-xl font-bold animate-pulse">
            New Personal Best!
          </p>
        )}
      </div>

      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 w-full border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-center gap-2 text-white">
            <Trophy className="text-yellow-400" size={40} />
            <div className="text-sm text-slate-300">Score</div>
            <div className="text-3xl font-bold">{score.toLocaleString()}</div>
          </div>
          <div className="flex flex-col items-center gap-2 text-white">
            <Coins className="text-yellow-400" size={40} />
            <div className="text-sm text-slate-300">Coins</div>
            <div className="text-3xl font-bold">{coins}</div>
          </div>
          <div className="flex flex-col items-center gap-2 text-white">
            <Award className="text-cyan-400" size={40} />
            <div className="text-sm text-slate-300">Distance</div>
            <div className="text-3xl font-bold">{distance.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onRestart}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-xl shadow-2xl flex items-center gap-3 text-xl transition-all transform hover:scale-105 active:scale-95"
        >
          <RotateCcw size={24} />
          Play Again
        </button>
        <button
          onClick={() => setShowLeaderboard(!showLeaderboard)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-xl shadow-2xl flex items-center gap-3 text-xl transition-all transform hover:scale-105 active:scale-95"
        >
          <Trophy size={24} />
          {showLeaderboard ? 'Hide' : 'Show'} Leaderboard
        </button>
      </div>

      {showLeaderboard && <Leaderboard currentScore={score} />}
    </div>
  );
};

export default GameOverScreen;
