import {Code, LayerVersion} from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import {Network} from "./constructs/network";
import {Lambdas} from "./constructs/lambdas";
import {Database} from "./constructs/database";

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
        const lambdas = new Lambdas(this, "PostgresPrismaLambdas", {db: dbInstance.db, layers: [dbLayer]})
    }
}
