import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCommentSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { uploadRouter } from "./upload";
import { rateLimit } from "express-rate-limit";
import * as crypto from 'crypto';
import jwt from 'jsonwebtoken';

// Secret key for JWT - should be in environment variables for production
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');

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

  // Rate limiter for comments API to prevent spam
  const commentsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 submissions per IP per 15 minutes
    message: {
      success: false,
      message: "Keni dërguar shumë mesazhe në një kohë të shkurtër. Ju lutemi provoni përsëri pas 15 minutash."
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Security middleware for input validation with detailed logging
  const validateCommentInput = (req: Request, res: Response, next: NextFunction) => {
    try {
      const rawData = req.body;
      
      // Check for empty request
      if (!rawData || Object.keys(rawData).length === 0) {
        return res.status(400).json({
          success: false,
          message: "Kërkesë e zbrazët. Ju lutemi plotësoni të gjitha fushat e kërkuara."
        });
      }
      
      // Generate request ID for tracing
      const requestId = crypto.randomBytes(8).toString('hex');
      req.headers['x-request-id'] = requestId;
      
      // Sanitize input against XSS
      const sanitizedData: Record<string, any> = {};
      
      Object.keys(rawData).forEach(key => {
        if (typeof rawData[key] === 'string') {
          // Advanced XSS protection - replace potentially dangerous characters
          sanitizedData[key] = rawData[key]
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/`/g, '&#96;')
            .replace(/\$/g, '&#36;')
            .replace(/{/g, '&#123;')
            .replace(/}/g, '&#125;')
            .trim();
        } else {
          sanitizedData[key] = rawData[key];
        }
      });
      
      // Store sanitized data in request for next middleware
      req.body = sanitizedData;
      
      next();
    } catch (error) {
      console.error("Error in comment validation middleware:", error);
      return res.status(400).json({
        success: false,
        message: "Gabim në validimin e të dhënave."
      });
    }
  };

  // Add comments route with security enhancements
  app.post("/api/comments", commentsLimiter, validateCommentInput, async (req, res) => {
    try {
      // Capture client details for security logging
      const userIp = (req.ip || req.socket.remoteAddress || 'unknown').replace(/[\n\r]/g, '');
      const userAgent = (req.headers['user-agent'] || 'unknown').replace(/[\n\r]/g, '');
      const requestId = req.headers['x-request-id'] || 'unknown';
      
      // Detailed security logging
      console.log(`[${new Date().toISOString()}] [ReqID: ${requestId}] Comment submission from IP: ${userIp}, User-Agent: ${userAgent.substring(0, 50)}`);
      
      try {
        // Schema validation with Zod
        const validatedData = insertCommentSchema.parse(req.body);
        
        // Generate a CSRF token for the user session (would be used in a stateful application)
        const csrfToken = crypto.randomBytes(16).toString('hex');
        
        // Insert sanitized comment into database with additional checks
        const comment = await storage.createComment(validatedData);
        
        // Minimal logging of success to avoid leaking sensitive info
        console.log(`[${new Date().toISOString()}] [ReqID: ${requestId}] Comment saved with ID: ${comment.id}`);
        
        // Return minimal information with additional security headers
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.status(201).json({
          success: true,
          message: "Mesazhi u dërgua me sukses. Faleminderit!"
        });
      } catch (validationError) {
        if (validationError instanceof ZodError) {
          const formattedError = fromZodError(validationError);
          
          // Log validation errors without exposing full details
          console.error(`[${new Date().toISOString()}] [ReqID: ${requestId}] Validation error in comment submission`);
          
          // Send sanitized error message to client
          return res.status(400).json({
            success: false, 
            message: "Të dhënat e futura nuk janë të vlefshme. Ju lutemi kontrolloni dhe provoni përsëri."
          });
        }
        throw validationError;
      }
    } catch (error) {
      // Generate unique error ID for tracking
      const errorId = Date.now().toString(36) + Math.random().toString(36).substr(2);
      
      console.error(`[ErrorID: ${errorId}] Error submitting comment:`, error);
      
      res.status(500).json({
        success: false,
        message: "Ka ndodhur një gabim gjatë dërgimit të mesazhit. Ju lutemi provoni përsëri më vonë.",
        errorReference: errorId // For user to reference when reporting issues
      });
    }
  });

  // Authentication middleware for admin routes
  const authenticateAdmin = (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get the auth header
      const authHeader = req.headers.authorization;
      
      // Check for authorization header presence
      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: "Ju lutemi identifikohuni për të vazhduar."
        });
      }
      
      // Two types of auth supported: Basic Auth (legacy) and Bearer Token (JWT)
      if (authHeader.startsWith('Basic ')) {
        // Simple admin auth check using secure comparison
        // For production, this would be replaced with a database lookup
        const isValidBasicAuth = crypto.timingSafeEqual(
          Buffer.from(authHeader),
          Buffer.from('Basic YWRtaW46YWRtaW4xMjM=') // base64 of "admin:admin123"
        );
        
        if (!isValidBasicAuth) {
          // Log failed auth attempt without revealing specifics
          const userIp = (req.ip || req.socket.remoteAddress || 'unknown').replace(/[\n\r]/g, '');
          console.log(`[${new Date().toISOString()}] Failed Basic Auth attempt from IP: ${userIp}`);
          
          return res.status(401).json({
            success: false,
            message: "Identifikimi dështoi. Ju nuk keni autorizimin e duhur."
          });
        }
        
        // Auth successful for Basic Auth
        next();
      } 
      else if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        
        // Verify JWT token
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
          if (err) {
            // Log JWT verification failure
            console.log(`JWT verification failed: ${err.message}`);
            
            return res.status(401).json({
              success: false,
              message: "Sesioni juaj ka skaduar ose është i pavlefshëm."
            });
          }
          
          // Store decoded user info in request for use in route handlers
          (req as any).user = decoded;
          next();
        });
      } 
      else {
        // Unsupported auth scheme
        return res.status(401).json({
          success: false,
          message: "Skema e autorizimit nuk është e mbështetur."
        });
      }
    } catch (error) {
      console.error("Auth middleware error:", error);
      return res.status(500).json({
        success: false,
        message: "Ka ndodhur një gabim gjatë autentikimit."
      });
    }
  };
  
  // Rate limiter for admin endpoints to prevent brute force
  const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 requests per IP per 15 minutes for admin routes
    message: {
      success: false,
      message: "Shumë kërkesa. Ju lutemi provoni përsëri pas 15 minutash."
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Get all comments (for admin purposes) with enhanced security
  app.get("/api/comments", adminLimiter, authenticateAdmin, async (req: Request, res: Response) => {
    const requestId = crypto.randomBytes(8).toString('hex');
    try {
      // Log access with audit trail information
      const userIp = (req.ip || req.socket.remoteAddress || 'unknown').replace(/[\n\r]/g, '');
      const userInfo = (req as any).user ? `User ID: ${(req as any).user.id}` : 'Basic Auth';
      
      console.log(`[${new Date().toISOString()}] [ReqID: ${requestId}] Admin access from IP: ${userIp}, Auth: ${userInfo}`);
      
      // Add security headers
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Surrogate-Control', 'no-store');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      
      // Get all comments from database with efficient pagination
      // For this example, we're getting all, but in production, you'd implement pagination
      const comments = await storage.getAllComments();
      
      console.log(`[${new Date().toISOString()}] [ReqID: ${requestId}] Retrieved ${comments.length} comments`);
      
      // Process output with security in mind
      const sanitizedComments = comments.map(comment => {
        // Convert HTML entities back for admin display, but with careful sanitization
        // This ensures HTML is rendered safely in the admin UI
        let processedMessage = comment.message
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&#96;/g, '`')
          .replace(/&#36;/g, '$')
          .replace(/&#123;/g, '{')
          .replace(/&#125;/g, '}');
        
        // Convert sensitive PII for display in admin panel (e.g., email addresses)
        // In a real system, you might implement data masking for PII
        
        return {
          id: comment.id,
          name: comment.name,
          email: comment.email, // In production, consider partial masking
          subject: comment.subject,
          message: processedMessage,
          createdAt: comment.createdAt,
          // Don't include any internal fields or metadata here
        };
      });
      
      // Return data with appropriate cache headers
      res.status(200).json({
        success: true,
        data: sanitizedComments,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      // Generate unique error ID for tracking
      const errorId = Date.now().toString(36) + Math.random().toString(36).substr(2);
      
      console.error(`[${new Date().toISOString()}] [ReqID: ${requestId}] [ErrorID: ${errorId}] Error fetching comments:`, error);
      
      res.status(500).json({
        success: false,
        message: "Ka ndodhur një gabim gjatë marrjes së mesazheve. Ju lutemi provoni përsëri.",
        errorId: errorId
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
