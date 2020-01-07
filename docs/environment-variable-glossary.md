# Environment Variable Glossary

Throughout the app we use `.env` files to power the configuration of the deployment of our app. There are three different types of these.
- [infrastructure.template.env](.env_templates/infrastructure.template.env) - This is used to deploy infrastructure and Networking of the App to AWS
- [remote.template.env](.env_templates/remote.template.env) - This is used to deploy the code of the App to AWS
- [local.template.env](.env_templates/local.template.env) - This is used to run the app locally on your machine. It is very similar to `remote.template.env`.

This README tries to break down what each of these variables are.


| Environment Variable              | Description                                                               |
| --------------------------------- | ------------------------------------------------------------------------- |
| ENVIRONMENT                       | This describes what unique environment is this app for. For example, prod, staging, dev, etc. This should be alphabetical and have no spaces. If set to "local", this will configure the app specifically for running on your machine and not for deploying it to AWS. |
| AWS_DEFAULT_REGION                | This is AWS region you want to deploy the app to. Ex: us-east-1, us-west-2, etc. |
| AWS_ACCESS_KEY_ID                 | This is for the IAM Credentials with which we gain access to AWS with. You need this for local development too, because some resources like S3 will sill run in the cloud. |
| AWS_SECRET_ACCESS_KEY             | This is another IAM Credential (pairs with AWS_ACCESS_KEY_ID) with which we gain access to AWS with. You need this for local development too, because some resources like S3 will sill run in the cloud. |
| SITE_SUB_DOMAIN                   | This is the subdomain to which your app will be deployed to. For example, if you wish to have the app on https://cheet-sheet.mydomain.com this variable is set to `cheet-sheet`. For local environments this is not used for networking, but still used for naming conventions of S3 resources. |
| SITE_DOMAIN                       | This is the subdomain to which your app will be deployed to. For example, if you wish to have the app on https://cheet-sheet.mydomain.com this variable is set to `mydomain.com`. You must own this domain on Route53 if you are deploying the app to the internet. For local environments this is not used for networking, but still used for naming conventions of S3 resources. |
| AWS_ACM_CERTIFICATE_ARN           | Not need for `ENVIRONMENT=local`. This is the AWS ACM ARN for the SSL certificate of the website, so we can use https. The certificate must valid for both these domains: `{SITE_SUB_DOMAIN}`.`{SITE_DOMAIN}`, `{SITE_SUB_DOMAIN}`.api.`{SITE_DOMAIN}` |
| AWS_ROUTE53_HOSTED_ZONE_ID        | This is the Zone Id for `SITE_DOMAIN` |
| CLIENT_UI_URL                     | https://`{SITE_SUB_DOMAIN}`.`{SITE_DOMAIN}` if `ENVIRONMENT!=local`, `http://localhost:4200` if `ENVIRONMENT=local`|
| API_URL                           | https://`{SITE_SUB_DOMAIN}`.api.`{SITE_DOMAIN}` if `ENVIRONMENT!=local`, `http://localhost:3000` if `ENVIRONMENT=local`|
| COGNITO_CLIENT_ID                 | This is the Id of the Cognito User Pool Client. We provision a different user pool for every different Environment. You can find this on your Infrastructure stack's Outputs after it is deployed. |
| COGNITO_AUTH_URL                  | This is the Cognito Domain, that handles our authentication and hosts the login page. You can find this on your Infrastructure stack's Outputs after it is deployed.|
| COGNITO_JWKS_BASE64               | In order to verify web tokens on the backend for login users we need a public key. AWS hosts these keys as a Json Web Key Set on https://cognito-idp.{region}.amazonaws.com/{userPoolId}/.well-known/jwks.json. You can find the User Pool Id on your Infrastructure stack's Outputs after it is deployed. |
| SHEET_DATA_S3_BUCKET              | This is the S3 bucket name where the different sheets and index cards are saved. You can find this on your Infrastructure stack Outputs after it is deployed. |
| LAMBDA_IAM_ROLE                   | This is the IAM role that gives the Lambda function behind our api, the necessary permissions to communicate with other AWS resources. You can find this on your Infrastructure stack's Outputs after it is deployed. |
| LAMBDA_LAYER                      | AWS ARN for the Layer. AWS Lambda Layers are for you to provide dependencies for the Lambda function behind our api. Lambda comes with several libraries out of the box, but we still need 2 more. They are pyjwt==1.7.1 and cryptography==2.8. You will need to make one yourself if you don't have one. You can look at https://github.com/gugzkumar/my-python-lambda-layers for guidance.  |
| API_DEPLOYMENT_S3_BUCKET          | This is the S3 bucket name that SAM leverages to deploy the backend code of our app. You can find this on your Infrastructure stack's Outputs after it is deployed. |
| SAM_LOCAL_ABSOLUTE_PATH           | Absolute path of the `api` folder on your machine. In order for local development to work, SAM needs to know where it is located. |
| SAM_CLI_TELEMETRY                 | Set this to 0 if you don't want to send AWS logistics about your use of SAM. Set to 1 if you're okay with it. This can help AWS make improvements to SAM. |
