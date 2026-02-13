# Use Node.js LTS version
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy all source code
COPY . .

# Expose port (GCP Cloud Run uses PORT env variable, default to 4000)
EXPOSE 4000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["node", "server.js"]