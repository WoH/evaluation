FROM node:lts-alpine
ARG NODE_ENV=production

RUN apk add --no-cache git procps

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
COPY yarn.lock ./

RUN yarn install --production=false

# Bundle app source
COPY . .

RUN yarn run build
RUN yarn install

EXPOSE 3001
CMD [ "yarn", "start" ]
