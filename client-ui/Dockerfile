FROM node:10.15.0-alpine
ENV HOME=/usr/src/app

# Create simple server that hosts compiled Angular Resources
WORKDIR $HOME
COPY ./package.json $HOME/
RUN npm install --quiet

#Set up angular code and dependencies
COPY . $HOME

# Main container process builds angular code to angular-output/ folder
CMD npm start
