FROM node:20 AS test-stage
WORKDIR /usr/src/app
COPY . .
RUN npm ci
RUN npm run test

# This is a new stage, everything before this is gone, except for the files that we want to COPY
FROM node:20 AS build-stage
WORKDIR /usr/src/app
# Specifying that the files are copied from previous stage to avoid skipping it (due to Docker's internal optimization)
COPY --from=test-stage /usr/src/app .
RUN npm ci
# Should be overriden in docker-compose.yml
ENV VITE_BACKEND_URL=http://localhost:3000
RUN npm run build

# For production environment, serving static files happens in 'docker-compose.yml', not here

# FROM nginx:1.25-alpine AS production-stage
# # COPY the directory dist from the build-stage to /usr/share/nginx/html
# # The target location here was found from the Docker hub page
# COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html

# For alternative ways to copy files, see: https://docs.docker.com/guides/nodejs/run-tests/#run-tests-when-building

# Build as 'todo-front' to work with docker-compose
# docker build -t todo-front .