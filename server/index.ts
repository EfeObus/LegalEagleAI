import express, { NextFunction, Request, Response } from "express";
import { registerRoutes } from "./routes";
import { serveStatic, setupVite } from "./vite";

// Initialize Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware to log API responses
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  // Override res.json to capture the response body
  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  // Log the response when the request finishes
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine); // Use console.log for visibility
    }
  });

  next();
});

// Error-handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ message });
});

// Main server initialization
(async () => {
  try {
    console.log("Initializing server...");

    // Register routes
    const server = await registerRoutes(app);
    console.log("Routes registered successfully.");

    // Add Vite or static file serving based on environment
    if (app.get("env") === "development") {
      console.log("Setting up Vite in development mode...");
      await setupVite(app, server);
    } else {
      console.log("Serving static files in production mode...");
      serveStatic(app);
    }

    // Start the server
    const port = 5010; // Change this if needed
    server.listen(
      {
        port,
        host: "::", // Listen on all interfaces (IPv4 and IPv6)
      },
      () => {
        console.log(`Server is running and serving on http://[::]:${port}`);
        console.log(`You can access it at http://localhost:${port}`);
      }
    );
  } catch (error) {
    console.error("Failed to start server:", error);
  }
})();