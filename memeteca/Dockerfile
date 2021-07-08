# DEV BUILD FRONTEND
FROM node:14.13.0 as build-step

RUN mkdir /app

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install react-scripts
RUN npm install 
COPY . .
RUN npm run build:production
RUN npm install -g serve react-scripts

EXPOSE 5000 3000
ENV REACT_APP_ENV=development REACT_APP_API_DEV=http://=172.19.0.2:4000
#CMD ["serve","-s", "build"]
CMD ["npm", "start"]



# Stage 2
#FROM nginx:1.19.10-alpine
#COPY --from=build-step /app/build /usr/share/nginx/html

#### DEV BUILD ##### 

# FROM node:14.13.0

# RUN mkdir /app

# WORKDIR /app

# COPY ["package.json", "package-lock.json", "./"]

# RUN npm install react

# COPY . .

# EXPOSE 3000

# RUN npm install 

# CMD ["npm", "start"]