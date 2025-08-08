import { Player } from "@/types/game";

interface PlayerCardProps {
  player: Player;
  position?: number;
  showScore?: boolean;
}

export function PlayerCard({ player, position, showScore }: PlayerCardProps) {
  const getScoreColor = (score: number, par: number = 0) => {
    if (score < par) return "text-green-400";
    if (score === par) return "text-white";
    return "text-red-400";
  };

  const getPositionBg = (pos: number) => {
    if (pos === 1) return "bg-yellow-500";
    if (pos === 2) return "bg-gray-400";
    if (pos === 3) return "bg-orange-600";
    return "bg-white/20";
  };

  return (
    <div className={`flex items-center justify-between p-4 rounded-xl ${
      player.isHost ? 'bg-brand-gradient' : 'bg-white/5'
    }`}>
      <div className="flex items-center space-x-3">
        {position && (
          <div className={`w-8 h-8 ${getPositionBg(position)} rounded-full flex items-center justify-center`}>
            <span className="text-white font-bold text-sm">{position}</span>
          </div>
        )}
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-semibold">
          {player.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="text-white font-semibold">{player.name}</div>
          <div className="text-white/70 text-sm">
            {player.isHost ? '👑 Host' : 'Player'}
            {!showScore && (player.isReady ? ' • Ready ✓' : ' • Waiting...')}
          </div>
        </div>
      </div>
      {showScore && (
        <div className="text-right">
          <div className={`text-2xl font-bold ${getScoreColor(player.totalScore)}`}>
            {player.totalScore > 0 ? '+' : ''}{player.totalScore}
          </div>
          <div className="text-white/70 text-sm">
            {player.scores.reduce((sum, score) => sum + score, 0)} strokes
          </div>
        </div>
      )}
    </div>
  );
}
