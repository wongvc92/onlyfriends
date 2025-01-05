# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application code and build
COPY . .
RUN npm run build

# Nginx stage
FROM nginx:stable-alpine

# Copy build files to Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx/nginx-client.conf /etc/nginx/conf.d/default.conf

# Expose ports
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]