import { useState, useEffect } from 'react';
import { database, ref, onValue, set, push, update } from '@/lib/firebase';
import { GameState, Player } from '@/types/game';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export function useGame() {
  const [currentGame, setCurrentGame] = useState<GameState | null>(null);
  const [hasHostingPrivilege, setHasHostingPrivilege] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      // Listen for user's hosting privilege status
      const userRef = ref(database, `users/${user.uid}`);
      const unsubscribe = onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        setHasHostingPrivilege(userData?.hasHostingPrivilege || false);
      });
      return unsubscribe;
    }
  }, [user]);

  const generateGameCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createGame = async (totalHoles: number, courseName?: string) => {
    if (!user || !hasHostingPrivilege) {
      toast({
        title: "Cannot create game",
        description: "You need hosting privileges to create a game",
        variant: "destructive",
      });
      return;
    }

    try {
      const gameCode = generateGameCode();
      const gameRef = push(ref(database, 'games'));
              const gameData: Partial<GameState> = {
          id: gameRef.key!,
          gameCode,
          hostId: user.uid,
          courseName,
        totalHoles,
        currentHole: 1,
        currentPar: 3,
        gamePhase: 'lobby',
        players: {
          [user.uid]: {
            id: user.uid,
            name: user.displayName || user.email!,
            isHost: true,
            isReady: true,
            scores: [],
            totalScore: 0,
          }
        },
        gameActivity: [`${user.displayName || user.email} created the game`],
      };

      await set(gameRef, gameData);
      
      toast({
        title: "Game created!",
        description: `Game code: ${gameCode}`,
      });
      
      return gameCode;
    } catch (error: any) {
      toast({
        title: "Error creating game",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const joinGame = async (gameCode: string) => {
    if (!user) return;

    try {
      // Find game by code
      const gamesRef = ref(database, 'games');
      onValue(gamesRef, (snapshot) => {
        const games = snapshot.val();
        const gameEntry = Object.entries(games || {}).find(
          ([, game]: [string, any]) => game.gameCode === gameCode.toUpperCase()
        );

        if (!gameEntry) {
          toast({
            title: "Game not found",
            description: "Please check the game code and try again",
            variant: "destructive",
          });
          return;
        }

        const [gameId, gameData] = gameEntry as [string, GameState];
        
        if (Object.keys(gameData.players).length >= 6) {
          toast({
            title: "Game is full",
            description: "This game already has 6 players",
            variant: "destructive",
          });
          return;
        }

        // Add player to game
        const playerData: Player = {
          id: user.uid,
          name: user.displayName || user.email!,
          isHost: false,
          isReady: false,
          scores: [],
          totalScore: 0,
        };

        const updates = {
          [`games/${gameId}/players/${user.uid}`]: playerData,
          [`games/${gameId}/gameActivity`]: [
            ...(gameData.gameActivity || []),
            `${user.displayName || user.email} joined the game`
          ]
        };

        update(ref(database), updates);
        
        toast({
          title: "Joined game!",
          description: `Welcome to ${gameData.courseName || 'the game'}`,
        });
      }, { onlyOnce: true });
    } catch (error: any) {
      toast({
        title: "Error joining game",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const listenToGame = (gameId: string) => {
    const gameRef = ref(database, `games/${gameId}`);
    return onValue(gameRef, (snapshot) => {
      const gameData = snapshot.val();
      if (gameData) {
        setCurrentGame(gameData);
      }
    });
  };

  const submitScore = async (gameId: string, holeIndex: number, score: number) => {
    if (!user || !currentGame) return;

    try {
      const playerScores = [...(currentGame.players[user.uid].scores || [])];
      playerScores[holeIndex] = score;
      
      const totalScore = playerScores.reduce((sum, s) => sum + (s || 0), 0);
      
      const updates = {
        [`games/${gameId}/players/${user.uid}/scores`]: playerScores,
        [`games/${gameId}/players/${user.uid}/totalScore`]: totalScore,
      };

      await update(ref(database), updates);
      
      toast({
        title: "Score submitted!",
        description: `Hole ${holeIndex + 1}: ${score} strokes`,
      });
    } catch (error: any) {
      toast({
        title: "Error submitting score",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const purchaseHosting = async () => {
    if (!user) return;

    try {
      // Simulate purchase - in real app would integrate with payment processor
      const userRef = ref(database, `users/${user.uid}`);
      await update(userRef, { hasHostingPrivilege: true });
      
      toast({
        title: "Purchase successful!",
        description: "You can now host games",
      });
    } catch (error: any) {
      toast({
        title: "Purchase failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    currentGame,
    hasHostingPrivilege,
    createGame,
    joinGame,
    listenToGame,
    submitScore,
    purchaseHosting,
  };
}
