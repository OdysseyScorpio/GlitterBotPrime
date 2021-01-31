FROM node:14

LABEL maintainer="Martyn Green <martyn.robert.green@gmail.com>"

COPY . .

WORKDIR /

RUN npm install

ENV DIR=/DIR
ENV CMD=!

CMD ["npm", "run" , "gbp"]