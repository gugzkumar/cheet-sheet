# Setting Up And Running The App On Your Local Machine

This guide is for you to have a working version of Cheet Sheet deployed to your machine. This is useful for testing the app before you use it, and develop new features. All commands, unless otherwise noted, should be ran from the root of the project folder.

## Create Your infrastructure.env File

**Warning: if you've already made infrastructure.env before, it will be overridden. So save it if you don't want to lose it**

1. From the .utils folder run `node main.js create-infra-env`
2. Follow the guided prompt to create `infrastructure.env`
3. Confirm you now have a file in your root folder called `infrastructure.env`

<details><summary>What just happened?</summary>

> The first thing we need to do is provision infrastructure for the app. This includes things like S3 Buckets, Cognito Userpools. We do this through docker compose. The file called infrastructure.env, is what properly configures how to build the infrastructure. You could also build the `infrastructure.env` file manually by following the [infrastructure.template.env](/.env_templates/infrastructure.template.env).  It's just that the utility cli provides guided prompts to make it a bit easier. *If you want to learn more about what each configuration is, read the ENVIRONMENT variable glossary.*

</details>

## Build AWS Infrastructure

1. Run `docker-compose -f docker-compose.deploy.infrastructure.yml up --build -d`
1. Run `docker container exec -it serverless-aws-cdk sh`
1. Run `npm run build`
1. Run `cdk bootstrap` (If you've done this before you don't have to do it again)
1. Run `cdk diff CheetSheetInfrastructureStack-local` to preview what will be deployed
1. Run `cdk deploy CheetSheetInfrastructureStack-local` to begin deployment and say yes to any prompts
1. Once it ran confirm in AWS Cloudformation you have a new stack called `CheetSheetInfrastructureStack-local` with the status `CREATE_COMPLETE`
1. Type in exit to leave the infrastructure deploy environment
1. Run `docker-compose -f docker-compose.deploy.infrastructure.yml down -v` to take down the infrastructure deploy environment

<details><summary>What just happened?</summary>

> Infrastructure is provisioned via the AWS CDK. This is an open-source Infrastructure as Code toolkit for AWS that streamlines creating and applying changes to infrastructure. We first use docker compose to create a docker container with the CDK installed and infrastructure templates defined. Next we exec in to the container (this is similar to ssh'ing into a vm) to run CDK cli commands inside it that build and deploy our AWS Cloudformation Infrastructure Stack. We user docker for 2 reasons:
> 1. It makes the number of things you have to install less
> 2. We can version control dependencies to reduce possibility of breaking changes
>
> **Note:** Because this is only mean to run locally on our machine do only things we need are Cognito and an S3 bucket for app data, unlike in **Setting Up And Launching The App On AWS**, where we need more.

</details>

## Create Your .env File
1. From the .utils folder run `node main.js create-infra-env`
1. Follow the guided prompt to create `.env` from `infrastructure.env`
1. Confirm you now have a file in your root folder called `.env`

<details><summary>What just happened?</summary>

> Now that we have a Cognito Userpool and an S3 bucket created from the previous step, can run our app locally. The file called `.env`, is what properly configures things to run on your machine. You could also build the `.env` file manually by following [local.template.env](/.env_templates/local.env). It's just that the utility cli provides guided prompts to make it a bit easier. *If you want to learn more about what each configuration is, read the ENVIRONMENT variable glossary.*

</details>

## Running the App

1. Now you have everything you need to run the app
1. Run `docker-compose up --build -d`
1. Wait for a minute or two after the command finishes running
1. You can now see the site on http://localhost:4200 :beers:
1. Code changes you now make to the api and ui should happen real time to the app now
1. Run `docker-compose down -v` to take down the app

<details><summary>What just happened?</summary>

> We now have everything we need to run the app locally. By using docker compose, we set up two running containers, one for the UI, and the other for the API. You can now use the app just as if you were to us it on the internet. The API uses SAM Local and mounted volumes so if you make changes to the API code it will be reflected in real time. The UI uses Angular, Webpack and mounted volumes, so if you make changes to the UI code it will be reflected in real time on the browser.

</details>
