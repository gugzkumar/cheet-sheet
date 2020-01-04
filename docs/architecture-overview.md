# Architecture Diagrams and Overview

## Architecture Diagram
<p align="left">
  <img
    alt="Remote Environment"
    src="/docs/images/architecture/Remote-Environment.png"
    width="100%"
  />
</p>
<br/>
When the user visits our web page, the frontend loads from an S3 bucket that saves all of our published Angular Code. Once on the website, REST requests get send to Api Gate way which asks a Lambda function to handle it. Lambda then queries our Sheet Data S3 bucket to read and change our application's state (this is where all our sheets and index cards are saved). We are able to support package dependencies through a Lambda Layer.
<br/><br/>
Our api uses a monolithic function, this means all requests are handled by the same function.
<br/><br/>
Authentication is handled by Cognito. When the user is a verified, a secure JWT token is received and saved in the browser. Then when making authenticated requests to the api, lambda makes sure that the token is properly signed and encrypted. This is what prevents a user from accessing and editing Workspaces they don't belong to.
<br/><br/>
The Api Deployment does not play an active role in the Infrastructure. But, it is something that is needed when we want to make updates to our API logic.

### Deployment Process
<p align="left">
  <img
    alt="Deployment Process"
    src="/docs/images/architecture/Deployment-Process.png"
    width="100%"
  />
</p>

### Infrastructure Stack
<p align="left">
  <img
    alt="Infrastructure Stack"
    src="/docs/images/architecture/Infrastructure-Stack.png"
    width="100%"
  />
</p>

### Code Stack
<p align="left">
  <img
    alt="Code Stack"
    src="/docs/images/architecture/Code-Stack.png"
    width="100%"
  />
</p>

### Network Stack
<p align="left">
  <img
    alt="Network Stack"
    src="/docs/images/architecture/Network-Stack.png"
    width="100%"
  />
</p>


## Local Development
<p align="left">
  <img
    alt="Local Environment"
    src="/docs/images/architecture/Local-Environment.png"
    width="100%"
  />
</p>
