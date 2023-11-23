FROM node:20

WORKDIR /usr/src/app

COPY package.json ./

COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 8081

ENV NODE_ENV production

RUN [ "yarn", "build" ]

ENTRYPOINT [ "yarn", "start" ]
