FROM node:20

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci

USER node

CMD npm start

# Build as 'todo-backend' to work with docker-compose
# docker build -t todo-backend .