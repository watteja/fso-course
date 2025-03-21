FROM node:20

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm install

ENV DEBUG=todo-backend:*

USER node

CMD ["npm", "run", "dev", "--", "--host"]

# Build as 'todo-backend-dev' to work with (development) docker-compose
# docker build -t todo-backend-dev -f ./dev.Dockerfile .
# docker run -it --rm -p 3000:3000 -v $(pwd):/usr/src/app todo-backend-dev