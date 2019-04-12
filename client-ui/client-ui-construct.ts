import cdk = require('@aws-cdk/cdk');
import s3 = require('@aws-cdk/aws-s3');
import s3Deploy = require('@aws-cdk/aws-s3-deployment');
import {CloudFrontWebDistribution} from '@aws-cdk/aws-cloudfront';

export class ClientUIConstruct extends cdk.Construct {
    constructor(parent: cdk.Construct, name: string) {
        super(parent, name);
        const clientUIAssetsBucket = new s3.Bucket(this, 'Client UI Assets Bucket', {
              websiteIndexDocument: 'index.html',
              websiteErrorDocument: 'error.html',
              removalPolicy: cdk.RemovalPolicy.Destroy
        });
        clientUIAssetsBucket.grantPublicAccess('*', 's3:GetObject');

        new s3Deploy.BucketDeployment(this, 'Client UI Deployment', {
              source: s3Deploy.Source.asset('client-ui/assets'),
              destinationBucket: clientUIAssetsBucket
        });

        new CloudFrontWebDistribution(this, 'Client UI CDN Distribution', {
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: clientUIAssetsBucket
                    },
                    behaviors : [ {isDefaultBehavior: true}],

                }
            ]
        });

    }
}
