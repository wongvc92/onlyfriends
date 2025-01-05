# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# Pass multiple environment variables as build arguments
ARG VITE_SERVER_URL
ARG VITE_ALLOWED_IMAGE_DOMAIN


# Set them as environment variables
ENV VITE_SERVER_URL=${VITE_SERVER_URL}
ENV VITE_ALLOWED_IMAGE_DOMAIN=${VITE_ALLOWED_IMAGE_DOMAIN}


# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve the build with Nginx
FROM nginx:stable-alpine

# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the build output from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]