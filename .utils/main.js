const program = require('commander');
const createEnv = require('./create-env');
const creatInfraEnv = require('./create-infra-env');
const generateBase64CognitoJWKS = require('./generate-base64-cognito-jwks');
const generateBase64env = require('./generate-base64-env');
const { prompt } = require('inquirer');
const chalk = require('chalk');
const request = require('request');

program
    .description('CH33T $H33T Utility Functions');

program
    .command('create-infra-env')
    .description('Create an infrastructure .env file for local development or remote deployment`')
    .action(creatInfraEnv);

program
    .command('create-env')
    .description(`Create a .env file for ${chalk.cyan('docker-compose.yaml')}, or ${chalk.cyan('docker-compose.deploy.code.yaml')}`)
    .action(createEnv);

program
    .command('generate-base64-env')
    .description('Convert your env file to Base64. This is helpful to integrate with Circle CI for continous deployment.')
    .action(generateBase64env);

program
    .command('generate-base64-COGNITO_JWKS')
    .description('Generate the Base64 encoded jwks for your Cognito client. This is required as a ENV variable for your local and remote environement variables.')
    .action(generateBase64CognitoJWKS);

// Output help if no command given
if (!process.argv.slice(2).length) {
    program.outputHelp();
}

// Output error if unknown command is given
program.on('command:*', function () {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
    process.exit(1);
});

program.parse(process.argv);
