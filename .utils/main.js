const program = require('commander');
const { createEnv } = require('./create-env');
const { prompt } = require('inquirer');
const request = require('request');

program
    .description('Cheet Sheet Utility Functions');

program
    .command('create-env <environment>')
    .description('Add a contact')
    .action( (environment) => {
        createEnv(environment);
    });

program
    .command('generate COGNITO_JWKS_BASE64')
    .description('Add a contact')
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
