import * as lambda from 'aws-cdk-lib/aws-lambda';
import {Code, LayerVersion} from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import * as path from 'path';
import {Database} from "./database";
import {Network} from "./network";
import {Functions} from "./functions";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";

export class CdkStarterStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // 👇 layer we've written
        const calcLayer = new LayerVersion(this, 'calc-layer', {

            code: lambda.Code.fromAsset('src/layers/calc'),
            description: 'multiplies a number by 2',
        });

        // 👇 3rd party library layer
        const yupLayer = new LayerVersion(this, 'yup-layer', {

            code: lambda.Code.fromAsset('src/layers/yup-utils'),
            description: 'Uses a 3rd party library called yup',
        });

        // 👇 PrismaIO party library layer
        const dbLayer = new LayerVersion(this, 'db-layer', {

            code: Code.fromAsset('src/layers/db'),
            description: 'Creates a db layer using PrismaIO'
        })

        // 👇 Lambda function
        new NodejsFunction(this, 'my-function', {
            memorySize: 1024,
            timeout: cdk.Duration.seconds(5),
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

        const network = new Network(this, "PrismaVpcId")
        const dbInstance = new Database(this, "DBLayer", {
            vpc: network.vpc,
            dbUser: "postgres"
        })
        const functions = new Functions(this, "DbFunctions", {db: dbInstance.db, layers: [dbLayer]})
    }
}
