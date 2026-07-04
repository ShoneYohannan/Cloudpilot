FROM node:22-alpine

# Set working directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy app source
COPY src/ ./src
COPY .env ./

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "start"]
