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
const CREATE_IAM_POLICIES = process.env['CREATE_IAM_POLICIES'] || 'true';

const toBoolean = (value: string | number | boolean): boolean =>
    [true, 'true', 'True', 'TRUE', '1', 1].includes(value);

export class CheetSheetInfrastructureStack extends cdk.Stack {

    siteHostname = `${SITE_SUB_DOMAIN}.${SITE_DOMAIN}`;
    siteDomainName = SITE_DOMAIN;
    uiDistributionType = UI_DISTRIBUTION_TYPE;
    shouldCreateIamPolicies = toBoolean(CREATE_IAM_POLICIES);

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create these resources to host our API and UI only if on a remote environment
        if (ENVIRONMENT !== 'local') {
            this.constructWebsiteResources(this.uiDistributionType);
            this.constructApiRequiredResources(this.shouldCreateIamPolicies);
        }

        // Create our resources for our Authentication Management system
        this.constructCognitoResources();

        // Set up our private bucket that will save our application data (Sheet data is saved here)
        this.constructApiRequiredResources(toBoolean(CREATE_IAM_POLICIES))

    }


    constructApiRequiredResources(shouldCreateIamPolicies: boolean) {
        // Set up our private bucket that will be used to save and track deployment Artifacts for our API
        const apiDeploymentBucket = new s3.Bucket(this, 'S3APIDeploymentBucket', {
             removalPolicy: cdk.RemovalPolicy.DESTROY,
             accessControl: s3.BucketAccessControl.PRIVATE
        });

        // Create IAM Policies to necessary for our Lambda functions in our API
        if (shouldCreateIamPolicies) {
            const role = new iam.Role(this, 'MyRole', {
                assumedBy: new iam.ServicePrincipal('sns.amazonaws.com')
            });

            role.addToPolicy(new iam.PolicyStatement({
                resources: ['*'],
                actions: ['lambda:InvokeFunction'] })
            );
        }
    }

    /**
     * This method constructs all methods needed to setup our authentication
     * management in Cognito
     */
    constructCognitoResources() {
        // Create our Cognito Userpool for tracking users
        const userPool = new cognito.UserPool(this, 'CognitoAppUserPool',  {
            signInType: cognito.SignInType.USERNAME,
            autoVerifiedAttributes: [cognito.UserPoolAttribute.EMAIL],
            userPoolName: this.siteHostname,
            usernameAliasAttributes: [ cognito.UserPoolAttribute.PREFERRED_USERNAME ]
        });
        new cognito.CfnUserPoolGroup(this, "CognitoAdminsGroup", {
            groupName: 'admin',
            userPoolId: userPool.userPoolId,

        });

        const logoutUrLs = [
            `https://${this.siteHostname}`,
            `https://${this.siteHostname}/login`,
            `https://${this.siteHostname}/logout`,
            `http://${this.siteHostname}`,
            `http://${this.siteHostname}/login`,
            `http://${this.siteHostname}/logout`
        ]
        const callbackUrLs = [
            `https://${this.siteHostname}`,
            `https://${this.siteHostname}/login`,
            `https://${this.siteHostname}/logout`,
            `http://${this.siteHostname}`,
            `http://${this.siteHostname}/login`,
            `http://${this.siteHostname}/logout`
        ]

        const userPoolClient = new cognito.CfnUserPoolClient(this, 'CognitoAppUserPoolClient', {
            userPoolId: userPool.userPoolId,
            explicitAuthFlows: [ cognito.AuthFlow.USER_PASSWORD ],
            logoutUrLs: logoutUrLs,
            callbackUrLs: callbackUrLs,
            allowedOAuthFlows: [ 'implicit', 'code'],
            allowedOAuthScopes: [ "email", "openid", "aws.cognito.signin.user.admin", "profile"],
            refreshTokenValidity: 30
        });

        const userPoolDomain = new cognito.CfnUserPoolDomain(this, 'CognitoAppUserPoolDomain', {
            userPoolId: userPool.userPoolId,
            domain: 'cheet-sheet-dev'
        });
    }

    /**
     * Create all resources needed to host our UI. There are two options.
     * You can directly host from S3, or you can set up a Cloud Front CDN
     * if you expect more trafic.
     *
     * @param targetResourceType - "buket" or "cloudfront"
     */
    constructWebsiteResources(targetResourceType = 'bucket') {
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
                            allowedMethods: cloudfront.CloudFrontAllowedMethods.ALL,
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

}
