import {Construct} from "constructs";
import {Cors, MockIntegration, PassthroughBehavior, Resource, RestApi} from "aws-cdk-lib/aws-apigateway";
import {CfnOutput} from "aws-cdk-lib";
import {HttpResource, LambdaIntegrationType} from "../apis";

type ApiProps = {
    lambdaIntegrations: LambdaIntegrationType[]
}

export class Apis extends Construct {
    private resources = new Map<string, Resource>();

    constructor(scope: Construct, id: string, props: ApiProps) {
        super(scope, id);

        const api = new RestApi(this, 'api', {
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: Cors.ALL_METHODS // this is also the default
            }
        })

        // add all the top level defined sources
        Object.keys(HttpResource).map(resourceName => {
            const resource = api.root.addResource(resourceName)
            console.log(`added ${resourceName}`)
            this.resources.set(resourceName, resource);
        })

        props.lambdaIntegrations.forEach(lambdaIntegration => {
            const resource = this.resources.get(lambdaIntegration.resource) as Resource;
            resource.addMethod(lambdaIntegration.httpMethod, new MockIntegration({
                integrationResponses: [{
                    statusCode: '200',
                    responseParameters: {
                        'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                        'method.response.header.Access-Control-Allow-Origin': "'*'",
                        'method.response.header.Access-Control-Allow-Credentials': "'false'",
                        'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
                    },
                }],
                passthroughBehavior: PassthroughBehavior.NEVER,
                requestTemplates: {
                    "application/json": "{\"statusCode\": 200}"
                },
            }), {
                methodResponses: [{
                    statusCode: '200',
                    responseParameters: {
                        'method.response.header.Access-Control-Allow-Headers': true,
                        'method.response.header.Access-Control-Allow-Methods': true,
                        'method.response.header.Access-Control-Allow-Credentials': true,
                        'method.response.header.Access-Control-Allow-Origin': true,
                    },
                }]
            })
        })

        new CfnOutput(this, "Api", {
            value: api.url
        })
    }
}
