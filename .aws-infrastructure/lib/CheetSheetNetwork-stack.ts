import cdk = require('@aws-cdk/core');
import s3 = require('@aws-cdk/aws-s3');
import cloudfront = require('@aws-cdk/aws-cloudfront');
import route53 = require('@aws-cdk/aws-route53');
import targets = require('@aws-cdk/aws-route53-targets/lib');
import apigateway = require('@aws-cdk/aws-apigateway');
import certificatemanager = require('@aws-cdk/aws-certificatemanager');

// Read environment variables
const UI_DISTRIBUTION_TYPE = process.env['UI_DISTRIBUTION_TYPE'] || '';;
const AWS_ROUTE53_HOSTED_ZONE_ID = process.env['AWS_ROUTE53_HOSTED_ZONE_ID'] || '';
const SITE_SUB_DOMAIN = process.env['SITE_SUB_DOMAIN'] || '';
const SITE_DOMAIN = process.env['SITE_DOMAIN'] || '';
const AWS_ACM_CERTIFICATE_ARN = process.env['AWS_ACM_CERTIFICATE_ARN'] || '';
const ENVIRONMENT = process.env['ENVIRONMENT'] || '';

export class CheetSheetNetworkStack extends cdk.Stack {

    siteHostname = `${SITE_SUB_DOMAIN}.${SITE_DOMAIN}`;
    siteDomainName = SITE_DOMAIN;
    uiDistributionType = UI_DISTRIBUTION_TYPE;
    zone:route53.IHostedZone;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        this.zone = route53.HostedZone.fromHostedZoneAttributes(this, 'Zone', {
            hostedZoneId: AWS_ROUTE53_HOSTED_ZONE_ID,
            zoneName: this.siteDomainName
        });
        this.constructClientUiNetwork();
        this.constructApiNetwork();
    }


    constructApiNetwork() {
        const apiDomainName = `${SITE_SUB_DOMAIN}.api.${SITE_DOMAIN}`;
        const apiRecordName = `${SITE_SUB_DOMAIN}.api`;
        const acmCert = certificatemanager.Certificate.fromCertificateArn(this, 'SSLCertificate', AWS_ACM_CERTIFICATE_ARN);

        const apiIdReference = cdk.Fn.importValue(`CheetSheetCodeStack-${ENVIRONMENT}-API-GATEWAY-API-ID`);

        const apiDomain = new apigateway.DomainName(this, 'ApiGatewayDomain', {
            domainName: apiDomainName,
            certificate: acmCert
        });
        const apiDomainMapping = new apigateway.CfnBasePathMapping(this, 'ApiGatewayDomainMapping',
            {
                domainName: apiDomain.domainName,
                restApiId: apiIdReference,
                stage: 'Prod'
            }
        )
        const targetResource = new targets.ApiGatewayDomain(apiDomain);

        const ApiDNSRecord = new route53.ARecord(this, 'ApiSiteAliasRecord', {
            recordName: apiRecordName,
            target: route53.AddressRecordTarget.fromAlias(
                targetResource
            ),
            zone: this.zone
        });

    }

    constructClientUiNetwork() {
        const clientUIAssetsBucketName = this.siteHostname;
        const clientUIRecordName = `${SITE_SUB_DOMAIN}`;
        const clientUIAssetsBucket = s3.Bucket.fromBucketName(this, 'S3ClientUIAssetsBucket' , clientUIAssetsBucketName);

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
        const targetResource = new targets.CloudFrontTarget(clientUIWebDistribution);

        const clientUIDNSRecord = new route53.ARecord(this, 'ClientUiSiteAliasRecord', {
            recordName: clientUIRecordName,
            target: route53.AddressRecordTarget.fromAlias(
                targetResource
            ),
            zone: this.zone
        });
    }

}
