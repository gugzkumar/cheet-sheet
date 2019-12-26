import cdk = require('@aws-cdk/core');
import s3 = require('@aws-cdk/aws-s3');
import cognito = require('@aws-cdk/aws-cognito');
import iam = require('@aws-cdk/aws-iam');

// Read environment variables
const SITE_SUB_DOMAIN = process.env['SITE_SUB_DOMAIN'] || '';
const SITE_DOMAIN = process.env['SITE_DOMAIN'] || '';
const ENVIRONMENT = process.env['ENVIRONMENT'] || '';
const AWS_CREATE_IAM_POLICIES = process.env['AWS_CREATE_IAM_POLICIES'] || 'true';

const toBoolean = (value: string | number | boolean): boolean =>
    [true, 'true', 'True', 'TRUE', '1', 1].includes(value);

/**
 * This AWS Cloud Formation stack deals with setting up infrastructure for CheetSheet.
 * This DOES NOT set up any networking or routing to host the infrastructure via
 * a Route53 or a DNS provider. That is done in the CheetSheetNetworkStack.
 *
 * This stack creates the following:
 *  - Authentication Resources
 *  - Client UI Dependant Resources
 *  - API Dependant Resources
 *  - App Data Storage Resources
 *
 * If ENVIRONMENT == 'local', only authentication and app data storage resources are created.
 */
export class CheetSheetInfrastructureStack extends cdk.Stack {

    siteHostname = `${SITE_SUB_DOMAIN}.${SITE_DOMAIN}`;
    siteDomainName = SITE_DOMAIN;
    shouldCreateIamPolicies = toBoolean(AWS_CREATE_IAM_POLICIES);

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Set up our app data storage resources
        const storageARNs = this.constructDataStorageResources();

        // Create our resources for our Authentication Management system
        this.constructCognitoResources();

        // Create these resources to host our API and UI only if on a remote environment
        if (ENVIRONMENT !== 'local') {
            this.constructApiRequiredResources(this.shouldCreateIamPolicies, storageARNs);
            this.constructClientUiResources();
        }

    }

    /**
     * Create all resources needed to host our API.
     * You can directly host from S3, or you can set up a Cloud Front CDN
     * if you expect more trafic.
     *
     * @param shouldCreateIamPolicies: boolean
     *    true - create the IAM policy for our API's lambda function
     *    false - skip creating the IAM policy for our API's lambda functions
     */
    constructApiRequiredResources(shouldCreateIamPolicies: boolean, storageARNs: Array<string>) {
        // Set up our private bucket that will be used to save and track deployment Artifacts for our API
        const apiDeploymentBucket = new s3.Bucket(this, 'S3APIDeploymentBucket', {
             removalPolicy: cdk.RemovalPolicy.DESTROY,
             accessControl: s3.BucketAccessControl.PRIVATE,
             bucketName: `${this.siteHostname}-api-deployment`
        });
        new cdk.CfnOutput(this, 'S3APIDeploymentBucketOutput', {
            exportName: `${this.stackName}-API-DEPLOYMENT-BUCKET`,
            value: apiDeploymentBucket.bucketName,
            description: 'The S3 Bucket that will facilitate SAM deployments of the api code'
        });

        // Create IAM Policies to necessary for our Lambda functions in our API
        if (shouldCreateIamPolicies) {
            const role = new iam.Role(this, 'LambdaExecutionRole', {
                assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')
            });

            role.addToPolicy(new iam.PolicyStatement({
                resources: storageARNs,
                actions: [
                    's3:GetObject',
                    's3:DeleteObject',
                    's3:PutObject',
                    's3:ListBucket',
                    'dynamodb:BatchGetItem',
                    'dynamodb:BatchWriteItem',
                    'dynamodb:DeleteItem',
                    'dynamodb:DescribeTable',
                    'dynamodb:GetItem',
                    'dynamodb:GetRecords',
                    'dynamodb:PutItem',
                    'dynamodb:Query',
                    'dynamodb:Scan',
                ]
            }));
            new cdk.CfnOutput(this, 'LambdaExecutionRoleOutput', {
                exportName: `${this.stackName}-LAMBDA-IAM-ROLE-ARN`,
                value: role.roleArn,
                description: 'The ARN of the IAM Role that the Lambda Functions of the api need so they can access the right resources'
            });
        }
    }

    /**
     * Create all resources needed to host our UI
     */
    constructClientUiResources() {
        // Set up our public bucket that hosts our frontend
        const clientUIAssetsBucket = new s3.Bucket(this, 'S3ClientUIAssetsBucket', {
             websiteIndexDocument: 'index.html',
             websiteErrorDocument: 'error.html',
             bucketName:this.siteHostname,
             publicReadAccess: true,
             removalPolicy: cdk.RemovalPolicy.DESTROY
        });

        new cdk.CfnOutput(this, 'S3ClientUIAssetsBucketOutput', {
            exportName: `${this.stackName}-CLIENT-UI-S3-BUCKET`,
            value: clientUIAssetsBucket.bucketName,
            description: 'The S3 bucket is the source of truth for the frontend.'
        });
    }

    /**
     * This method constructs all resources needed to setup our authentication
     * management in Cognito
     */
    constructCognitoResources() {
        // Restrictions placed on password
        const policies: cognito.CfnUserPool.PoliciesProperty = {
            passwordPolicy: {
                minimumLength: 8,
                requireNumbers: false,
                requireSymbols: false,
                requireUppercase: false,
                requireLowercase: false,
            }
        };

        // List of Valid client facing urls for cognito. If we are building this for a
        // local environment, the urls are on http://localhost:4200
        const host = ENVIRONMENT === 'local' ? 'http://localhost:4200' : `https://${this.siteHostname}`;
        const logoutUrLs = [
            `${host}`,
            `${host}/login`,
            `${host}/logout`,
            `${host}/login/callback`,
        ]
        const callbackUrLs = [
            `${host}`,
            `${host}/login`,
            `${host}/logout`,
            `${host}/login/callback`,
        ]

        // Construct the actual user pool, its groups and its clients
        const userPool = new cognito.CfnUserPool(this, 'CognitoAppUserPool',  {
            aliasAttributes: [cognito.UserPoolAttribute.EMAIL],
            autoVerifiedAttributes: [cognito.UserPoolAttribute.EMAIL],
            policies: policies,
            schema: [{
              name: cognito.UserPoolAttribute.EMAIL,
              attributeDataType: 'String',
              mutable: false,
              required: true
            }],
            userPoolName: this.siteHostname,
        });
        new cognito.CfnUserPoolGroup(this, "CognitoAdminsGroup", {
            groupName: 'admin',
            userPoolId: userPool.ref

        });
        const userPoolClient = new cognito.CfnUserPoolClient(this, 'CognitoAppUserPoolClient', {
            userPoolId: userPool.ref,
            explicitAuthFlows: [ cognito.AuthFlow.USER_PASSWORD ],
            logoutUrLs: logoutUrLs,
            callbackUrLs: callbackUrLs,
            allowedOAuthFlowsUserPoolClient: true,
            allowedOAuthFlows: [ 'implicit', 'code' ],
            allowedOAuthScopes: [ "email", "openid", "aws.cognito.signin.user.admin", "profile" ],
            refreshTokenValidity: 30,
            supportedIdentityProviders: [ 'COGNITO' ]
        });
        const userPoolDomain = new cognito.CfnUserPoolDomain(this, 'CognitoAppUserPoolDomain', {
            userPoolId: userPool.ref,
            domain: this.siteHostname.split('.').join('-')
        });

        // Cloud Formation Outputs
        new cdk.CfnOutput(this, 'CognitoAppUserPoolOutput', {
            exportName: `${this.stackName}-COGNITO-USER-POOL-ID`,
            value: userPool.ref,
            description: 'The S3 bucket that will save all the different Cheet Sheets users create in our app.'
        });
        new cdk.CfnOutput(this, 'CognitoAppUserPoolDomainOutput', {
            exportName: `${this.stackName}-COGNITO-AUTHENTICATION-DOMAIN`,
            value: userPoolDomain.ref,
            description: 'The domain of the cognito where authentication happens, and the login ui is hosted.'
        });

    }

    /**
     * This method constructs all resources needed for saving app data, like
     * S3 buckets and dynamo DB tables.
     *
     * @return: list of created resource ARNs
     */
    constructDataStorageResources() {
        // Set up our private bucket that will be used to save and track deployment Artifacts for our API
        const appDataBucket = new s3.Bucket(this, 'S3AppDataStorageBucket', {
             removalPolicy: cdk.RemovalPolicy.DESTROY,
             accessControl: s3.BucketAccessControl.PRIVATE,
             bucketName: `${this.siteHostname}-sheetdata`
        });
        new cdk.CfnOutput(this, 'S3AppDataStorageBucketOutput', {
            exportName: `${this.stackName}-SHEET-DATA-S3-BUCKET`,
            value: appDataBucket.bucketName,
            description: 'The S3 bucket that will save all the different Cheet Sheets users create in our app.'
        });
        return [
             appDataBucket.bucketArn
        ];
    }
}
