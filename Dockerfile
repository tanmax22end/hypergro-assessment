# Use a Node.js base image with version 18
FROM node:18.16.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the server code to the working directory
COPY . .

# Expose the port on which the server will listen
EXPOSE 8080

# Set the startup command to run the Node.js server
CMD ["node", "index.js"]