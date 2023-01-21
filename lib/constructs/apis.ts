import {Construct} from "constructs";
import {
    Cors,
    LambdaIntegration,
    MockIntegration,
    PassthroughBehavior,
    Resource,
    RestApi
} from "aws-cdk-lib/aws-apigateway";
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
            resource.addMethod(lambdaIntegration.httpMethod, new LambdaIntegration(lambdaIntegration.fn))
        })

        new CfnOutput(this, "Api", {
            value: api.url
        })
    }
}
