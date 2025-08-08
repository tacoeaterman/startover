// server/index-prod.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";

// server/firebase-storage.ts
import { randomUUID } from "crypto";
import { ref as ref2, set as set2, get as get2, update as update2, remove as remove2 } from "firebase/database";

// client/src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { getDatabase, ref, set, get, onValue, push, update, remove } from "firebase/database";
var firebaseConfig = {
  apiKey: "AIzaSyCEtbJ-KR_UV9LAlYlnvgoxliRs5FkSdXk",
  appId: "1:987543051729:web:c258be8a9deaa79a52d4f0",
  authDomain: "kicked-in-the-disc.firebaseapp.com",
  databaseURL: "https://kicked-in-the-disc-default-rtdb.firebaseio.com",
  messagingSenderId: "987543051729",
  projectId: "kicked-in-the-disc",
  storageBucket: "kicked-in-the-disc.firebasestorage.app"
};
console.log("Initializing Firebase with config:", firebaseConfig);
var app = initializeApp(firebaseConfig);
var auth = getAuth(app);
var database = getDatabase(app);

// server/firebase-storage.ts
var FirebaseStorage = class {
  // User operations
  async getUser(id) {
    try {
      const userRef = ref2(database, `users/${id}`);
      const snapshot = await get2(userRef);
      return snapshot.exists() ? snapshot.val() : void 0;
    } catch (error) {
      console.error("Error getting user:", error);
      return void 0;
    }
  }
  async getUserByEmail(email) {
    try {
      const usersRef = ref2(database, "users");
      const snapshot = await get2(usersRef);
      if (!snapshot.exists()) return void 0;
      const users = snapshot.val();
      return Object.values(users).find((user) => user.email === email);
    } catch (error) {
      console.error("Error getting user by email:", error);
      return void 0;
    }
  }
  async createUser(insertUser) {
    try {
      const id = randomUUID();
      const user = {
        ...insertUser,
        id,
        hasHostingPrivilege: insertUser.hasHostingPrivilege ?? false,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      const userRef = ref2(database, `users/${id}`);
      await set2(userRef, user);
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
  async updateUser(id, updates) {
    try {
      const userRef = ref2(database, `users/${id}`);
      const snapshot = await get2(userRef);
      if (!snapshot.exists()) return void 0;
      const currentUser = snapshot.val();
      const updatedUser = { ...currentUser, ...updates };
      await update2(userRef, updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      return void 0;
    }
  }
  // Game operations
  async getGame(id) {
    try {
      const gameRef = ref2(database, `games/${id}`);
      const snapshot = await get2(gameRef);
      return snapshot.exists() ? snapshot.val() : void 0;
    } catch (error) {
      console.error("Error getting game:", error);
      return void 0;
    }
  }
  async getGameByCode(gameCode) {
    try {
      const gamesRef = ref2(database, "games");
      const snapshot = await get2(gamesRef);
      if (!snapshot.exists()) return void 0;
      const games = snapshot.val();
      return Object.values(games).find((game) => game.gameCode === gameCode.toUpperCase());
    } catch (error) {
      console.error("Error getting game by code:", error);
      return void 0;
    }
  }
  async createGame(insertGame) {
    try {
      const id = randomUUID();
      const gameCode = await this.generateGameCode();
      const game = {
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
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      const gameRef = ref2(database, `games/${id}`);
      await set2(gameRef, game);
      return game;
    } catch (error) {
      console.error("Error creating game:", error);
      throw error;
    }
  }
  async updateGame(id, updates) {
    try {
      const gameRef = ref2(database, `games/${id}`);
      const snapshot = await get2(gameRef);
      if (!snapshot.exists()) return void 0;
      const currentGame = snapshot.val();
      const updatedGame = { ...currentGame, ...updates };
      await update2(gameRef, updatedGame);
      return updatedGame;
    } catch (error) {
      console.error("Error updating game:", error);
      return void 0;
    }
  }
  async deleteGame(id) {
    try {
      const gameRef = ref2(database, `games/${id}`);
      await remove2(gameRef);
      return true;
    } catch (error) {
      console.error("Error deleting game:", error);
      return false;
    }
  }
  async generateGameCode() {
    let code;
    let attempts = 0;
    const maxAttempts = 100;
    do {
      code = Math.random().toString(36).substring(2, 8).toUpperCase();
      attempts++;
      if (attempts > maxAttempts) {
        throw new Error("Failed to generate unique game code");
      }
      const existingGame = await this.getGameByCode(code);
      if (!existingGame) break;
    } while (true);
    return code;
  }
};
var firebaseStorage = new FirebaseStorage();

// server/routes.ts
async function registerRoutes(app2) {
  const httpServer = createServer(app2);
  const wss = new WebSocketServer({
    server: httpServer,
    path: "/ws"
  });
  const connections = /* @__PURE__ */ new Map();
  wss.on("connection", (ws, request) => {
    console.log("WebSocket connection established");
    ws.on("message", async (data) => {
      try {
        const message = JSON.parse(data.toString());
        const { type, userId, gameId, payload } = message;
        if (userId && type === "authenticate") {
          connections.set(userId, ws);
        }
        switch (type) {
          case "join_game":
            broadcastToGame(gameId, {
              type: "player_joined",
              payload
            });
            break;
          case "update_score":
            if (gameId) {
              broadcastToGame(gameId, {
                type: "score_updated",
                payload
              });
            }
            break;
          case "game_state_change":
            if (gameId) {
              broadcastToGame(gameId, {
                type: "game_updated",
                payload
              });
            }
            break;
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });
    ws.on("close", () => {
      for (const [userId, connection] of Array.from(connections.entries())) {
        if (connection === ws) {
          connections.delete(userId);
          break;
        }
      }
    });
  });
  function broadcastToGame(gameId, message) {
    for (const [userId, ws] of Array.from(connections.entries())) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    }
  }
  app2.get("/api/games/:gameCode", async (req, res) => {
    try {
      const game = await firebaseStorage.getGameByCode(req.params.gameCode);
      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }
      res.json(game);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch game" });
    }
  });
  app2.post("/api/games", async (req, res) => {
    try {
      const game = await firebaseStorage.createGame(req.body);
      res.json(game);
    } catch (error) {
      res.status(500).json({ error: "Failed to create game" });
    }
  });
  app2.put("/api/games/:id", async (req, res) => {
    try {
      const game = await firebaseStorage.updateGame(req.params.id, req.body);
      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }
      res.json(game);
    } catch (error) {
      res.status(500).json({ error: "Failed to update game" });
    }
  });
  app2.post("/api/users", async (req, res) => {
    try {
      const user = await firebaseStorage.createUser(req.body);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to create user" });
    }
  });
  app2.get("/api/users/:id", async (req, res) => {
    try {
      const user = await firebaseStorage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });
  app2.put("/api/users/:id", async (req, res) => {
    try {
      const user = await firebaseStorage.updateUser(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  });
  return httpServer;
}

// server/vite-prod.ts
import express from "express";
import fs from "fs";
import path from "path";
function serveStatic(app2) {
  const distPath = path.resolve(import.meta.dirname, "..", "dist", "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

// server/index-prod.ts
async function startServer() {
  const app2 = express2();
  app2.use(express2.json());
  registerRoutes(app2);
  serveStatic(app2);
  app2.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  });
  const port = process.env.PORT || 3e3;
  app2.listen(port, () => {
    console.log(`\u{1F680} Server running on port ${port}`);
  });
}
startServer().catch(console.error);
