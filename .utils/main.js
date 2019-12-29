const program = require('commander');
const { createEnv } = require('./create-env');
const creatInfraEnv = require('./create-infra-env');
const { prompt } = require('inquirer');
const request = require('request');

program
    .description('CH33T $H33T Utility Functions');

program
    .command('create-infra-env')
    .description('Create and infrastructure env for local development or remote deployment`\n  ')
    .action(creatInfraEnv);

program
    .command('create-env <environment>')
    .description('Create and .env file for `docker-compose.yaml`, or `docker-compose.deploy.code.yaml`\n  ')
    .action( (environment) => {
        createEnv(environment);
    });

program
    .command('generate COGNITO_JWKS_BASE64')
    .description('Generate the BASE64 encoded jwks for your Cognito client. This is required as a ENV variable for your local and remote environement variables.')
    .action( (environment) => {

        prompt([
            {
              type : 'input',
              name : 'cognitoUserPoolId',
              message : 'Where is your Cognito User Pool ID'
            },
            {
              type : 'input',
              name : 'awsRegion',
              message : 'What is your AWS region'
            }
        ]).then(answers => {
            const { cognitoUserPoolId, awsRegion } = answers
            request(`https://cognito-idp.${awsRegion}.amazonaws.com/${cognitoUserPoolId}/.well-known/jwks.json`, { json: false }, (err, res, body) => {

              if (err) { return console.log(err); }
              console.log('Retreived the following Json Web Key Set (JWKS) from AWS');
              console.log(body);
              let buff = Buffer.from(body);
              console.log();
              console.log('Here is the JWKS converted to Base64. Set this as the value of COGNITO_JWKS_BASE64 in local.env or remote.env.');
              let base64body = buff.toString('base64');
              console.log(base64body);
            });
        });

    });


program.parse(process.argv);
