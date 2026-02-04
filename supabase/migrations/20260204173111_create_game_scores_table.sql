/*
  # Create Game Scores Table

  1. New Tables
    - `game_scores`
      - `id` (uuid, primary key) - Unique identifier for each score entry
      - `player_name` (text) - Name of the player
      - `score` (integer) - Final score achieved in the game
      - `coins` (integer) - Number of coins collected
      - `distance` (integer) - Distance traveled in the game
      - `created_at` (timestamptz) - When the score was recorded
      - `session_id` (text) - Unique session identifier for tracking individual players
  
  2. Security
    - Enable RLS on `game_scores` table
    - Add policy for anyone to insert their scores (public game)
    - Add policy for anyone to read all scores (public leaderboard)
  
  3. Indexes
    - Index on `score` for efficient leaderboard queries
    - Index on `session_id` for personal best tracking
*/

CREATE TABLE IF NOT EXISTS game_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL DEFAULT 'Anonymous',
  score integer NOT NULL DEFAULT 0,
  coins integer NOT NULL DEFAULT 0,
  distance integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  session_id text NOT NULL
);

ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert game scores"
  ON game_scores
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read game scores"
  ON game_scores
  FOR SELECT
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS idx_game_scores_score ON game_scores(score DESC);
CREATE INDEX IF NOT EXISTS idx_game_scores_session ON game_scores(session_id, score DESC);
CREATE INDEX IF NOT EXISTS idx_game_scores_created_at ON game_scores(created_at DESC);