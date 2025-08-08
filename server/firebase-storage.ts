import { type User, type InsertUser, type Game, type InsertGame } from "@shared/schema";
import { randomUUID } from "crypto";
import { ref, set, get, update, remove, push, onValue } from "firebase/database";
import { database } from "../client/src/lib/firebase";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Game operations
  getGame(id: string): Promise<Game | undefined>;
  getGameByCode(gameCode: string): Promise<Game | undefined>;
  createGame(game: InsertGame): Promise<Game>;
  updateGame(id: string, updates: Partial<Game>): Promise<Game | undefined>;
  deleteGame(id: string): Promise<boolean>;
}

export class FirebaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    try {
      const userRef = ref(database, `users/${id}`);
      const snapshot = await get(userRef);
      return snapshot.exists() ? snapshot.val() : undefined;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const usersRef = ref(database, 'users');
      const snapshot = await get(usersRef);
      if (!snapshot.exists()) return undefined;
      
      const users = snapshot.val();
      return Object.values(users).find((user: any) => user.email === email);
    } catch (error) {
      console.error('Error getting user by email:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const id = randomUUID();
      const user: User = { 
        ...insertUser, 
        id,
        hasHostingPrivilege: insertUser.hasHostingPrivilege ?? false,
        createdAt: new Date().toISOString()
      };
      
      const userRef = ref(database, `users/${id}`);
      await set(userRef, user);
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    try {
      const userRef = ref(database, `users/${id}`);
      const snapshot = await get(userRef);
      if (!snapshot.exists()) return undefined;
      
      const currentUser = snapshot.val();
      const updatedUser = { ...currentUser, ...updates };
      
      await update(userRef, updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      return undefined;
    }
  }

  // Game operations
  async getGame(id: string): Promise<Game | undefined> {
    try {
      const gameRef = ref(database, `games/${id}`);
      const snapshot = await get(gameRef);
      return snapshot.exists() ? snapshot.val() : undefined;
    } catch (error) {
      console.error('Error getting game:', error);
      return undefined;
    }
  }

  async getGameByCode(gameCode: string): Promise<Game | undefined> {
    try {
      const gamesRef = ref(database, 'games');
      const snapshot = await get(gamesRef);
      if (!snapshot.exists()) return undefined;
      
      const games = snapshot.val();
      return Object.values(games).find((game: any) => game.gameCode === gameCode.toUpperCase());
    } catch (error) {
      console.error('Error getting game by code:', error);
      return undefined;
    }
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    try {
      const id = randomUUID();
      const gameCode = await this.generateGameCode();
      const game: Game = { 
        ...insertGame, 
        id,
        gameCode,
        courseName: insertGame.courseName ?? null,
        currentHole: insertGame.currentHole ?? 1,
        currentPar: insertGame.currentPar ?? 3,
        gamePhase: insertGame.gamePhase ?? "lobby",
        players: insertGame.players ?? {},
        scores: insertGame.scores ?? {},
        gameActivity: insertGame.gameActivity ?? [],
        createdAt: new Date().toISOString()
      };
      
      const gameRef = ref(database, `games/${id}`);
      await set(gameRef, game);
      return game;
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  }

  async updateGame(id: string, updates: Partial<Game>): Promise<Game | undefined> {
    try {
      const gameRef = ref(database, `games/${id}`);
      const snapshot = await get(gameRef);
      if (!snapshot.exists()) return undefined;
      
      const currentGame = snapshot.val();
      const updatedGame = { ...currentGame, ...updates };
      
      await update(gameRef, updatedGame);
      return updatedGame;
    } catch (error) {
      console.error('Error updating game:', error);
      return undefined;
    }
  }

  async deleteGame(id: string): Promise<boolean> {
    try {
      const gameRef = ref(database, `games/${id}`);
      await remove(gameRef);
      return true;
    } catch (error) {
      console.error('Error deleting game:', error);
      return false;
    }
  }

  private async generateGameCode(): Promise<string> {
    let code: string;
    let attempts = 0;
    const maxAttempts = 100;
    
    do {
      code = Math.random().toString(36).substring(2, 8).toUpperCase();
      attempts++;
      
      if (attempts > maxAttempts) {
        throw new Error('Failed to generate unique game code');
      }
      
      const existingGame = await this.getGameByCode(code);
      if (!existingGame) break;
    } while (true);
    
    return code;
  }
}

export const firebaseStorage = new FirebaseStorage(); 