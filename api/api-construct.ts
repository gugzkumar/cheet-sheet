import cdk = require('@aws-cdk/cdk');
import apigateway = require('@aws-cdk/aws-apigateway');
import lambda = require('@aws-cdk/aws-lambda');
// import s3 = require('@aws-cdk/aws-s3');
import fs = require('fs');
import path = require('path');

const isFile = (fileName: any) => {
    return fs.lstatSync(fileName).isFile();
}

export class ApiConstruct extends cdk.Construct {
    public pythonDependencies: cdk.Construct;

    constructor(parent: cdk.Construct, name: string) {
        super(parent, name);
        const api = new apigateway.RestApi(this, 'Api Gateway', {
            restApiName: 'Boilerplate Web App Api',
            description: 'This is API comes from a boilerplate web app'
        });

        // const slackBotDepenciesLayer =
        this.pythonDependencies = new lambda.LayerVersion(this, 'Slackbot Dependencies', {
          compatibleRuntimes: [lambda.Runtime.Python37],
          code: lambda.Code.directory('./slackbot/myDependencies')
        });

        this.generateApiConstructs('api/endpoints/', api.root);
    }


    private generateApiConstructs(folderPath: any, apiResource: apigateway.IRestApiResource) {
        // If folderPath path is not a file recursively call generateApiConstructs on all files in folderPath
        if(!isFile(folderPath)) {
            const apiChildResource = apiResource.addResource(path.basename(folderPath));
            fs.readdirSync(folderPath).map((fileName) => {
                this.generateApiConstructs(path.join(folderPath, fileName), apiChildResource);
            });
            return;
        };
        // If file is not a api config file exit method
        if(!folderPath.endsWith('.api-config.json')) {
            return;
        }
        // If file is a api config file create lambda function and api methods
        const configs =  require('../' + folderPath);
        const basename = path.basename(folderPath, '.api-config.json');
        const dirname = path.dirname(folderPath);
        const params = {
            runtime: lambda.Runtime.Python37,
            code: lambda.Code.directory(dirname),
            //   layers: [slackBotLayer],
            handler: `${basename}.main`
        }
        const lambdaFunction = new lambda.Function(this, folderPath.replace(/\//g, '_'), params);
        const apiLambdaIntegration = new apigateway.LambdaIntegration(lambdaFunction);
        configs['methods'].map((method: string) => {
            apiResource.addMethod(method, apiLambdaIntegration);
        });
        return;
    }
}
