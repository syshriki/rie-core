FROM node:18-alpine as builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built TypeScript files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/config ./config

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/server.js"]
