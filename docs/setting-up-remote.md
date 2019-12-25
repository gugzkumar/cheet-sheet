# Setting Up Cheet Sheet On A Remote Environment

## Overview

## STEP 1: Provision Infrastructure
1. Set up your `infrastructure.env`
1. Get your infrastructure environment running
  ```
  docker-compose -f docker-compose.deploy.infrastructure.yml down -v && docker-compose -f docker-compose.deploy.infrastructure.yml up --build -d
  ```
1. Get in to your infrastructure environment to begin running CDK commands
  ```
  docker container exec -it serverless-aws-cdk sh
  ```
1. List your available stacks
1. Build and confirm your stack to confirm you have 0 errors
  ```
  npm run build
  ```
1. Provision your Infrastructure by running the following command and saying yes to any prompts.
  ```
  cdk deploy CheetSheetInfrastructureStack-{ENVIRONMENT name}
  ```
1. Verify


## STEP 2: Deploy Code


## STEP 3: Setup Networking
