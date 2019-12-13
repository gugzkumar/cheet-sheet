#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { SrcStack } from '../lib/src-stack';

const app = new cdk.App();
new SrcStack(app, 'SrcStack');
