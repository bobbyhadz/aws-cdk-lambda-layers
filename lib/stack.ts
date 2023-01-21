import {Code, LayerVersion} from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import {Network} from "./constructs/network";
import {Functions} from "./constructs/functions";
import {Database} from "./constructs/database";
import {Apis} from "./constructs/apis";

export class Stack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // 👇 PrismaIO db library layer
        const dbLayer = new LayerVersion(this, 'prisma-db-layer', {
            code: Code.fromAsset('src/layers/db'),
            description: 'Creates a db layer using PrismaIO'
        })

        const network = new Network(this, "PrismaVpcId")
        const dbInstance = new Database(this, "Database", {
            vpc: network.vpc,
            dbUser: "postgres"
        })
        const lambdas = new Functions(this, "PostgresPrismaLambdas", {db: dbInstance.db, layers: [dbLayer]})

        const apis = new Apis(this, "PostgresPrismaApis", {lambdaIntegrations: lambdas.lambdaApiIntegrations})
    }
}
