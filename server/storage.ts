import { type User, type InsertUser, type Game, type InsertGame } from "@shared/schema";
import { randomUUID } from "crypto";

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

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private games: Map<string, Game>;

  constructor() {
    this.users = new Map();
    this.games = new Map();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      hasHostingPrivilege: insertUser.hasHostingPrivilege ?? false,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Game operations
  async getGame(id: string): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async getGameByCode(gameCode: string): Promise<Game | undefined> {
    return Array.from(this.games.values()).find(
      (game) => game.gameCode === gameCode.toUpperCase(),
    );
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const id = randomUUID();
    const gameCode = this.generateGameCode();
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
      createdAt: new Date()
    };
    this.games.set(id, game);
    return game;
  }

  async updateGame(id: string, updates: Partial<Game>): Promise<Game | undefined> {
    const game = this.games.get(id);
    if (!game) return undefined;
    
    const updatedGame = { ...game, ...updates };
    this.games.set(id, updatedGame);
    return updatedGame;
  }

  async deleteGame(id: string): Promise<boolean> {
    return this.games.delete(id);
  }

  private generateGameCode(): string {
    let code: string;
    do {
      code = Math.random().toString(36).substring(2, 8).toUpperCase();
    } while (Array.from(this.games.values()).some(game => game.gameCode === code));
    
    return code;
  }
}

export const storage = new MemStorage();
