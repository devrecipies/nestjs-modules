# Stage 1: Build the application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and pnpm-lock.yaml first to leverage Docker cache
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy the entire Nx workspace
COPY . .

# Build the specific NestJS application (replace 'api' with your app name)
RUN npx nx build nestjs-modules-app --prod

# Stage 2: Create the production-ready image
FROM node:18-alpine

WORKDIR /app

# Copy only the built application from the builder stage
COPY --from=builder /app/apps/nestjs-modules-app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose the port your NestJS application listens on (e.g., 3000)
EXPOSE 5656 

# Command to run the application
CMD ["node", "dist/main.js"]
