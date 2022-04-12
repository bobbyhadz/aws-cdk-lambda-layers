import * as lambda from 'aws-cdk-lib/aws-lambda';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import * as cdk from 'aws-cdk-lib';
import * as path from 'path';

export class CdkStarterStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 👇 layer we've written
    const calcLayer = new lambda.LayerVersion(this, 'calc-layer', {
      compatibleRuntimes: [
        lambda.Runtime.NODEJS_12_X,
        lambda.Runtime.NODEJS_14_X,
      ],
      code: lambda.Code.fromAsset('src/layers/calc'),
      description: 'multiplies a number by 2',
    });

    // 👇 3rd party library layer
    const yupLayer = new lambda.LayerVersion(this, 'yup-layer', {
      compatibleRuntimes: [
        lambda.Runtime.NODEJS_12_X,
        lambda.Runtime.NODEJS_14_X,
      ],
      code: lambda.Code.fromAsset('src/layers/yup-utils'),
      description: 'Uses a 3rd party library called yup',
    });

    // 👇 Lambda function
    new NodejsFunction(this, 'my-function', {
      memorySize: 1024,
      timeout: cdk.Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'main',
      entry: path.join(__dirname, `/../src/my-lambda/index.ts`),
      bundling: {
        minify: false,
        // 👇 don't bundle `yup` layer
        // layers are already available in the lambda env
        externalModules: ['aws-sdk', 'yup'],
      },
      layers: [calcLayer, yupLayer],
    });
  }
}
