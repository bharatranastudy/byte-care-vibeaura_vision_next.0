FROM node:16-alpine

WORKDIR /app

# Configure npm for better reliability
RUN npm config set registry https://registry.npmjs.org/
RUN npm config set fetch-retry-mintimeout 20000
RUN npm config set fetch-retry-maxtimeout 120000
RUN npm config set fetch-timeout 300000
RUN npm config set network-timeout 300000

# Copy package files
COPY package*.json ./

# Install dependencies with retry logic
RUN npm install --legacy-peer-deps --verbose || \
    (sleep 5 && npm install --legacy-peer-deps --verbose) || \
    (sleep 10 && npm install --legacy-peer-deps --verbose)

# Copy source code
COPY . .

# Set environment variables
ENV NODE_ENV=development
ENV GENERATE_SOURCEMAP=false
ENV SKIP_PREFLIGHT_CHECK=true

EXPOSE 3000

# Run in development mode to avoid build issues
CMD ["npm", "start"]
