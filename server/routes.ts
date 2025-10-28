import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, hashPassword } from "./auth";
import { z } from "zod";
import passport from "passport";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware setup
  await setupAuth(app);

  // Auth routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const schema = z.object({
        email: z.string().email(),
        password: z.string().min(8),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      });
      
      const { email, password, firstName, lastName } = schema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      // Hash password
      const passwordHash = await hashPassword(password);
      
      // Create user
      const user = await storage.upsertUser({
        email,
        passwordHash,
        firstName,
        lastName,
      });
      
      // Log in the user
      req.login(user, (err) => {
        if (err) {
          console.error("Error logging in after registration:", err);
          return res.status(500).json({ message: "Registration successful but login failed" });
        }
        
        const { passwordHash: _, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      console.error("Error registering user:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.post('/api/auth/login', (req, res, next) => {
    passport.authenticate('local', (err: any, user: any, info: any) => {
      if (err) {
        console.error("Error during login:", err);
        return res.status(500).json({ message: "Login failed" });
      }
      
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      
      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error("Error establishing session:", loginErr);
          return res.status(500).json({ message: "Login failed" });
        }
        
        res.json(user);
      });
    })(req, res, next);
  });

  app.post('/api/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error("Error during logout:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { passwordHash, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.patch('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const schema = z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      });
      
      const updates = schema.parse(req.body);
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const updatedUser = await storage.upsertUser({
        ...user,
        ...updates,
      });
      
      const { passwordHash, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating user:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update user" });
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
      const userId = req.user.id;
      const visits = await storage.getUserVisits(userId);
      res.json(visits);
    } catch (error) {
      console.error("Error fetching visits:", error);
      res.status(500).json({ message: "Failed to fetch visits" });
    }
  });

  app.post("/api/visits/increment", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      console.log("[INCREMENT] User ID:", userId, "Body:", req.body);
      const schema = z.object({
        mallId: z.number().int().positive(),
      });
      const { mallId } = schema.parse(req.body);
      console.log("[INCREMENT] Parsed mallId:", mallId);
      
      const visit = await storage.incrementVisit(userId, mallId);
      console.log("[INCREMENT] Success - visit:", visit);
      res.json(visit);
    } catch (error) {
      console.error("[INCREMENT] Error incrementing visit:", error);
      if (error instanceof z.ZodError) {
        console.error("[INCREMENT] Zod validation error:", error.errors);
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to increment visit" });
    }
  });

  app.post("/api/visits/decrement", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
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
      const userId = req.user.id;
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
