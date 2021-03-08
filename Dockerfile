#Latest version of node tested on.
FROM node:12-alpine

WORKDIR /app

# Only run npm install if these files change.
# ADD ./package.json /app/package.json

# Install dependencies
RUN npm install
RUN npm build-prod
ADD ./bundle/. /app
COPY ./package.json /app
COPY ./package-lock.json /app
COPY ./.env /app
RUN npm install --production

# Add the rest of the sources
# ADD . /app

EXPOSE 3000

CMD ["npm","start"]