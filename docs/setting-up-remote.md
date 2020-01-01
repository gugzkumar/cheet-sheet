# Setting Up And Launching Cheet Sheet on AWS


## Create Your infrastructure.env File

**Warning: if you've already made infrastructure.env before, it will be overridden. So save it if you don't want to lose it.**

1. From the .utils folder run `node main.js create-infra-env`
2. Follow the guided prompt to create `infrastructure.env`
3. Confirm you now have a file in your root folder called `infrastructure.env`

<details><summary>What just happened?</summary>
<p>
    To be written
</p>
</details>

## Build AWS Infrastructure

**Note: ENVIRONMENT is what is defined in infrastructure.env**

1. Run `docker-compose -f docker-compose.deploy.infrastructure.yml up --build -d`
1. Run `docker container exec -it serverless-aws-cdk sh`
1. Run `npm run build`
1. Run `cdk bootstrap` (If you've done this before you don't have to do it again)
1. Run `cdk diff CheetSheetInfrastructureStack-{ENVIRONMENT}` to preview what will be deployed
1. Run `cdk deploy CheetSheetInfrastructureStack-{ENVIRONMENT}` to begin deployment and say yes to any prompts
1. Once it ran confirm in AWS Cloudformation you have a new stack called `CheetSheetInfrastructureStack-{ENVIRONMENT}` with the status `CREATE_COMPLETE`
1. Type in exit to leave the infrastructure deploy environment
1. Run `docker-compose -f docker-compose.deploy.infrastructure.yml down -v` to take down the infrastructure deploy environment

<details><summary>What just happened?</summary>
<p>
    To be written
</p>
</details>

## Create Your remote.env File

**Warning: if you've already made remote.env before, it will be overridden. So save it if you don't want to lose it.**

1. From the .utils folder run `node main.js create-infra-env`
1. Follow the guided prompt to create `remote.env` from `infrastructure.env`
1. Confirm you now have a file in your root folder called `remote.env`

<details><summary>What just happened?</summary>
<p>
    To be written
</p>
</details>

## Build and Deploy The Code

1. Run `docker-compose -f docker-compose.deploy.code.yml run --rm serverless-lambda-api sh deploy.sh`
1. The command above deploys your code for the API
1.
1.

<details><summary>What just happened?</summary>
<p>
    To be written
</p>
</details>

## Build and Connect the Networking

**Note: ENVIRONMENT is what is defined in infrastructure.env**

1. Run `docker-compose -f docker-compose.deploy.infrastructure.yml up --build -d`
1. Run `docker container exec -it serverless-aws-cdk sh`
1. Run `npm run build`
1. Run `cdk diff CheetSheetNetworkStack-{ENVIRONMENT}` to preview what will be deployed
1. Run `cdk deploy CheetSheetNetworkStack-{ENVIRONMENT}` to begin deployment and say yes to any prompts
1. Cloud Front takes a long time to provision, it can take anywhere from 30min-1hour to complete. So go grab a coffee while that's happening.
1. Once it ran confirm in AWS Cloudformation you have a new stack called `CheetSheetNetworkStack-{ENVIRONMENT}` with the status `CREATE_COMPLETE`
1. Your app should be up and running on the following URLs:
    - https://cheet-sheet.mydomain.com
    - https://cheet-sheet.api.mydomain.com
1. Type in exit to leave the infrastructure deploy environment
1. Run `docker-compose -f docker-compose.deploy.infrastructure.yml down -v` to take down the infrastructure deploy environment

<details><summary>What just happened?</summary>
<p>
    To be written
</p>
</details>
