#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import {Stack} from "../lib/stack";

const app = new cdk.App();
new Stack(app, 'PostgresPrismaStack', {
  stackName: 'postgres-prisma-stack',
  env: {
    region: process.env.CDK_DEFAULT_REGION,
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
});
