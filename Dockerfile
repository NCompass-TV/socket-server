#Latest version of node tested on.
FROM node:12-alpine as build

WORKDIR /app

ADD . /app

# Install dependencies
RUN npm install
RUN npm run build-prod
RUN npm run required-files
RUN npm run install-prod


#Latest version of node tested on.
FROM node:12-alpine

WORKDIR /app

COPY --from=build /app/bundle .

RUN ls

EXPOSE 3000
CMD ["npm","start"]