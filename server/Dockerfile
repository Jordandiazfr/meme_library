FROM node:14.13.0

RUN apt-get update
RUN apt-get -y install vim
RUN npm install -g typescript

# Create Directory for the Container
WORKDIR /usr/src/app

# Only copy the package.json file to work directory
COPY package.json .
RUN npm install 

ADD . /usr/src/app
RUN npm run build

EXPOSE 4000 27017

CMD [ "npm", "run", "dev"]