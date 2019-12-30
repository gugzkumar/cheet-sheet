const { prompt } = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const util = require('util');
var request = require('request-promise-native');
var AWS = require('aws-sdk');

// Template for the infrastructure.env file generated
const generateRemoteEnvString = (params) => {
return `` +
`# What unique environment is this code will be deployed to.
#   This should match the environment of infrastructure it is going to
#   be deployed to.
ENVIRONMENT=${params.ENVIRONMENT || ''}
SITE_SUB_DOMAIN=${params.SITE_SUB_DOMAIN || ''}
SITE_DOMAIN=${params.SITE_DOMAIN || ''}

# The Base url for the Frontend and Backend
CLIENT_UI_URL=${params.CLIENT_UI_URL || ''}
API_URL=${params.API_URL || ''}

# AWS Credentials and regions
AWS_DEFAULT_REGION=${params.AWS_DEFAULT_REGION || ''}
AWS_ACCESS_KEY_ID=${params.AWS_ACCESS_KEY_ID || ''}
AWS_SECRET_ACCESS_KEY=${params.AWS_SECRET_ACCESS_KEY || ''}

# Cognito
COGNITO_CLIENT_ID=${params.COGNITO_CLIENT_ID || ''}
COGNITO_AUTH_URL=${params.COGNITO_AUTH_URL || ''}
COGNITO_JWKS_BASE64=${params.COGNITO_JWKS_BASE64 || ''}

# Where application data is saved
SHEET_DATA_S3_BUCKET=${params.SHEET_DATA_S3_BUCKET || ''}

# AWS IAM Role ARN for Lambda function. The minimum requirement is for:
# - Read and Write Access to the Sheet Data S3 Bucket
# - The ability to invoke itself
LAMBDA_IAM_ROLE=${params.LAMBDA_IAM_ROLE || ''}

# AWS Layer ARN, with necessary dependencies for the Python3.7 API
# - pyjwt==1.7.1
# - cryptography==2.8
LAMBDA_LAYER=${params.LAMBDA_LAYER || ''}

#   SHEET_DATA_S3_BUCKET: S3 bucket that stores all sheets
API_DEPLOYMENT_S3_BUCKET=${params.API_DEPLOYMENT_S3_BUCKET || ''}

# Comment this out if your okay with SAM sending data
SAM_CLI_TELEMETRY=0
`}

const generateLocalEnvString = (params) => {
return `` +
`# This env file does not deploy anything. It is only used for local
#   development and testing
ENVIRONMENT=${params.ENVIRONMENT || ''}

# The Base url for the Frontend and Backend
CLIENT_UI_URL=${params.CLIENT_UI_URL || ''}
API_URL=${params.API_URL || ''}

# AWS Credentials and regions
AWS_DEFAULT_REGION=${params.AWS_DEFAULT_REGION || ''}
AWS_ACCESS_KEY_ID=${params.AWS_ACCESS_KEY_ID || ''}
AWS_SECRET_ACCESS_KEY=${params.AWS_SECRET_ACCESS_KEY || ''}

# AWS Cognito configurations
COGNITO_CLIENT_ID=${params.COGNITO_CLIENT_ID || ''}
COGNITO_AUTH_URL=${params.COGNITO_AUTH_URL || ''}
COGNITO_JWKS_BASE64=${params.COGNITO_JWKS_BASE64 || ''}

# Folder path where application data is saved
SHEET_DATA_S3_BUCKET=${params.SHEET_DATA_S3_BUCKET || ''}

# AWS Layer ARN, with necessary dependencies for the Python3.7 API
# - pyjwt==1.7.1
# - cryptography==2.8
LAMBDA_LAYER=${params.LAMBDA_LAYER || ''}

# Tell SAM Local the Path of the API, so it can properly mount volumes
SAM_LOCAL_ABSOLUTE_PATH=${params.SAM_LOCAL_ABSOLUTE_PATH || ''}

# Comment this out if your okay with SAM sending data
SAM_CLI_TELEMETRY=0
`
}



const createEnv = (environment) => {
    if(environment === 'local') {
        var params = {
        };
        dotenv.config({path: '../infrastructure.env'});
        AWS.config.region = 'us-east-1'
        AWS.config.credentials = new AWS.Credentials(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);
        const cloudformation = new AWS.CloudFormation({
            apiVersion: '2010-05-15'
        });
        cloudformation.listExports(params, function(err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else     console.log(data);           // successful response
        });
    }
}

/**
 * These are the question propmts for this CLI command
 */
const questions = [
    {
        type : 'input',
        name : 'filePath',
        message : 'What is the name environment file for your infrastructure',
        default: 'infrastructure.env'
    }, {
        type : 'input',
        name : 'LAMBDA_LAYER',
        message : 'What is the ARN of your AWS Lambda Layer'
    }

];


// const describeStacksPromise = util.promisify(cloudformation.describeStacks);

// - Get Stack outputs


const writeFilePromise = util.promisify(fs.writeFile);

// Export CLI Command
module.exports = () => {
    let infraEnvVars = null;
    let infrastructureStackOutputs = null;
    const getStackExport = (key) => infrastructureStackOutputs.find(output => output.OutputKey === key).OutputValue;

    console.log(chalk.bold.green(
        `\nLets create an environment file for code development or deployment. Please have done the following:\n` +
        `\t- Generated an infrastructure environment file with ${chalk.cyan('node main.js create-infra-env')} \n` +
        `\t- Provisioned AWS infrastructure with ${chalk.cyan('docker-compose.deploy.infrastructure.yml')} \n` +
        `\t- An AWS Lambda Layer ARN for python 3.7 with pyjwt==1.7.1 and cryptography==2.8 \n`
    ));
    prompt(questions)
        .then((answers) => {
            const importEnvResult = dotenv.config({path: `../${answers.filePath}`});
            if (importEnvResult.error) {
                return Promise.reject({
                    message: `Something went wrong reading ../${answers.filePath}.`,
                    err: importEnvResult.error
                });
            }
            infraEnvVars = importEnvResult.parsed;

            // Load variables known from imported .env file
            answers.ENVIRONMENT = infraEnvVars.ENVIRONMENT;
            answers.AWS_DEFAULT_REGION = infraEnvVars.AWS_DEFAULT_REGION;
            answers.AWS_ACCESS_KEY_ID = infraEnvVars.AWS_ACCESS_KEY_ID;
            answers.AWS_SECRET_ACCESS_KEY = infraEnvVars.AWS_SECRET_ACCESS_KEY;
            answers.SITE_DOMAIN = infraEnvVars.SITE_DOMAIN;
            answers.SITE_SUB_DOMAIN = infraEnvVars.SITE_SUB_DOMAIN;

            if (answers.ENVIRONMENT === 'local') {
                answers.CLIENT_UI_URL=`http://localhost:4200`,
                answers.API_URL=`http://localhost:3000`;
                const projectDirectoryPath = path.dirname(process.cwd());
                answers.SAM_LOCAL_ABSOLUTE_PATH = projectDirectoryPath + '/api';
            } else {
                answers.CLIENT_UI_URL=`https://${answers.SITE_SUB_DOMAIN}.${answers.SITE_DOMAIN}`;
                answers.API_URL=`https://${answers.SITE_SUB_DOMAIN}.api.${answers.SITE_DOMAIN}`;
            }

            // Set up AWS cloudformation client
            const infrastructureStackName = `CheetSheetInfrastructureStack-${answers.ENVIRONMENT}`;
            AWS.config.region = answers.AWS_DEFAULT_REGION;
            AWS.config.credentials = new AWS.Credentials(answers.AWS_ACCESS_KEY_ID, answers.AWS_SECRET_ACCESS_KEY);
            const cloudformation = new AWS.CloudFormation({ apiVersion: '2010-05-15' });




            // Read exports from CloudFormation
            return cloudformation.describeStacks({ StackName: infrastructureStackName }).promise()
                .then((data) => {
                    if (!data.Stacks || data.Stacks.length < 0) {
                        throw `${infrastructureStackName} is not found in cloudformation. Please make sure you've deployed your infrastructure first`;
                    }
                    infrastructureStackOutputs = data.Stacks[0].Outputs;
                    const cognitoUserPoolDomain = getStackExport('CognitoAppUserPoolDomainOutput');
                    answers.SHEET_DATA_S3_BUCKET = getStackExport('S3AppDataStorageBucketOutput');
                    answers.COGNITO_CLIENT_ID = getStackExport('CognitoAppUserPoolClientOutput');
                    answers.COGNITO_AUTH_URL = `https://${cognitoUserPoolDomain}.auth.${answers.AWS_DEFAULT_REGION}.amazoncognito.com`

                    if (answers.ENVIRONMENT != 'local') {
                        answers.LAMBDA_IAM_ROLE = getStackExport('LambdaExecutionRoleOutput');
                        answers.API_DEPLOYMENT_S3_BUCKET = getStackExport('S3APIDeploymentBucketOutput');
                    }

                    return answers;
                })
                .catch((err) => Promise.reject({
                    message: `Something went wrong generating environment variables from ${infrastructureStackName}.`,
                    err: err
                }));

        }).then((answers) => {
            const cognitoUserPoolId = getStackExport('CognitoAppUserPoolOutput');
            const jwks_uri = `https://cognito-idp.${answers.AWS_DEFAULT_REGION}.amazonaws.com/${cognitoUserPoolId}/.well-known/jwks.json`;
            return request(jwks_uri)
                .then((jwks_string) => {
                    let buff = Buffer.from(jwks_string);
                    let base64jwks = buff.toString('base64');
                    answers.COGNITO_JWKS_BASE64 = base64jwks;
                    return answers;
                })
                .catch((err) => Promise.reject({
                    message: `Something went wrong retreiving jwks from ${jwks_uri}`,
                    err: err
                }));
        }).then((answers) => {
            return prompt(
                {
                    type : 'input',
                    name : 'outputFilePath',
                    message : 'What do file name do you want to save this as',
                    default:  answers.ENVIRONMENT === 'local' ? '.env' : `${answers.ENVIRONMENT}.env`,
                    when: () => {
                        if (answers.ENVIRONMENT === 'local'){
                            console.log(chalk.yellow(
                              `\nYour infrastructure file has been identified as a local environment. The env file that will be generated can ` +
                              `be used to test and run the app locally on your computer.\n`
                            ));
                        } else {
                            console.log(chalk.yellow(
                                `\nYour infrastructure file has been identified as a remote environment. The env file that will be generated can` +
                                `be used to deploy the app to the following urls either via ${chalk.cyan('docker-compose.deploy.code.yml')} or via ` +
                                `CI/CD through CircleCI. \n` +
                                `\t- ${ chalk.cyan.underline('https://' + answers.SITE_SUB_DOMAIN + '.' + answers.SITE_DOMAIN)}\n` +
                                `\t- ${ chalk.cyan.underline('https://' + answers.SITE_SUB_DOMAIN + '.api.' + answers.SITE_DOMAIN)}\n`
                            ));
                        }
                        return true;
                    }
                }
            ).then((answers2) => {
                answers.outputFilePath = answers2.outputFilePath;
                return answers;
            });
        })
        .then((answers) => {
            let envFileContent = null;

            if (answers.ENVIRONMENT === 'local')
                envFileContent = generateLocalEnvString(answers);
            else
                envFileContent = generateRemoteEnvString(answers);

            return writeFilePromise(`../${answers.outputFilePath}`, envFileContent)
                .then()
                .catch();
        })
        .catch((error) => {
            console.error(chalk.red.bold(error.message));
            console.error(chalk.underline('Full error'));
            console.error(error);
        });
}
