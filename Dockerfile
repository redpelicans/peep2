FROM node:latest

RUN apt-get update && apt-get install -y git vim-tiny

RUN npm cache clear

ENV HOME /root

RUN git clone https://github.com/redpelicans/peep2.git /peep
WORKDIR /peep
RUN git checkout develop
RUN yarn
RUN yarn build
RUN yarn srv:run

EXPOSE 80
CMD yarn srv:run
