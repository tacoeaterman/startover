import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { firebaseStorage as storage } from "./firebase-storage";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // WebSocket server for real-time game updates
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws' 
  });
  
  // Store active connections by user ID
  const connections = new Map<string, WebSocket>();
  
  wss.on('connection', (ws: WebSocket, request) => {
    console.log('WebSocket connection established');
    
    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        const { type, userId, gameId, payload } = message;
        
        // Store connection with user ID
        if (userId && type === 'authenticate') {
          connections.set(userId, ws);
        }
        
        // Handle different message types
        switch (type) {
          case 'join_game':
            // Broadcast to all players in the game
            broadcastToGame(gameId, {
              type: 'player_joined',
              payload: payload
            });
            break;
            
          case 'update_score':
            // Update score and broadcast to game
            if (gameId) {
              broadcastToGame(gameId, {
                type: 'score_updated',
                payload: payload
              });
            }
            break;
            
          case 'game_state_change':
            // Broadcast game state changes
            if (gameId) {
              broadcastToGame(gameId, {
                type: 'game_updated',
                payload: payload
              });
            }
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      // Remove connection when closed
      for (const [userId, connection] of Array.from(connections.entries())) {
        if (connection === ws) {
          connections.delete(userId);
          break;
        }
      }
    });
  });
  
  function broadcastToGame(gameId: string, message: any) {
    // In a real implementation, you'd track which users are in which games
    // For now, broadcast to all connected clients
    for (const [userId, ws] of Array.from(connections.entries())) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    }
  }
  
  // REST API endpoints for game management
  app.get('/api/games/:gameCode', async (req, res) => {
    try {
      const game = await storage.getGameByCode(req.params.gameCode);
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }
      res.json(game);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch game' });
    }
  });
  
  app.post('/api/games', async (req, res) => {
    try {
      const game = await storage.createGame(req.body);
      res.json(game);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create game' });
    }
  });
  
  app.put('/api/games/:id', async (req, res) => {
    try {
      const game = await storage.updateGame(req.params.id, req.body);
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }
      res.json(game);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update game' });
    }
  });
  
  app.post('/api/users', async (req, res) => {
    try {
      const user = await storage.createUser(req.body);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user' });
    }
  });
  
  app.get('/api/users/:id', async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  });
  
  app.put('/api/users/:id', async (req, res) => {
    try {
      const user = await storage.updateUser(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user' });
    }
  });

  return httpServer;
}
