const { prompt } = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');

const environmentTypes = {
    LOCAL: 'To develop and test on my local machine',
    REMOTE: 'To build and deploy to the cloud (AWS)'
}

// Template for the infrastructure.env file generated
const generateEnvString = (params) => {
return `` +
`# What unique environment is this infrastructure, ex: local, prod, dev, staging
#   If this is set to local, the cdk will only create resources you need to
#   run this app locally, not host it to the public.
ENVIRONMENT=${params.ENVIRONMENT || ''}

# AWS Creds
AWS_DEFAULT_REGION=${params.AWS_DEFAULT_REGION  || ''}
AWS_ACCESS_KEY_ID=${params.AWS_ACCESS_KEY_ID  || ''}
AWS_SECRET_ACCESS_KEY=${params.AWS_SECRET_ACCESS_KEY  || ''}

AWS_ROUTE53_HOSTED_ZONE_ID=${params.AWS_ROUTE53_HOSTED_ZONE_ID  || ''}
SITE_SUB_DOMAIN=${params.SITE_SUB_DOMAIN  || ''}
SITE_DOMAIN=${params.SITE_DOMAIN  || ''}

AWS_ACM_CERTIFICATE_ARN=${params.AWS_ACM_CERTIFICATE_ARN  || ''}
`
}


/**
 * These are the question propmts for this CLI command
 */
const questions = [
    // What environment
    {
        type : 'list',
        name : 'environmentType',
        message : 'What are you building your infrastructure for (your use case)',
        choices : [environmentTypes.LOCAL, environmentTypes.REMOTE]
    },
    {
        type : 'input',
        name : 'ENVIRONMENT',
        message : 'What environment is this, ex: prod, staging, dev, ... (must be unique)',
        choices : [environmentTypes.LOCAL, environmentTypes.REMOTE],
        when : (currentAnswers) => currentAnswers.environmentType === environmentTypes.REMOTE
    },
    // AWS Credentials
    {
        type : 'input',
        name : 'AWS_DEFAULT_REGION',
        message : 'What is your AWS region ex: us-east-1, us-east-2, ...',
        validate : (answer) => {
            const validRegions =[
              'us-east-2', 'us-east-1', 'us-west-1', 'ap-east-1', 'ap-south-1', 'ap-northeast-3', 'ap-northeast-2',
              'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'ca-central-1', 'eu-central-1', 'eu-west-1',
              'eu-west-2', 'eu-west-3', 'eu-north-1', 'me-south-1', 'sa-east-1'
            ]
            if (validRegions.indexOf(answer) > -1 ) return true;
            return 'Please input a valid aws region';
        }
    },
    {
        type : 'input',
        name : 'AWS_ACCESS_KEY_ID',
        message : 'What is your AWS IAM Access Key Id'
    },
    {
        type : 'input',
        name : 'AWS_SECRET_ACCESS_KEY',
        message : 'What is your AWS IAM Secret Access Key'
    },
    // Route53 questions
    {
        type : 'input',
        name : 'SITE_DOMAIN',
        message : 'What is your domain',
        when: (currentAnswers) => {
            if (currentAnswers.environmentType == environmentTypes.LOCAL) {
                console.log(chalk.yellow(
                  `\nThe next few questions are related to Route53. You selected local development as your use case. Please still provide ` +
                  `a SITE_DOMAIN, and SITE_SUB_DOMAIN. While your app may not be hosted there, these will be used for naming conventions of ` +
                  `S3 and Cognito resources.\n`
                ));
            }
            return true;
        }
    },
    {
        type : 'input',
        name : 'SITE_SUB_DOMAIN',
        message : 'What is your subdomain'
    },
    {
        type : 'input',
        name : 'AWS_ROUTE53_HOSTED_ZONE_ID',
        message : 'What is the Route53 Hosted Zone Id of your domain',
        when: (currentAnswers) => {
            if (currentAnswers.environmentType == environmentTypes.LOCAL) {
                return false;
            } else {
                console.log(chalk.yellow(
                  `\tYour UI will be hosted on: ${ chalk.cyan.underline('https://' + currentAnswers.SITE_SUB_DOMAIN + '.' + currentAnswers.SITE_DOMAIN)} \n` +
                  `\tYour API will be hosted on: ${ chalk.cyan.underline('https://' + currentAnswers.SITE_SUB_DOMAIN + '.api.' + currentAnswers.SITE_DOMAIN)}`
                ));
                return true;
            }
        }
    },
    {
        type : 'input',
        name : 'AWS_ACM_CERTIFICATE_ARN',
        message : 'What is the ARN of your AWS ACM Certificate',
        when: (currentAnswers) => {
          if (currentAnswers.environmentType == environmentTypes.LOCAL) {
              return false;
          } else {
              console.log(chalk.yellow(
                  `\tYour ACM should be validated for atleast the following Domain Names: \n` +
                  `\t- ${ chalk.cyan.underline('https://' + currentAnswers.SITE_SUB_DOMAIN + '.' + currentAnswers.SITE_DOMAIN)}\n` +
                  `\t- ${ chalk.cyan.underline('https://' + currentAnswers.SITE_SUB_DOMAIN + '.api.' + currentAnswers.SITE_DOMAIN)}`
              ));
              return true;
          }
          return true;
        }
    },
    {
        type : 'input',
        name : 'filePath',
        message : 'What file do you want to save this as',
        default : 'infrastructure.env'
    },
]

// Export CLI Command
module.exports = () => {
    console.log(chalk.bold.green(
        `\nLet's create your infrastructure.env file. Please have the following ready:\n` +
        `\t- An AWS IAM Account \n` +
        `\t- An AWS Route53 Domain (Remote deployment only) \n` +
        `\t- An AWS ACM certificate the domains you will deploy to (Remote deployment only) \n`
    ));
    prompt(questions)
        .then((answers) => {
            if (answers.environmentType === environmentTypes.LOCAL) {
                answers.ENVIRONMENT = 'local';
            }
            const envFileContent = generateEnvString(answers);
            fs.writeFile(`../${answers.filePath}`, envFileContent, (err) => {
              if (err) throw err;
              console.log(chalk.green.bold(
                  `\n${answers.filePath} file successfully created at ../${answers.filePath}`
              ));
            });

        })
        .catch(() => {
            console.log(chalk.red.bold(
                'Something went wrong'
            ));
        });
}
