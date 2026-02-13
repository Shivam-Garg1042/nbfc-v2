# Build stage
FROM node:18-slim AS build

WORKDIR /app

# Declare build argument for backend URL
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code and config files
COPY . .

# Build the Vite app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 8080 for Cloud Run
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]