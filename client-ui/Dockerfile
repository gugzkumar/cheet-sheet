FROM node:10.15.0-alpine
ENV HOME=/usr/src/app

# Create simple server that hosts compiled Angular Resources
WORKDIR $HOME
COPY ./package.json $HOME/
RUN npm install --quiet
RUN node simple-server.js &

#Set up angular code and dependencies
WORKDIR $HOME/angular-code
COPY ./angular-code/package.json $HOME/angular-code
RUN npm install --quiet
COPY . $HOME
EXPOSE 4200
WORKDIR $HOME/angular-code

# Main container process builds angular code to angular-output/ folder
CMD node ../simple-server.js & npm run build
