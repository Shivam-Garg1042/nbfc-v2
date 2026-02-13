module.exports = {
  apps: [
    {
      name: "Digital_Underwriting_Backend",
      script: "./server.js", // Path to your main server file
      instances: 1, // Number of instances (1 for single-threaded)
      exec_mode: "cluster", // Use "fork" for a single instance or "cluster" for multi-instance
      env: {
        NODE_ENV: "development", // Common environment variables
        PORT: 4000, // Add the desired port
        HOST: "0.0.0.0", // Bind to all network interfaces
      },
      env_development: {
        // Specifically for development environment
        NODE_ENV: "development",
        PORT: 4000, // Ensure the same port is used in development
        HOST: "0.0.0.0", // Bind to all network interfaces
      },
      env_production: {
        // Specifically for production environment
        NODE_ENV: "production",
        PORT: 4000, // Ensure the same port is used in production
        HOST: "0.0.0.0", // Bind to all network interfaces
      },
    },
  ],
};
