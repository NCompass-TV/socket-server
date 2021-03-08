#Latest version of node tested on.
FROM node:12-alpine

# WORKDIR /app

# Only run npm install if these files change.
ADD ./package.json /app/package.json
ADD ./tsconfig.json /app/tsconfig.json

# Install dependencies
RUN npm install
RUN npm run build-prod
RUN npm run required-files
RUN npm run install-prod

# Add the rest of the sources
ADD ./bundle/. /app

EXPOSE 3000

CMD ["npm","start"]