import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGame } from "@/hooks/useGame";
import { useLocation } from "wouter";

export default function HostGame() {
  const [holeCount, setHoleCount] = useState(18);
  const [courseName, setCourseName] = useState("");
  const { createGame } = useGame();
  const [, setLocation] = useLocation();

  const handleCreateGame = async () => {
    const gameCode = await createGame(holeCount, courseName || undefined);
    if (gameCode) {
      setLocation(`/lobby/${gameCode}`);
    }
  };

  const presetHoles = [9, 18, 24];

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="glass-card rounded-3xl p-8 border-0">
        <CardContent className="p-0">
          <h1 className="text-3xl font-bold text-white text-center mb-8">Host New Game</h1>
          
          <div className="space-y-6">
            <div>
              <Label className="block text-white/80 text-sm font-medium mb-3">Number of Holes</Label>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {presetHoles.map((holes) => (
                  <Button
                    key={holes}
                    onClick={() => setHoleCount(holes)}
                    className={`p-4 rounded-xl font-semibold transition-colors border ${
                      holeCount === holes
                        ? 'bg-white/20 border-white/40 text-white'
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    }`}
                  >
                    {holes} Holes
                  </Button>
                ))}
              </div>
              <div className="mt-3">
                <input
                  type="range"
                  min="1"
                  max="24"
                  value={holeCount}
                  onChange={(e) => setHoleCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-white/60 text-sm mt-1">
                  <span>1</span>
                  <span>Custom: {holeCount} holes</span>
                  <span>24</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="block text-white/80 text-sm font-medium mb-3">Game Mode</Label>
              <div className="space-y-3">
                <div className="p-4 bg-white/20 rounded-xl border-2 border-white/40 cursor-pointer">
                  <div className="text-white font-semibold">Standard Stroke Play</div>
                  <div className="text-white/70 text-sm">Traditional scoring - lowest score wins</div>
                </div>
              </div>
            </div>

                              <div>
                    <Label className="block text-white/80 text-sm font-medium mb-3">
                      Course Information (Optional)
                    </Label>
                    <Input
                      type="text"
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:border-white/40"
                      placeholder="Enter course name"
                    />
                  </div>
          </div>

          <div className="flex space-x-4 mt-8">
            <Button
              onClick={handleCreateGame}
              className="flex-1 bg-brand-accent text-white font-semibold py-4 rounded-xl hover:bg-brand-accent/90 transition-colors"
            >
              Create Game
            </Button>
            <Button
              onClick={() => setLocation("/")}
              className="px-8 bg-white/10 text-white font-semibold py-4 rounded-xl hover:bg-white/20 transition-colors"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
