FROM node:13.3.0-alpine
ENV HOME=/usr/src/app
WORKDIR $HOME
COPY ./package.json $HOME/package.json
RUN npm install -g aws-cdk@1.19.0 --quiet
RUN npm install --quiet
COPY ./ $HOME
