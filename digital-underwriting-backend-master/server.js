import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dns from "dns";

import { ApolloServer } from "apollo-server-express";
import {
  typeDefs,
  resolvers,
} from "./SchemaResolvers/ParentFolder-SRs/Parent-SR.js";
import redisClient from "./redisClient.js";
import dotenv from "dotenv";
import cors from "cors";
import apiFacade from "./api-facade/index.js";

// Load local overrides first, then fallback to .env
dotenv.config({ path: process.env.DOTENV_CONFIG_PATH || ".env.local" });
dotenv.config();

const app = express();

// Dynamic CORS configuration from environment variable
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [
      "https://underwrite.echargeup.com",
      "http://localhost:5173",
      "https://studio.apollographql.com"
    ];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.set("trust proxy", true);

// API Facade routes
app.use('/api', apiFacade);

async function connectToDB() {
  try {
    const mongoDnsServers = process.env.MONGODB_DNS_SERVERS
      ? process.env.MONGODB_DNS_SERVERS.split(",").map((server) => server.trim()).filter(Boolean)
      : ["8.8.8.8", "1.1.1.1"];
    dns.setServers(mongoDnsServers);
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    console.log("Connected to MongoDB with Mongoose");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}
connectToDB();

const startServer = async () => {
  try {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req, res }) => ({
        req,
        res,
        redis: redisClient,
      }),
      introspection: true, 
      playground: true,    
      
    });

    await server.start();
    server.applyMiddleware({ app, path: "/graphql", cors: false });

    const PORT = process.env.PORT || 4000;
    app.listen({ port: PORT }, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
      console.log(`📊 GraphQL Playground: http://localhost:${PORT}/graphql`);
      console.log(`🔒 CORS enabled for: ${allowedOrigins.join(', ')}`);
    });
  } catch (error) {
    console.error("Critical server error:", error);
    process.exit(1);
  }
};

startServer();

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});