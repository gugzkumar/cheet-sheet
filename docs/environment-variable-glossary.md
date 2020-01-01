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
| AWS_ACCESS_KEY_ID                 | This is for the IAM Credentials with which we gain the authentication provision infrastructure and deploy the app to AWS with. You need this for local development too, because some resources like S3 will sill run in the cloud. |
| AWS_SECRET_ACCESS_KEY             | This is another IAM Credential (pairs with AWS_ACCESS_KEY_ID) with which we gain the authentication provision infrastructure and deploy the app to AWS with. You need this for local development too, because some resources like S3 will sill run in the cloud. |
| SITE_SUB_DOMAIN                   | This is the subdomain to which your app will be deployed to. For example, if you wish to have the app on https://cheet-sheet.mydomain.com this variable is set to cheet-sheet`. For local environments this is not used for networking. Only for Naming conventions for S3 resources. |
| SITE_DOMAIN                       | This is the subdomain to which your app will be deployed to. For example, if you wish to have the app on https://cheet-sheet.mydomain.com this variable is set to `mydomain.com`. You must own this domain on Route53 if you are deploying the app to the internet. For local environments this is not used for networking. Only for Naming conventions for S3 resources. |
| AWS_ACM_CERTIFICATE_ARN           | Not need for `ENVIRONMENT=local`. This is the AWS ACM ARN for the SSL certificate of the website, so we can use https. The certificate must valid for both these domains: `{SITE_SUB_DOMAIN}`.`{SITE_DOMAIN}`, `{SITE_SUB_DOMAIN}`.api.`{SITE_DOMAIN}` |
| AWS_ROUTE53_HOSTED_ZONE_ID        | This is the Zone Id for `SITE_DOMAIN` |
| CLIENT_UI_URL                     | https://`{SITE_SUB_DOMAIN}`.`{SITE_DOMAIN}` if `ENVIRONMENT!=local`, `http://localhost:4200` if `ENVIRONMENT=local`|
| API_URL                           | https://`{SITE_SUB_DOMAIN}`.api.`{SITE_DOMAIN}` if `ENVIRONMENT!=local`, `http://localhost:3000` if `ENVIRONMENT=local`|
| COGNITO_CLIENT_ID                 | |
| COGNITO_AUTH_URL                  | |
| COGNITO_JWKS_BASE64               | |
| SHEET_DATA_S3_BUCKET              | |
| LAMBDA_IAM_ROLE                   | |
| LAMBDA_LAYER                      | |
| API_DEPLOYMENT_S3_BUCKET          | |
| SAM_LOCAL_ABSOLUTE_PATH           | |
| SAM_CLI_TELEMETRY                 | |
