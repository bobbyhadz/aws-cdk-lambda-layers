import {Construct} from "constructs";
import {aws_lambda_nodejs, CfnOutput, Duration} from "aws-cdk-lib";
import * as path from "path";
import {Architecture, FunctionUrlAuthType, LayerVersion, Runtime} from "aws-cdk-lib/aws-lambda";
import {DatabaseInstance} from "aws-cdk-lib/aws-rds";
import {ALL_LAMBDAS} from "../lambdas";
import {LambdaIntegrationType} from "../apis";

interface FunctionsProps {
    db: DatabaseInstance
    layers: LayerVersion[]
}

export class Functions extends Construct {
    public readonly lambdaApiIntegrations: LambdaIntegrationType[];

    constructor(scope: Construct, id: string, props: FunctionsProps) {
        super(scope, id);
        const dbSecret = props.db.secret;
        const host = dbSecret?.secretValueFromJson("host").unsafeUnwrap();
        const port = dbSecret?.secretValueFromJson("port").unsafeUnwrap();
        const engine = dbSecret?.secretValueFromJson("engine").unsafeUnwrap();
        const user = dbSecret?.secretValueFromJson("username").unsafeUnwrap();
        const password = dbSecret?.secretValueFromJson("password").unsafeUnwrap();
        const db = dbSecret?.secretValueFromJson("dbname").unsafeUnwrap();

        const DATABASE_URL = `${engine}://${user}:${password}@${host}:${port}/${db}?schema=${db}&connection_limit=1`
        //console.log({DATABASE_URL})

        const lambdasDir = path.join(__dirname, '../', 'lambdas')
        this.lambdaApiIntegrations = ALL_LAMBDAS.map(lambda => {
            const fn = new aws_lambda_nodejs.NodejsFunction(this, lambda.id, {
                entry: path.join(lambdasDir, lambda.entryPath),
                runtime: Runtime.NODEJS_18_X,
                architecture: Architecture.ARM_64,
                timeout: lambda.timeOutMins || Duration.minutes(10),
                handler: lambda.handlerName,
                layers: props.layers,
                bundling: {
                    externalModules: ['aws-sdk', '@prisma/client']
                },
            })

            for (const envVar in [host, port, engine, user, password]) {
                fn.addEnvironment("DATABASE_URL", DATABASE_URL)
            }
            dbSecret?.grantRead(fn)
            dbSecret?.grantWrite(fn)

            const fnUrl = fn.addFunctionUrl({authType: FunctionUrlAuthType.NONE})
            new CfnOutput(this, `${lambda.id}Url`, {value: fnUrl.url})

            const apiFn: LambdaIntegrationType = {
                fn,
                resource: lambda.resource,
                httpMethod: lambda.httpMethod
            }
            return apiFn
        })
    }
}

