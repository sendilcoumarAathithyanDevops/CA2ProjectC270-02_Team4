# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY ../package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY ../ .

# Expose port (default 3000, can be overridden)
EXPOSE 3000

# Set environment variable for production
ENV NODE_ENV=production

# Start the application (server.js is now in src/server/)
CMD ["node", "src/server/server.js"]


#done by hong le
