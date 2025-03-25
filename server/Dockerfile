# Use Node.js 20 as the base image
FROM node:20-bookworm

# Set working directory inside the container
WORKDIR app

# Copy package.json and install dependencies
COPY package.json yarn.lock .
RUN yarn install --frozen-lockfile

# Copy the entire Strapi project
COPY . .

# Expose Strapi's default port
EXPOSE 1337

# Start Strapi in production mode
# CMD [yarn, develop]