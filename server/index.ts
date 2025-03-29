import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import * as path from "path";
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';
import cors from 'cors';

// ESM support for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();

// Security middleware - with relaxed CSP for development
if (process.env.NODE_ENV === 'production') {
  // Stricter CSP for production
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https:", "http:"], // Allow all images for now
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        connectSrc: ["'self'"],
        frameSrc: ["'self'"],
        objectSrc: ["'none'"],
      },
    },
    xssFilter: true,
    noSniff: true,
    referrerPolicy: { policy: 'same-origin' }
  }));
} else {
  // Completely disable CSP in development to avoid breaking assets
  app.use(
    helmet({
      contentSecurityPolicy: false,
      xssFilter: true,
      noSniff: true,
      referrerPolicy: { policy: 'same-origin' }
    })
  );
}

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes"
  }
});
app.use('/api/', apiLimiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 
    ['https://shkolla-abdulla-keta.al', 'https://www.shkolla-abdulla-keta.al'] : 
    '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parsers with size limits to prevent DoS attacks
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// Parse cookies
app.use(cookieParser());

// Prevent parameter pollution
app.use(hpp());

// Serve static files from public folder with cache control
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads'), {
  maxAge: '1d', // Cache for 1 day
  setHeaders: (res, path) => {
    // Don't cache HTML files
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// Logging middleware
app.use((req, res, next) => {
  // Sanitize request logging to prevent log injection
  const sanitizedPath = req.path.replace(/[\n\r]/g, '');
  const sanitizedMethod = req.method.replace(/[\n\r]/g, '');
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  
  const start = Date.now();
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (sanitizedPath.startsWith("/api")) {
      let logLine = `[${new Date().toISOString()}] IP: ${ip} - ${sanitizedMethod} ${sanitizedPath} ${res.statusCode} in ${duration}ms`;
      
      // Only log minimal information about the response
      if (capturedJsonResponse) {
        // Only log success status, not full payload
        logLine += ` :: status: ${capturedJsonResponse.success ? 'success' : 'failed'}`;
      }

      if (logLine.length > 120) {
        logLine = logLine.slice(0, 119) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    // Log error details for debugging but not sensitive information
    const errorId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    console.error(`Error ID: ${errorId}`, {
      type: err.name,
      statusCode: err.status || err.statusCode || 500,
      message: err.message || "Unknown error",
      timestamp: new Date().toISOString()
    });
    
    // Set appropriate status code
    const status = err.status || err.statusCode || 500;
    
    // Only show generic messages to client in production
    const isProduction = process.env.NODE_ENV === 'production';
    const clientMessage = isProduction ? 
      "Ndodhi një gabim në server. Ju lutemi provoni përsëri më vonë." : 
      err.message || "Internal Server Error";
    
    // Send minimal error info to client
    res.status(status).json({ 
      success: false,
      message: clientMessage,
      errorId: errorId // Allow users to reference this error when reporting issues
    });
    
    // Don't throw the error further as it could crash the server
    // Instead, we've already logged it above
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Serve the app on port 5000
  // This serves both the API and the client
  const port = 5000;
  server.listen(port, "0.0.0.0", (err?: Error) => {
    if (err) {
      log(`Error starting server: ${err.message}`);
      return;
    }
    log(`Server running at http://0.0.0.0:${port}`);
  });
})();