import { createClient } from "redis";
import dotenv from "dotenv";

// Load local overrides first, then fallback to .env
dotenv.config({ path: process.env.DOTENV_CONFIG_PATH || ".env.local" });
dotenv.config();

// Redis client configuration with environment variables
const redisConfig = process.env.REDIS_URL
  ? { url: process.env.REDIS_URL }
  : {
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
        tls: process.env.REDIS_HOST === '10.198.46.203', // Enable TLS for GCP Memorystore
        rejectUnauthorized: false, // Allow self-signed certificates
      },
      password: process.env.REDIS_PASSWORD || undefined,
    };

const redisClient = createClient(redisConfig);

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

redisClient.on("connect", () => {
  console.log("Connecting to Redis...");
});

redisClient.on("ready", () => {
  console.log("Redis client ready");
});

(async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis successfully");
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    console.log("⚠️  Redis connection failed. Make sure Redis is running or update .env with valid Redis credentials.");
  }
})();

export default redisClient;
