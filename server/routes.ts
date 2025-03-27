import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCommentSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { uploadRouter } from "./upload";

export async function registerRoutes(app: Express): Promise<Server> {
  // Përdor routerin e ngarkimit të imazheve
  app.use('/api', uploadRouter);
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

  // Add comments route with security enhancements
  app.post("/api/comments", async (req, res) => {
    try {
      // Basic request verification
      const userIp = req.ip || req.socket.remoteAddress || 'unknown';
      console.log(`Received comment submission from IP ${userIp}`);
      
      // Rate limiting - log to enable implementation later
      console.log(`Request timestamp: ${new Date().toISOString()}`);
      
      // Sanitize and validate input data 
      const rawData = req.body;
      
      // Simple XSS prevention by converting angle brackets
      Object.keys(rawData).forEach(key => {
        if (typeof rawData[key] === 'string') {
          // Convert angle brackets to HTML entities to prevent script injection
          rawData[key] = rawData[key]
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        }
      });
      
      // Use Zod schema to validate the structure and data types
      const validatedData = insertCommentSchema.parse(rawData);
      
      // Insert sanitized comment into database
      const comment = await storage.createComment(validatedData);
      console.log("Comment saved successfully with ID:", comment.id);
      
      // Return minimal information - don't expose implementation details
      res.status(201).json({
        success: true,
        message: "Mesazhi u dërgua me sukses. Faleminderit!"
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        console.error("Validation error:", validationError.message);
        res.status(400).json({
          success: false, 
          message: "Të dhënat e futura nuk janë të vlefshme. Ju lutemi kontrolloni dhe provoni përsëri."
        });
      } else {
        console.error("Error submitting comment:", error);
        res.status(500).json({
          success: false,
          message: "Ka ndodhur një gabim gjatë dërgimit të mesazhit. Ju lutemi provoni përsëri më vonë."
        });
      }
    }
  });

  // Get all comments (for admin purposes) with security enhancements
  app.get("/api/comments", async (req, res) => {
    try {
      // Basic authentication - in production, this should use proper auth middleware
      const authHeader = req.headers.authorization;
      
      // Simple admin auth check - not production-ready, just for demonstration
      // In a real app, this would use JWT or other secure auth method
      if (!authHeader || authHeader !== 'Basic YWRtaW46YWRtaW4xMjM=') { // base64 of "admin:admin123"
        console.log("Unauthorized comments access attempt");
        return res.status(401).json({
          success: false,
          message: "Ju nuk keni autorizimin e duhur për të parë këto të dhëna."
        });
      }
      
      // Log access for audit trail
      const userIp = req.ip || req.socket.remoteAddress || 'unknown';
      console.log(`Admin fetching all comments from IP ${userIp}`);
      
      // Get all comments from database
      const comments = await storage.getAllComments();
      console.log(`Retrieved ${comments.length} comments`);
      
      // Sanitize output - clean HTML entities if present for rendering safety
      const sanitizedComments = comments.map(comment => ({
        ...comment,
        // Convert HTML entities back for admin display
        message: comment.message
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
      }));
      
      res.status(200).json({
        success: true,
        data: sanitizedComments
      });
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({
        success: false,
        message: "Ka ndodhur një gabim gjatë marrjes së mesazheve. Ju lutemi provoni përsëri."
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
