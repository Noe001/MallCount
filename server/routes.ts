// Based on javascript_log_in_with_replit blueprint
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware setup
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Mall routes
  app.get("/api/malls", isAuthenticated, async (req, res) => {
    try {
      const malls = await storage.getAllMalls();
      res.json(malls);
    } catch (error) {
      console.error("Error fetching malls:", error);
      res.status(500).json({ message: "Failed to fetch malls" });
    }
  });

  app.get("/api/malls/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const mall = await storage.getMall(id);
      if (!mall) {
        return res.status(404).json({ message: "Mall not found" });
      }
      res.json(mall);
    } catch (error) {
      console.error("Error fetching mall:", error);
      res.status(500).json({ message: "Failed to fetch mall" });
    }
  });

  // Visit routes
  app.get("/api/visits", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const visits = await storage.getUserVisits(userId);
      res.json(visits);
    } catch (error) {
      console.error("Error fetching visits:", error);
      res.status(500).json({ message: "Failed to fetch visits" });
    }
  });

  app.post("/api/visits/increment", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const schema = z.object({
        mallId: z.number().int().positive(),
      });
      const { mallId } = schema.parse(req.body);
      
      const visit = await storage.incrementVisit(userId, mallId);
      res.json(visit);
    } catch (error) {
      console.error("Error incrementing visit:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to increment visit" });
    }
  });

  app.post("/api/visits/decrement", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const schema = z.object({
        mallId: z.number().int().positive(),
      });
      const { mallId } = schema.parse(req.body);
      
      const visit = await storage.decrementVisit(userId, mallId);
      res.json(visit);
    } catch (error) {
      console.error("Error decrementing visit:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      if (error instanceof Error) {
        if (error.message === "Visit not found" || error.message === "Visit count is already 0") {
          return res.status(400).json({ message: error.message });
        }
      }
      res.status(500).json({ message: "Failed to decrement visit" });
    }
  });

  app.delete("/api/visits/reset", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.resetAllVisits(userId);
      res.json({ message: "All visits reset successfully" });
    } catch (error) {
      console.error("Error resetting visits:", error);
      res.status(500).json({ message: "Failed to reset visits" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
