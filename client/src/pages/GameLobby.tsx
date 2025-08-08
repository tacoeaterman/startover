import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayerCard } from "@/components/PlayerCard";
import { useGame } from "@/hooks/useGame";
import { useAuth } from "@/hooks/useAuth";
import { useLocation, useRoute } from "wouter";

export default function GameLobby() {
  const [match, params] = useRoute("/lobby/:gameCode");
  const { currentGame, listenToGame } = useGame();
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (match && params?.gameCode && currentGame?.id) {
      const unsubscribe = listenToGame(currentGame.id);
      return unsubscribe;
    }
  }, [match, params?.gameCode, currentGame?.id, listenToGame]);

  if (!currentGame || !user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="glass-card rounded-3xl p-8 text-center border-0">
          <CardContent className="p-0">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-white mb-2">Looking for game...</h1>
            <p className="text-white/70">Please wait while we find your game</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isHost = currentGame.hostId === user.uid;
  const players = Object.values(currentGame.players);

  const handleStartGame = () => {
    // Update game phase to playing
    setLocation(`/game/${currentGame.gameCode}`);
  };

  const handleLeaveGame = () => {
    setLocation("/");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      
      {/* Game Info Header */}
      <Card className="glass-card rounded-3xl p-6 mb-6 border-0">
        <CardContent className="p-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {currentGame.courseName || 'Disc Golf Game'}
              </h1>
              <p className="text-white/70">
                {currentGame.totalHoles} holes • Standard Stroke Play
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-mono font-bold text-brand-accent">
                {currentGame.gameCode}
              </div>
              <div className="text-white/70 text-sm">Game Code</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-white/70 text-sm">
              Players: <span className="text-white font-semibold">{players.length}</span>/6
            </div>
            <div className="text-white/70 text-sm">
              Status: <span className="text-yellow-400 font-semibold">Waiting for players</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Players List */}
      <Card className="glass-card rounded-3xl p-6 mb-6 border-0">
        <CardContent className="p-0">
          <h3 className="text-xl font-bold text-white mb-4">Players</h3>
          <div className="space-y-3">
            {players.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Host Controls */}
      {isHost && (
        <Card className="glass-card rounded-3xl p-6 border-0">
          <CardContent className="p-0">
            <h3 className="text-xl font-bold text-white mb-4">Host Controls</h3>
            <div className="flex space-x-4">
              <Button
                onClick={handleStartGame}
                className="flex-1 bg-brand-accent text-white font-semibold py-3 rounded-xl hover:bg-brand-accent/90 transition-colors"
              >
                Start Game
              </Button>
              <Button
                onClick={handleLeaveGame}
                className="px-8 bg-red-500/20 text-red-300 font-semibold py-3 rounded-xl hover:bg-red-500/30 transition-colors"
              >
                Cancel Game
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Player Controls */}
      {!isHost && (
        <Card className="glass-card rounded-3xl p-6 border-0">
          <CardContent className="p-0 text-center">
            <Button
              onClick={handleLeaveGame}
              className="bg-red-500/20 text-red-300 font-semibold py-3 px-8 rounded-xl hover:bg-red-500/30 transition-colors"
            >
              Leave Game
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
