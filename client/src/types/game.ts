export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  isReady: boolean;
  scores: number[];
  totalScore: number;
}

export interface GameState {
  id: string;
  gameCode: string;
  hostId: string;
  courseName?: string;
  totalHoles: number;
  currentHole: number;
  currentPar: number;
  gamePhase: 'lobby' | 'playing' | 'finished';
  players: Record<string, Player>;
  gameActivity: string[];
}

export interface CardData {
  id: string;
  category: 'beforeThrow' | 'afterThrow' | 'self' | 'wild';
  name: string;
  description: string;
}
