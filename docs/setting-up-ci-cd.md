# Setting Up Continuous Deployment Via CircleCI

Continuous Deployment automates the updating of new code in our Api and UI so that we can focus on building features rather than how t launch them. CircleCI is easy to use, has a free tier, and takes away the hassle of have to set up infrastructure for it.

# STEP 1: Connect CircleCI to your repo

1. Login to CircleCI using your github account
1. Under add projects set up this repo

# STEP 2: Create the ENVIRONMENT variable out of your remote.env

1. In [Setting Up And Launching The App On AWS](/docs/setting-up-remote.md) you create an `remote.env` file for code deploys
1. From the .utils folder run `node main.js create-infra-env` generate-base64-env. This will encode all contents of the `.env` file as base64 and spit it out.
1. The way we do continuous deployment is by mapping a branch in your repo to environment variable that has the contents of `remote.env` (base 64 encoded). Outbox the following deployment strategies are provided. If you want change the branch name, environment variable name, or add a new strategy follow **STEP 3**.
    |   Branch      | CircleCI Environment Variable |
    |   ------      | ----------------------------- |
    |   master      | PROD_ENV_FILE                 |
    |   develop     | DEV_ENV_FILE                  |
    |   staging     | STAGING_ENV_FILE              |  
    |   demo        | DEMO_ENV_FILE                 |
1. Copy the output of the cli command, and set it as the desired Environment Variable.


# STEP 3: Update .circleci/config.yml if needed (Optional)

If you want to add more environments than supported out of the the box, modify the `load-env` command:

```yaml
load-env:
  steps:
    - run: # Extract environment variable as remote.env file
        name: "Load remote.env file from ENVIRONMENT variables"
        command: |
          if [ "${CIRCLE_BRANCH}" = "master" ]; then
              echo $PROD_ENV_FILE | base64 -d > remote.env

          elif [ "${CIRCLE_BRANCH}" = "develop" ]; then
              echo $DEV_ENV_FILE | base64 -d > remote.env

          elif [ "${CIRCLE_BRANCH}" = "staging" ]; then
              echo $STAGING_ENV_FILE | base64 -d > remote.env

          elif [ "${CIRCLE_BRANCH}" = "demo" ]; then
              echo $DEMO_ENV_FILE | base64 -d > remote.env

          else
              exit 1
          fi
```

#
