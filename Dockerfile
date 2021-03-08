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

# Add the rest of the sources
ADD /app/bundle/. /app

EXPOSE 3000

CMD ["npm","start"]