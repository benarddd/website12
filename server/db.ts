import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Check for DATABASE_URL environment variable
if (!process.env.DATABASE_URL) {
  console.warn(
    "DATABASE_URL is not set. This is required for production and proper database functionality."
  );
  console.warn(
    "For local development, please create a .env file based on the .env.example template."
  );
  
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      "DATABASE_URL must be set in production. Did you forget to provision a database?"
    );
  }
}

// Use the provided DATABASE_URL or a development fallback that will show a clear UI message
const connectionString = process.env.DATABASE_URL;
export const pool = new Pool({ 
  connectionString: connectionString 
});
export const db = drizzle({ client: pool, schema });
