# Setting Up And Launching The App On AWS

This guide is for you to have a working version of Cheet Sheet deployed to the internet for you or your team to access from anywhere. All commands, unless otherwise noted, should be ran from the root of the project folder.

## STEP 1: Create Your infrastructure.env File

**Warning: if you've already made infrastructure.env before, it will be overridden. So save it if you don't want to lose it.**

1. From the .utils folder run `node main.js create-infra-env`
2. Follow the guided prompt to create `infrastructure.env`
3. Confirm you now have a file in your root folder called `infrastructure.env`

<details><summary>What just happened?</summary>

> The first thing we need to do is provision infrastructure for the app. This includes things like S3 Buckets, Cognito Userpools and lambda roles. We do this through docker compose. The file called infrastructure.env, is what properly configures how to build the infrastructure. You could build the `infrastructure.env` file manually by following the [infrastructure.template.env](/.env_templates/infrastructure.template.env). The utility cli provides guided prompts to make it a bit easier. *If you want to learn more about what each configuration is, read the ENVIRONMENT variable glossary.*

</details>

## STEP 2: Build AWS Infrastructure

**Note: ENVIRONMENT is what is defined in infrastructure.env**

1. Run `docker-compose -f docker-compose.deploy.infrastructure.yml up --build -d`
1. Run `docker container exec -it serverless-aws-cdk sh`
1. Run `npm run build` and confirm there are 0 errors
1. Run `cdk bootstrap` (If you've done this before you don't have to do it again)
1. Run `cdk diff CheetSheetInfrastructureStack-{ENVIRONMENT}` to preview what will be deployed
1. Run `cdk deploy CheetSheetInfrastructureStack-{ENVIRONMENT}` to begin deployment and say yes to any prompts
1. Once it ran confirm in AWS Cloudformation you have a new stack called `CheetSheetInfrastructureStack-{ENVIRONMENT}` with the status `CREATE_COMPLETE`
1. Type in exit to leave the infrastructure deploy environment
1. Run `docker-compose -f docker-compose.deploy.infrastructure.yml down -v` to take down the infrastructure deploy environment

<details><summary>What just happened?</summary>

> Infrastructure is provisioned via the AWS CDK. This is an open-source Infrastructure as Code toolkit for AWS that streamlines creating and applying changes to infrastructure. We first use docker compose to create a docker container with the CDK installed and infrastructure templates defined. Next we exec in to the container (this is similar to ssh'ing into a vm) to run CDK cli commands inside it that build and deploy our AWS Cloudformation Infrastructure Stack. We user docker for 2 reasons:
> 1. It makes the number of things you have to install less
> 2. We can version control dependencies to reduce possibility of breaking changes

</details>

## STEP 3: Create Your remote.env File

**Warning: if you've already made remote.env before, it will be overridden. So save it if you don't want to lose it.**

1. From the .utils folder run `node main.js create-infra-env`
1. Follow the guided prompt to create `remote.env` from `infrastructure.env`
1. Confirm you now have a file in your root folder called `remote.env`

<details><summary>What just happened?</summary>

> Now that we have infrastructure that can house our app we need to build and deploy the source code. The file called remote.env, is what properly configures how to and where to deploy things. You could build the `remote.env` file manually by following the [remote.template.env](/.env_templates/remote.template.env). The utility cli provides guided prompts to make it a bit easier. *If you want to learn more about what each configuration is, read the ENVIRONMENT variable glossary.*

</details>

## STEP 4: Build and Deploy The Code

**Note: SITE_DOMAIN and SITE_SUB_DOMAIN are what is defined in infrastructure.env**

1. Run `docker-compose -f docker-compose.deploy.code.yml run --rm serverless-lambda-api sh deploy.sh`
1. The command above deploys your code for the API
1. Once it ran confirm in AWS Cloudformation you have a new stack called `CheetSheetCodeStack-{ENVIRONMENT}` with the status `CREATE_COMPLETE`
1. Run `docker-compose -f docker-compose.deploy.code.yml run --rm serverless-angular-client-ui sh -c "node build-env.js && npm run build-prod"`
1. You should now see a folder called `client-ui/angular-output`. In here is every thing you need for your front end to work.
1. In S3 find the bucket named `{SITE_SUB_DOMAIN}.{SITE_DOMAIN}`. Upload all those files here with Public Read access. Everything else can be left as default.

<details><summary>What just happened?</summary>

> The first thing that happens is the deploy of the API. We run a docker container built with the AWS SAM cli, a configuration template for the REST API, and source code of the Lambda Function. This will produce a separate Cloudformation stack for Code.
>
> The second thing that happens is the deploy of the UI source code. We run a docker container built with the Angular that outputs static files for the frontend. Then copy and paste it into our UI bucket which will be the source of truth for our frontend.
>
> Again docker is meant to reduce the number of things you have to install. It also makes easy to plug in to CircleCI for Continuous Deployment.

</details>

## STEP 5: Build and Connect the Networking :beers:

**Note: ENVIRONMENT is what is defined in infrastructure.env**

1. Run `docker-compose -f docker-compose.deploy.infrastructure.yml up --build -d`
1. Run `docker container exec -it serverless-aws-cdk sh`
1. Run `npm run build`
1. Run `cdk diff CheetSheetNetworkStack-{ENVIRONMENT}` to preview what will be deployed
1. Run `cdk deploy CheetSheetNetworkStack-{ENVIRONMENT}` to begin deployment and say yes to any prompts
1. Cloud Front takes a long time to provision, it can take anywhere from 30min-1hour to complete. So go grab a coffee while that's happening.
1. Once it ran confirm in AWS Cloudformation you have a new stack called `CheetSheetNetworkStack-{ENVIRONMENT}` with the status `CREATE_COMPLETE`
1. Your app should be up and running on the following URLs :beers:
    - UI:  https://`{SITE_SUB_DOMAIN}`.`{SITE_DOMAIN}`
    - API: https://`{SITE_SUB_DOMAIN}`.api.`{SITE_DOMAIN}`
1. Type in exit to leave the infrastructure deploy environment
1. Run `docker-compose -f docker-compose.deploy.infrastructure.yml down -v` to take down the infrastructure deploy environment

<details><summary>What just happened?</summary>

> The final step is setup the networking so that our API and UI are publicly available on the internet. Similar to how we deployed the Infrastructure we use the AWS CDK to connect everything through Route53. This step will take a very long time because we are setting up a CDN for our S3 bucket via Cloudfront. But one you're done, your app will be up and running. Because it's serverless it should scale automatically whether you have user or a 1000 users.

</details>


## What's Next
It will be a pain in the butt if you have to manually **Build and Deploy The Code** every time you want to make a change to the api or ui. I suggest you set up Continuous Deployment of the code via CircleCI.
