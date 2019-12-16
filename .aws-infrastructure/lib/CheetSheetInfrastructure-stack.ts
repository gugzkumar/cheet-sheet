import cdk = require('@aws-cdk/core');
import s3 = require('@aws-cdk/aws-s3');
import cloudfront = require('@aws-cdk/aws-cloudfront');
import route53 = require('@aws-cdk/aws-route53');
import targets = require('@aws-cdk/aws-route53-targets/lib');
import cognito = require('@aws-cdk/aws-cognito');
import iam = require('@aws-cdk/aws-iam');


// Read environment variables
const UI_DISTRIBUTION_TYPE = process.env['UI_DISTRIBUTION_TYPE'] || '';;
const AWS_ROUTE53_HOSTED_ZONE_ID = process.env['AWS_ROUTE53_HOSTED_ZONE_ID'] || '';
const SITE_SUB_DOMAIN = process.env['SITE_DOMAIN'] || '';
const SITE_DOMAIN = process.env['SITE_SUB_DOMAIN'] || '';
const AWS_ACM_CERTIFICATE_ARN = process.env['AWS_ACM_CERTIFICATE_ARN'] || '';
const ENVIRONMENT = process.env['ENVIRONMENT'] || '';
const AWS_CREATE_IAM_POLICIES = process.env['AWS_CREATE_IAM_POLICIES'] || 'true';

const toBoolean = (value: string | number | boolean): boolean =>
    [true, 'true', 'True', 'TRUE', '1', 1].includes(value);

export class CheetSheetInfrastructureStack extends cdk.Stack {

    siteHostname = `${SITE_SUB_DOMAIN}.${SITE_DOMAIN}`;
    siteDomainName = SITE_DOMAIN;
    uiDistributionType = UI_DISTRIBUTION_TYPE;
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
            this.constructClientUiResources(this.uiDistributionType);
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
             bucketName: `${this.siteDomainName}-api-deployment`
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
        }
    }

    /**
     * Create all resources needed to host our UI. There are two options.
     * You can directly host from S3, or you can set up a Cloud Front CDN
     * if you expect more trafic.
     *
     * @param targetResourceType - "buket" or "cloudfront"
     */
    constructClientUiResources(targetResourceType = 'bucket') {
        if (targetResourceType !== 'bucket' && targetResourceType !== 'cloudfront')
          throw new Error('Your UI distribution type must be "bucket" or "cloudfront"');

        // Set up our public bucket that hosts our frontend
        const clientUIAssetsBucket = new s3.Bucket(this, 'S3ClientUIAssetsBucket', {
             websiteIndexDocument: 'index.html',
             websiteErrorDocument: 'error.html',
             bucketName:this.siteHostname,
             publicReadAccess: true,
             removalPolicy: cdk.RemovalPolicy.DESTROY
        });

        let targetResource: route53.IAliasRecordTarget = new targets.BucketWebsiteTarget(clientUIAssetsBucket);
        if (targetResourceType!=='bucket') {
            const clientUIWebDistribution = new cloudfront.CloudFrontWebDistribution(this, 'CloudFrontClientUIWebDistribution', {
                originConfigs: [
                    {
                        s3OriginSource: {
                            s3BucketSource: clientUIAssetsBucket
                        },
                        behaviors: [
                          {
                            isDefaultBehavior: true,
                            allowedMethods: cloudfront.CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
                            defaultTtl: cdk.Duration.seconds(60)
                          },
                        ]
                    }
                ],
                aliasConfiguration: {
                    acmCertRef: AWS_ACM_CERTIFICATE_ARN,
                    names: [ this.siteHostname ],
                    sslMethod: cloudfront.SSLMethod.SNI,
                    securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_1_2016
                }
            });
            targetResource = new targets.CloudFrontTarget(clientUIWebDistribution);
        }

        const zone = route53.HostedZone.fromHostedZoneAttributes(this, 'Zone', {
            hostedZoneId: AWS_ROUTE53_HOSTED_ZONE_ID,
            zoneName: this.siteDomainName
        });

        const clientUIDNSRecord = new route53.ARecord(this, 'SiteAliasRecord', {
            recordName: 'cheet-sheet-dev',
            target: route53.AddressRecordTarget.fromAlias(
                targetResource
            ),
            zone
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

        // List of Valid client facing urls for cognito
        const logoutUrLs = [
            `https://${this.siteHostname}`,
            `https://${this.siteHostname}/login`,
            `https://${this.siteHostname}/logout`,
            `https://${this.siteHostname}/login/callback`,
            `http://${this.siteHostname}`,
            `http://${this.siteHostname}/login`,
            `http://${this.siteHostname}/logout`,
            `http://${this.siteHostname}/login/callback`,
        ]
        const callbackUrLs = [
            `https://${this.siteHostname}`,
            `https://${this.siteHostname}/login`,
            `https://${this.siteHostname}/logout`,
            `https://${this.siteHostname}/login/callback`,
            `http://${this.siteHostname}`,
            `http://${this.siteHostname}/login`,
            `http://${this.siteHostname}/logout`,
            `http://${this.siteHostname}/login/callback`,
        ]

        // Construct the actual user pool, its groups and its clients
        const userPool = new cognito.CfnUserPool(this, 'CognitoAppUserPool',  {
            aliasAttributes: [cognito.UserPoolAttribute.EMAIL],
            autoVerifiedAttributes: [cognito.UserPoolAttribute.EMAIL],
            policies: policies,
            userPoolName: this.siteHostname,
        });
        new cognito.CfnUserPoolGroup(this, "CognitoAdminsGroup", {
            groupName: 'admin',
            userPoolId: userPool.ref

        });
        const userPoolClient = new cognito.CfnUserPoolClient(this, 'CognitoAppUserPoolClient', {
            userPoolId: userPool.attrArn,
            explicitAuthFlows: [ cognito.AuthFlow.USER_PASSWORD ],
            logoutUrLs: logoutUrLs,
            callbackUrLs: callbackUrLs,
            allowedOAuthFlows: [ 'implicit', 'code'],
            allowedOAuthScopes: [ "email", "openid", "aws.cognito.signin.user.admin", "profile"],
            refreshTokenValidity: 30,
            supportedIdentityProviders: [ userPool.attrProviderName ]
        });
        const userPoolDomain = new cognito.CfnUserPoolDomain(this, 'CognitoAppUserPoolDomain', {
            userPoolId: userPool.ref,
            domain: 'cheet-sheet-dev'
        });
    }

    /**
     * This method constructs all resources needed for saving app data, like
     * S3 buckets and dynamo DB tables.
     *
     * @return: list of resource ARNs
     */
    constructDataStorageResources() {
        // Set up our private bucket that will be used to save and track deployment Artifacts for our API
        const appDataBucket = new s3.Bucket(this, 'S3AppDataStorageBucket', {
             removalPolicy: cdk.RemovalPolicy.DESTROY,
             accessControl: s3.BucketAccessControl.PRIVATE,
             bucketName: `${this.siteDomainName}-sheetdata`
        });
        return [
             appDataBucket.bucketArn
        ];
    }
}
