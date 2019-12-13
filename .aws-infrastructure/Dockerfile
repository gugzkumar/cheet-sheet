FROM node:13.3.0-alpine
ENV HOME=/usr/src/app
WORKDIR $HOME
COPY ./ $HOME
RUN npm install -g aws-cdk@1.18.0 --quiet
RUN npm install --quiet
