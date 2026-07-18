# build stage

FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# ADD THESE ARG LINES SO VITE CAN SEE THEM DURING BUILD

ARG VITE_BASE_URL
ARG VITE_IMG_URL
ARG VITE_TMDB_URL
ARG VITE_TMDB_API_KEY

RUN npm run build

# production stage

FROM node:22-alpine

WORKDIR /app

RUN npm i -g serve

COPY --from=build /app/dist ./dist

EXPOSE 80

CMD [ "serve", "-s", "dist", "-l", "80" ]
