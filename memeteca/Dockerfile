# PRODUCTION BUILD 
# FROM node:14.13.0 as build-step

# RUN mkdir /app

# WORKDIR /app

# COPY ["package.json", "package-lock.json", "./"]

# RUN npm install --production

# COPY . .

# RUN npm run build:production
# RUN npm install -g serve

# EXPOSE 5000

# CMD ["serve","-s", "build"]

# Stage 2
#FROM nginx:1.19.10-alpine
#COPY --from=build-step /app/build /usr/share/nginx/html

#### DEV BUILD ##### 

FROM node:14.13.0

RUN mkdir /app

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm","start"]