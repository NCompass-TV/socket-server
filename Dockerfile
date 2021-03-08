#Latest version of node tested on.
FROM node:12-alpine

WORKDIR /app

ADD . /app

# Install dependencies
RUN npm install
RUN npm run build-prod
RUN npm run required-files
RUN npm run install-prod

RUN ls
RUN ls bundle

RUN npm run copy-prod

RUN ls

# Add the rest of the sources
#RUN copy /tempbuild/bundle/. /app

ADD . /app

RUN ls app

EXPOSE 3000

CMD ["npm","start"]