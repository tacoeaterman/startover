import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGame } from "@/hooks/useGame";
import { useLocation } from "wouter";
import { Key } from "lucide-react";

export default function JoinGame() {
  const [gameCode, setGameCode] = useState("");
  const { joinGame } = useGame();
  const [, setLocation] = useLocation();

  const handleJoinGame = async () => {
    if (gameCode.length === 6) {
      await joinGame(gameCode);
      setLocation(`/lobby/${gameCode.toUpperCase()}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card className="glass-card rounded-3xl p-8 text-center border-0">
        <CardContent className="p-0">
          <div className="w-20 h-20 mx-auto mb-6 bg-blue-500/20 rounded-3xl flex items-center justify-center">
            <Key className="w-10 h-10 text-blue-400" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">Join Game</h1>
          <p className="text-white/70 mb-8">Enter the game code provided by the host</p>
          
          <div className="space-y-6">
            <div>
              <Input
                type="text"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-4 text-center text-2xl font-mono rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:border-white/40 uppercase tracking-wider"
                placeholder="ABC123"
                maxLength={6}
              />
              <div className="text-white/60 text-sm mt-2">Game codes are 6 characters long</div>
            </div>
            
            <Button
              onClick={handleJoinGame}
              disabled={gameCode.length !== 6}
              className="w-full bg-brand-accent text-white font-semibold py-4 rounded-xl hover:bg-brand-accent/90 transition-colors disabled:opacity-50"
            >
              Join Game
            </Button>
            
            <Button
              onClick={() => setLocation("/")}
              className="w-full bg-white/10 text-white font-semibold py-3 rounded-xl hover:bg-white/20 transition-colors"
            >
              Back to Main Menu
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
