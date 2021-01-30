FROM node:14

LABEL maintainer="Martyn Green <martyn.robert.green@gmail.com>"

RUN npm install

WORKDIR /app/

CMD ["node" , "GlitterWorldPrime.js"]
