import { useEffect, useState } from 'react';
import React from 'react';
import { supabase, GameScore } from '../lib/supabase';
import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardProps {
  currentScore: number;
}

const Leaderboard = ({ currentScore }: LeaderboardProps) => {
  const [topScores, setTopScores] = useState<GameScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('game_scores')
      .select('*')
      .order('score', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching leaderboard:', error);
    } else {
      setTopScores(data || []);
    }
    setLoading(false);
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="text-yellow-400" size={24} />;
      case 1:
        return <Medal className="text-gray-300" size={24} />;
      case 2:
        return <Award className="text-orange-400" size={24} />;
      default:
        return <span className="text-amber-400 font-bold text-lg">{index + 1}</span>;
    }
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 w-full border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          Global Leaderboard
        </h2>
        <div className="text-white text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 w-full border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">
        Global Leaderboard
      </h2>
      <div className="space-y-2">
        {topScores.map((score, index) => {
          const isCurrentScore = score.score === currentScore;
          return (
            <div
              key={score.id}
              className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                isCurrentScore
                  ? 'bg-amber-500/20 border-2 border-amber-400'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-center w-10">
                {getRankIcon(index)}
              </div>
              <div className="flex-1">
                <div className="text-white font-semibold">
                  {score.player_name}
                  {isCurrentScore && (
                    <span className="ml-2 text-amber-400 text-sm">(You)</span>
                  )}
                </div>
                <div className="text-slate-300 text-sm">
                  {score.coins} coins • {score.distance.toLocaleString()} distance
                </div>
              </div>
              <div className="text-white font-bold text-xl">
                {score.score.toLocaleString()}
              </div>
            </div>
          );
        })}
        {topScores.length === 0 && (
          <div className="text-white text-center py-8">
            No scores yet. Be the first!
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
