import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCommentSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Test endpoint to check if API is working
  app.get("/api/test", (req, res) => {
    console.log("Test API hit successfully!");
    res.status(200).json({ success: true, message: "API is working correctly!" });
  });
  
  // Database health check endpoint
  app.get("/api/db-status", async (req, res) => {
    try {
      if (!process.env.DATABASE_URL) {
        return res.status(500).json({ 
          success: false, 
          message: "DATABASE_URL environment variable not set",
          status: "disconnected"
        });
      }
      
      // Simple query to check database connection
      const result = await storage.checkDatabaseConnection();
      return res.status(200).json({ 
        success: true, 
        message: "Database connection successful", 
        status: "connected"
      });
    } catch (error) {
      console.error("Database connection error:", error);
      return res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Unknown database error",
        status: "error"
      });
    }
  });

  // Add comments route
  app.post("/api/comments", async (req, res) => {
    try {
      console.log("Received comment submission:", req.body);
      // Validate request body
      const validatedData = insertCommentSchema.parse(req.body);
      
      // Insert comment into database
      const comment = await storage.createComment(validatedData);
      console.log("Comment saved successfully:", comment);
      
      res.status(201).json({
        success: true,
        message: "Comment submitted successfully",
        data: comment
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        console.error("Validation error:", validationError.message);
        res.status(400).json({
          success: false, 
          message: validationError.message
        });
      } else {
        console.error("Error submitting comment:", error);
        res.status(500).json({
          success: false,
          message: "Error submitting comment. Please try again later."
        });
      }
    }
  });

  // Get all comments (for admin purposes)
  app.get("/api/comments", async (req, res) => {
    try {
      console.log("Fetching all comments");
      const comments = await storage.getAllComments();
      console.log(`Retrieved ${comments.length} comments`);
      res.status(200).json({
        success: true,
        data: comments
      });
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching comments. Please try again later."
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
