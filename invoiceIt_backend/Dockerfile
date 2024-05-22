FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) into the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm install -g nodemon

# Install Python and other dependencies
RUN apt-get update && apt-get install -y \
  python3 \
  python3-pip \
  build-essential \
  libcairo2-dev \
  libpango1.0-dev \
  libjpeg-dev \
  libgif-dev \
  librsvg2-dev \
  poppler-utils

# Install Python packages
RUN pip3 install pdf2image

# Bundle app source inside Docker image
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["nodemon", "./src/server.js"]
