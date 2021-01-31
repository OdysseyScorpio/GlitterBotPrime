FROM node:14

LABEL maintainer="Martyn Green <martyn.robert.green@gmail.com>"

WORKDIR /app/

COPY . /app/

RUN npm install

ENTRYPOINT ["node" , "GlitterWorldPrime.js"]
