import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayerCard } from "@/components/PlayerCard";
import { useGame } from "@/hooks/useGame";
import { useAuth } from "@/hooks/useAuth";
import { useLocation, useRoute } from "wouter";

export default function GameResults() {
  const [match] = useRoute("/results/:gameCode");
  const { currentGame } = useGame();
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  if (!currentGame || !user) {
    return <div>Loading...</div>;
  }

  const players = Object.values(currentGame.players);
  const sortedPlayers = players.sort((a, b) => a.totalScore - b.totalScore);
  const winner = sortedPlayers[0];

  const handlePlayAgain = () => {
    setLocation("/host");
  };

  const handleMainMenu = () => {
    setLocation("/");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      
      {/* Winner Announcement */}
      <Card className="glass-card rounded-3xl p-8 text-center mb-8 border-0">
        <CardContent className="p-0">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-4xl font-bold text-white mb-2">Game Complete!</h1>
          <p className="text-xl text-brand-accent font-semibold mb-4">
            {winner.name} Wins!
          </p>
          <p className="text-white/70">
            Final Score: {winner.totalScore > 0 ? '+' : ''}{winner.totalScore} • {currentGame.totalHoles} holes • {currentGame.courseName || 'Disc Golf Course'}
          </p>
        </CardContent>
      </Card>

      {/* Final Leaderboard */}
      <Card className="glass-card rounded-3xl p-6 mb-8 border-0">
        <CardContent className="p-0">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Final Results</h3>
          <div className="space-y-4">
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

      {/* Game Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="glass-card rounded-2xl p-6 text-center border-0">
          <CardContent className="p-0">
            <div className="text-3xl font-bold text-brand-accent mb-2">
              {currentGame.totalHoles}
            </div>
            <div className="text-white/70">Holes Played</div>
          </CardContent>
        </Card>
        <Card className="glass-card rounded-2xl p-6 text-center border-0">
          <CardContent className="p-0">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {players.length}
            </div>
            <div className="text-white/70">Players</div>
          </CardContent>
        </Card>
        <Card className="glass-card rounded-2xl p-6 text-center border-0">
          <CardContent className="p-0">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {Math.min(...players.map(p => p.totalScore))}
            </div>
            <div className="text-white/70">Best Score</div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button
          onClick={handlePlayAgain}
          className="flex-1 bg-brand-accent text-white font-semibold py-4 rounded-xl hover:bg-brand-accent/90 transition-colors"
        >
          Play Again
        </Button>
        <Button
          onClick={handleMainMenu}
          className="flex-1 bg-white/10 text-white font-semibold py-4 rounded-xl hover:bg-white/20 transition-colors"
        >
          Main Menu
        </Button>
      </div>
    </div>
  );
}
