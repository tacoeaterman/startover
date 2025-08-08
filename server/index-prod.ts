import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./vite-prod";

async function startServer() {
  const app = express();

  // Middleware
  app.use(express.json());

  // Register API routes
  registerRoutes(app);

  // Serve static files in production
  serveStatic(app);

  // Error handling middleware
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  });

  // Start server
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
}

startServer().catch(console.error); 