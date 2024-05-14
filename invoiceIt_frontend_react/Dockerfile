# Step 1: Build the React application
FROM node:20.11-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose port 3000 for the development server
EXPOSE 3000

# Start the application using npm start
CMD ["npm", "start"]
