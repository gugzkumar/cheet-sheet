# Setting Up And Running Cheet Sheet On Your Local Machine


## Create Your infrastructure.env File

1. From the .utils folder run `node main.js create-infra-env`
2. Follow the guided prompt to create `infrastructure.env`
3. Confirm you now have a file in your root folder called `infrastructure.env`

<details><summary>What just happened?</summary>
<p>
    To be written
</p>
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
<p>
    To be written
</p>
</details>

## Create Your .env File
1. From the .utils folder run `node main.js create-infra-env`
1. Follow the guided prompt to create `.env` from `infrastructure.env`
1. Confirm you now have a file in your root folder called `.env`

<details><summary>What just happened?</summary>
<p>
    To be written
</p>
</details>

## Running the App

1. Now you have everything you need to run the app
1. Run `docker-compose up --build -d`
1. Wait for a minute or two after the command finishes running
1. You can now see the site on http://localhost:4200 :beers:
1. Code changes you now make to the api and ui should happen real time to the app now
1. Run `docker-compose down -v` to take down the app

<details><summary>What just happened?</summary>
<p>
    To be written
</p>
</details>
