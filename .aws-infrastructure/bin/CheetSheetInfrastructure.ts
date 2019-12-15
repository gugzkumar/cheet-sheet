#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { CheetSheetInfrastructureStack } from '../lib/CheetSheetInfrastructure-stack';
const ENVIRONMENT = process.env['ENVIRONMENT'] || '';

if (ENVIRONMENT === '') {
  throw new Error('ENVIRONMENT env variable cannot be blank');
}

const app = new cdk.App();
new CheetSheetInfrastructureStack(
    app,
    `CheetSheetInfrastructureStack-${ENVIRONMENT}`,
    {
        env: {
            'region': process.env['AWS_DEFAULT_REGION']
        }
    }
);
