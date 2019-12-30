const program = require('commander');
const createEnv = require('./create-env');
const creatInfraEnv = require('./create-infra-env');
const generateCognitoJWKSBase64 = require('./generate-cognito-jwks-base64');
const { prompt } = require('inquirer');
const request = require('request');

program
    .description('CH33T $H33T Utility Functions');

program
    .command('create-infra-env')
    .description('Create and infrastructure env for local development or remote deployment`\n  ')
    .action(creatInfraEnv);

program
    .command('create-env')
    .description('Create and .env file for `docker-compose.yaml`, or `docker-compose.deploy.code.yaml`\n  ')
    .action(createEnv);

program
    .command('generate-COGNITO_JWKS_BASE64')
    .description('Generate the BASE64 encoded jwks for your Cognito client. This is required as a ENV variable for your local and remote environement variables.')
    .action(generateCognitoJWKSBase64);


program.parse(process.argv);
