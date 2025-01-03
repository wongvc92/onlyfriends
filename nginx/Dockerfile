FROM nginx:stable-alpine

# Install Certbot and necessary packages
RUN apk add --no-cache certbot openssl

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration
COPY default.conf /etc/nginx/conf.d/

# Create directory for SSL certificates
RUN mkdir -p /etc/letsencrypt/live/wvcdev.xyz

# Expose ports 80 and 443
EXPOSE 80 443

# Start Nginx and Certbot
CMD ["sh", "-c", "nginx && certbot certonly --webroot -w /usr/share/nginx/html -d wvcdev.xyz -d www.wvcdev.xyz --non-interactive --agree-tos --email your-email@example.com && nginx -s reload"]