import {Construct} from "constructs";
import {aws_lambda_nodejs, CfnOutput, Duration} from "aws-cdk-lib";
import * as path from "path";
import {Architecture, FunctionUrlAuthType, LayerVersion, Runtime} from "aws-cdk-lib/aws-lambda";
import {DatabaseInstance} from "aws-cdk-lib/aws-rds";

interface FunctionsProps {
    db: DatabaseInstance
    layers: LayerVersion[]
}

export class Lambdas extends Construct {
    constructor(scope: Construct, id: string, props: FunctionsProps) {
        super(scope, id);

        const lambdasDir = path.join(__dirname, '../', 'lambdas')

        const getAllUsersFn = new aws_lambda_nodejs.NodejsFunction(this, 'GetAllUsersFn', {
            entry: path.join(lambdasDir, "users", "read", "get-all-users.ts"),
            runtime: Runtime.NODEJS_18_X,
            architecture: Architecture.ARM_64,
            timeout: Duration.minutes(10),
            handler: "handler",
            layers: props.layers,
            bundling: {
                externalModules: ['aws-sdk', '@prisma/client']
            },
        })
        const dbSecret = props.db.secret;
        dbSecret?.grantRead(getAllUsersFn)
        dbSecret?.grantWrite(getAllUsersFn)
        const host = dbSecret?.secretValueFromJson("host").unsafeUnwrap();
        const port = dbSecret?.secretValueFromJson("port").unsafeUnwrap();
        const engine = dbSecret?.secretValueFromJson("engine").unsafeUnwrap();
        const user = dbSecret?.secretValueFromJson("username").unsafeUnwrap();
        const password = dbSecret?.secretValueFromJson("password").unsafeUnwrap();
        const db = dbSecret?.secretValueFromJson("dbname").unsafeUnwrap();

        const DATABASE_URL = `${engine}://${user}:${password}@${host}:${port}/${db}?schema=${db}&connection_limit=1`
        console.log({DATABASE_URL})

        for (const envVar in [host, port, engine, user, password]) {
            getAllUsersFn.addEnvironment("DATABASE_URL", DATABASE_URL)
        }

        const getAllUserFnUrl = getAllUsersFn.addFunctionUrl({authType: FunctionUrlAuthType.NONE})
        new CfnOutput(this, 'getAllUsersFnUrl', {value: getAllUserFnUrl.url})
    }
}

