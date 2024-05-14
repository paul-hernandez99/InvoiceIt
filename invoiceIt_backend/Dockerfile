# Specify the base image
FROM node:20.11-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) into the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm install -g nodemon

# Bundle app source inside Docker image
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["nodemon", "./src/server.js"]
