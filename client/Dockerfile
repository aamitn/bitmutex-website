# Use Node.js 20 as the base image
FROM node:20-bookworm

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy all project files
COPY . .

# Build the Next.js app
# RUN yarn build

# Expose Next.js default port
EXPOSE 3000

# Start Next.js server
# CMD ["yarn", "start"]
