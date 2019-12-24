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
const SITE_SUB_DOMAIN = process.env['SITE_SUB_DOMAIN'] || '';
const SITE_DOMAIN = process.env['SITE_DOMAIN'] || '';
const AWS_ACM_CERTIFICATE_ARN = process.env['AWS_ACM_CERTIFICATE_ARN'] || '';
const ENVIRONMENT = process.env['ENVIRONMENT'] || '';
const AWS_CREATE_IAM_POLICIES = process.env['AWS_CREATE_IAM_POLICIES'] || 'true';
const region = process.env['AWS_DEFAULT_REGION'] || '';

export class CheetSheetNetworkStack extends cdk.Stack {

    siteHostname = `${SITE_SUB_DOMAIN}.${SITE_DOMAIN}`;
    siteDomainName = SITE_DOMAIN;
    uiDistributionType = UI_DISTRIBUTION_TYPE;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
    }

    constructClientUiNetwork(targetResourceType = 'bucket') {

      // let targetResource: route53.IAliasRecordTarget = new targets.BucketWebsiteTarget(clientUIAssetsBucket);
      // if (targetResourceType!=='bucket') {
      //     const clientUIWebDistribution = new cloudfront.CloudFrontWebDistribution(this, 'CloudFrontClientUIWebDistribution', {
      //         originConfigs: [
      //             {
      //                 s3OriginSource: {
      //                     s3BucketSource: clientUIAssetsBucket
      //                 },
      //                 behaviors: [
      //                   {
      //                     isDefaultBehavior: true,
      //                     allowedMethods: cloudfront.CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
      //                     defaultTtl: cdk.Duration.seconds(60)
      //                   },
      //                 ]
      //             }
      //         ],
      //         aliasConfiguration: {
      //             acmCertRef: AWS_ACM_CERTIFICATE_ARN,
      //             names: [ this.siteHostname ],
      //             sslMethod: cloudfront.SSLMethod.SNI,
      //             securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_1_2016
      //         }
      //     });
      //     targetResource = new targets.CloudFrontTarget(clientUIWebDistribution);
      // }
      //
      // const zone = route53.HostedZone.fromHostedZoneAttributes(this, 'Zone', {
      //     hostedZoneId: AWS_ROUTE53_HOSTED_ZONE_ID,
      //     zoneName: this.siteDomainName
      // });
      //
      // const clientUIDNSRecord = new route53.ARecord(this, 'SiteAliasRecord', {
      //     recordName: 'cheet-sheet-dev',
      //     target: route53.AddressRecordTarget.fromAlias(
      //         targetResource
      //     ),
      //     zone
      // });
    }

}
