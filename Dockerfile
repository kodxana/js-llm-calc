# Production image
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --legacy-peer-deps --production=false

# Copy source code
COPY . .

# Build the application (skip linting)
RUN SKIP_LINT=true npm run build

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Start the application
CMD ["npm", "start"] 