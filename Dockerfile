#Latest version of node tested on.
FROM node:12-alpine

WORKDIR /tempbuild

ADD ./package.json /tempbuild/package.json

# Only run npm install if these files change.
# ADD ./package.json /app/package.json

# Install dependencies
RUN npm install
RUN npm run build-prod
RUN npm run required-files
RUN npm run install-prod

WORKDIR /app

# Add the rest of the sources
ADD ./tempbuild/bundle/. /app

EXPOSE 3000

CMD ["npm","start"]