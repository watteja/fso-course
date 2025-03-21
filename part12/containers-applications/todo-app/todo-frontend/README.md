# React application

This application is created with [Vite](https://vitest.dev/).

Install dependencies with `npm install`

You can run the application in development mode with `npm run dev`

You can build static files for production release with `npm run build`

## Environment variables

Use env VITE_BACKEND_URL to set where the backend for this application is

## Containerization

If you want to run the app from a container, first you need to create an image from the Dockerfile:  
`docker build . -t todo-frontend`

To run the container itself, make sure to expose the correct port:  
`docker run -p 8000:80 todo-frontend:latest`

The (frontend) app will then be available at http://localhost:8000/
