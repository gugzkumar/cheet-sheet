const dotenv = require('dotenv');
var AWS = require('aws-sdk');
// const cloudformation = new AWS.CloudFormation({apiVersion: '2010-05-15'});
AWS.config.region = 'us-east-1'

LOCAL_ENV_VARS = {
    AWS_DEFAULT_REGION:'',
    AWS_ACCESS_KEY_ID:'',
    AWS_SECRET_ACCESS_KEY:'',
    SAM_LOCAL_ABSOLUTE_PATH:'',
    SAM_CLI_TELEMETRY:'',
    LAMBDA_LAYER:'',
    APP_ADMIN_USER:'',
    PUBLIC_SHEETS_FOLDER:'',
    SHEET_DATA_S3_BUCKET:'',
    COGNITO_ID_JWK_BASE4:'',
    COGNITO_ACCESS_JWK_BASE4:''
}

const createLocalEnv = () => {

}

const createEnv = (environment) => {
    if(environment === 'local') {
        var params = {
        };
        dotenv.config({path: '../infrastructure.env'});
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

module.exports = {
    createEnv
};


// const readline = require('readline').createInterface({
//   input: process.stdin,
//   output: process.stdout
// })
//
// readline.question(`What's your name?`, (name) => {
//   console.log(`Hi ${name}!`)
//   readline.close()
// })
// console.log('HELLO');
// AWS_DEFAULT_REGION=
// AWS_ACCESS_KEY_ID=
// AWS_SECRET_ACCESS_KEY=
// SAM_LOCAL_ABSOLUTE_PATH=
// SAM_CLI_TELEMETRY=0
// PUBLIC_SHEETS_FOLDER=
// SHEET_DATA_S3_BUCKET=
// COGNITO_JWKS_BASE4=
