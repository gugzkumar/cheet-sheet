const { prompt } = require('inquirer');
var request = require('request');
const chalk = require('chalk');
const fs = require('fs');

/**
 * These are the question propmts for this CLI command
 */
const questions = [
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
];

// Export CLI Command
module.exports = () => {
    prompt(questions)
        .then(answers => {
        const { cognitoUserPoolId, awsRegion } = answers
        request(`https://cognito-idp.${awsRegion}.amazonaws.com/${cognitoUserPoolId}/.well-known/jwks.json`, { json: false }, (err, res, body) => {

          if (err) { return console.log(err); }
          console.log('Retreived the following Json Web Key Set (JWKS) from AWS');
          console.log(body);
          let buff = Buffer.from(body);
          console.log();
          console.log('Here is the JWKS converted to Base64. Set this as the value of COGNITO_JWKS_BASE64 in local.env or remote.env.\n');
          let base64body = buff.toString('base64');
          console.log(base64body);
        });
    }).catch(err => console.error('something went wrong:', err));
}
