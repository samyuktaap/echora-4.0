# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
# Install only production dependencies
RUN npm install --only=production
# Copy build files from build stage
COPY --from=build /app/dist ./dist
# Copy the server file
COPY server.js ./

EXPOSE 8080
ENV PORT=8080

CMD ["node", "server.js"]
