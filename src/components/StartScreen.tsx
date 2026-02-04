import { useState } from 'react';
import React from 'react';
import { Play, Trophy, Award } from 'lucide-react';

interface StartScreenProps {
  onStart: (playerName: string) => void;
  personalBest: number;
  worldRecord: number;
}

const StartScreen = ({ onStart, personalBest, worldRecord }: StartScreenProps) => {
  const [playerName, setPlayerName] = useState('Anonymous');

  const handleStart = () => {
    onStart(playerName.trim() || 'Anonymous');
  };

  return (
    <div className="flex flex-col items-center gap-8 max-w-lg">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
          Endless Runner
        </h1>
        <p className="text-slate-300 text-lg">
          Dodge barriers, collect coins, and beat the high score!
        </p>
      </div>

      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 w-full border border-white/10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 text-white">
            <Award className="text-yellow-400" size={32} />
            <div>
              <div className="text-sm text-slate-300">Your Best</div>
              <div className="text-2xl font-bold">{personalBest.toLocaleString()}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-white">
            <Trophy className="text-yellow-400" size={32} />
            <div>
              <div className="text-sm text-slate-300">World Record</div>
              <div className="text-2xl font-bold">{worldRecord.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 w-full border border-white/10">
        <label className="block text-white mb-2 font-semibold">Player Name</label>
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleStart()}
          placeholder="Enter your name"
          maxLength={20}
          className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border-2 border-amber-400 focus:border-amber-300 focus:outline-none transition-colors"
        />
      </div>

      <button
        onClick={handleStart}
        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-12 rounded-xl shadow-2xl flex items-center gap-3 text-xl transition-all transform hover:scale-105 active:scale-95"
      >
        <Play size={28} />
        Start Game
      </button>

      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 w-full border border-white/10">
        <h3 className="text-white font-bold mb-3 text-lg">How to Play</h3>
        <ul className="text-slate-300 space-y-2">
          <li>Use buttons, swipe, or tilt to control your character</li>
          <li>Avoid red barriers coming from all directions</li>
          <li>Collect gold coins for bonus points</li>
          <li>Speed increases as you survive longer</li>
          <li>Compete for the world record!</li>
        </ul>
      </div>
    </div>
  );
};

export default StartScreen;
