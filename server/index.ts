import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";

async function startServer() {
  const app = express();

  // Middleware
  app.use(express.json());

  // Register API routes
  registerRoutes(app);

  // Serve static files in production
  if (process.env.NODE_ENV === "production") {
    const { serveStatic } = await import("./vite-prod");
    serveStatic(app);
  } else {
    // Development mode - setup Vite dev server
    const { setupViteDev } = await import("./vite-dev");
    const server = app.listen(process.env.PORT || 3000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
    });
    await setupViteDev(app, server);
  }

  // Error handling middleware
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  });

  // Start server in production mode
  if (process.env.NODE_ENV === "production") {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  }
}

startServer().catch(console.error);
