# Phonebook

The _Phonebook_ application, originally created through exercises in parts 2 and 3 of [Fullstack Open course](https://fullstackopen.com/en/).

This code instance is used to illustrate automatic deployment pipeline, as required by the exercise [11.20](https://fullstackopen.com/en/part11/expanding_further#exercises-11-19-11-21).

The application lives at https://matts-phonebook.fly.dev/

## Running locally

### Running backend

- `cd backend/`

- install packages with `npm install` (requires Node.js v20)

- start the server locally with `npm start`

### Running frontend

- `cd frontend/`

- install packages with `npm install` (requires Node.js v20)

- start the app locally with `npm run dev`

## Deployment notes

- Make sure that your repository contains `FLY_API_TOKEN` and `DISCORD_WEBHOOK` Actions secrets.

- Make sure that your GitHub Actions workflow permissions are set to **Read and write permissions** (necessary for the tagging action to work properly).

- Data is hosted in a MongoDB database.

## The _other_ repo

The repository with the Pokedex app, which is used throughout most of Part 11 is located at:  
https://github.com/watteja/full-stack-open-pokedex
