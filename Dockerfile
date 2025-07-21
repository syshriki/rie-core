FROM node:24-alpine

WORKDIR /opt/rie-server

# Copy package.json and package-lock.json
COPY ./ ./

# Install only production dependencies
RUN npm ci --only=production

ENV NODE_ENV=production

EXPOSE 8001

# Execute commands directly in the ENTRYPOINT
ENTRYPOINT export DB_PASSWORD=$(cat /run/secrets/pg_password 2>/dev/null || echo ""); \
           npm run prod