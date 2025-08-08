import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlayerCard } from "@/components/PlayerCard";
import { useGame } from "@/hooks/useGame";
import { useAuth } from "@/hooks/useAuth";
import { useRoute } from "wouter";

export default function GamePlay() {
  const [match, params] = useRoute("/game/:gameCode");
  const { currentGame, listenToGame, submitScore } = useGame();
  const { user } = useAuth();
  const [currentScore, setCurrentScore] = useState(3);

  useEffect(() => {
    if (match && params?.gameCode && currentGame?.id) {
      const unsubscribe = listenToGame(currentGame.id);
      return unsubscribe;
    }
  }, [match, params?.gameCode, currentGame?.id, listenToGame]);

  if (!currentGame || !user) {
    return <div>Loading...</div>;
  }

  const players = Object.values(currentGame.players);
  const sortedPlayers = players.sort((a, b) => a.totalScore - b.totalScore);
  const progress = (currentGame.currentHole / currentGame.totalHoles) * 100;

  const handleScoreSubmit = async () => {
    await submitScore(currentGame.id, currentGame.currentHole - 1, currentScore);
  };

  const scoreButtons = [
    { value: 1, label: "Ace", color: "green" },
    { value: 2, label: "Eagle", color: "blue" },
    { value: 3, label: "Par", color: "white" },
    { value: 4, label: "Bogey", color: "yellow" },
    { value: 5, label: "+2", color: "red" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      
      {/* Game Progress Header */}
      <Card className="glass-card rounded-3xl p-6 mb-6 border-0">
        <CardContent className="p-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Hole {currentGame.currentHole} of {currentGame.totalHoles}
              </h1>
              <p className="text-white/70">{currentGame.courseName || 'Disc Golf Course'}</p>
            </div>
            <div className="text-right">
              <div className="text-white/70 text-sm">Par</div>
              <div className="text-3xl font-bold text-white">{currentGame.currentPar}</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-brand-accent h-2 rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-white/70 text-sm mt-2 text-center">
            {Math.round(progress)}% Complete
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card className="glass-card rounded-3xl p-6 mb-6 border-0">
        <CardContent className="p-0">
          <h3 className="text-xl font-bold text-white mb-4">Leaderboard</h3>
          <div className="space-y-3">
            {sortedPlayers.map((player, index) => (
              <PlayerCard 
                key={player.id} 
                player={player} 
                position={index + 1}
                showScore
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Score Input */}
      <Card className="glass-card rounded-3xl p-6 mb-6 border-0">
        <CardContent className="p-0">
          <h3 className="text-xl font-bold text-white mb-4">Enter Your Score</h3>
          
          {/* Quick Score Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
            {scoreButtons.map((button) => (
              <Button
                key={button.value}
                onClick={() => setCurrentScore(button.value)}
                className={`p-4 rounded-xl font-semibold transition-colors ${
                  currentScore === button.value
                    ? `bg-${button.color === 'white' ? 'white/20 border-2 border-white/40' : `${button.color}-500/30 border-2 border-${button.color}-500/60`} text-${button.color === 'white' ? 'white' : `${button.color}-300`}`
                    : `bg-${button.color === 'white' ? 'white/10' : `${button.color}-500/20`} text-${button.color === 'white' ? 'white' : `${button.color}-300`} hover:bg-${button.color === 'white' ? 'white/20' : `${button.color}-500/30`}`
                }`}
              >
                {button.label}<br />
                <span className="text-sm">{button.value}</span>
              </Button>
            ))}
          </div>
          
          {/* Custom Score Input */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                type="number"
                min="1"
                max="15"
                value={currentScore}
                onChange={(e) => setCurrentScore(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 text-center text-xl font-bold rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:border-white/40"
                placeholder="Custom"
              />
            </div>
            <Button
              onClick={handleScoreSubmit}
              className="bg-brand-accent text-white font-semibold px-8 py-3 rounded-xl hover:bg-brand-accent/90 transition-colors"
            >
              Submit Score
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hole Activity */}
      <Card className="glass-card rounded-3xl p-6 border-0">
        <CardContent className="p-0">
          <h3 className="text-xl font-bold text-white mb-4">Hole Activity</h3>
          <div className="space-y-2">
            {currentGame.gameActivity.slice(-5).map((activity, index) => (
              <div key={index} className="text-white/70 text-sm">
                {activity}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
