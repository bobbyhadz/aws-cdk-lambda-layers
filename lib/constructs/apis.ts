import {Construct} from "constructs";
import {Cors, IResource, MockIntegration, PassthroughBehavior, RestApi} from "aws-cdk-lib/aws-apigateway";
import {HttpMethod} from "aws-cdk-lib/aws-lambda";
import {CfnOutput} from "aws-cdk-lib";


export class Apis extends Construct {

    constructor(scope: Construct, id: string) {
        super(scope, id);

        const api = new RestApi(this, 'api', {
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: Cors.ALL_METHODS // this is also the default
            }
        })
        const users = api.root.addResource('users')
        users.addMethod(HttpMethod.GET, new MockIntegration({
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

        new CfnOutput(this, "Api", {
            value: api.url
        } )


    }
}
