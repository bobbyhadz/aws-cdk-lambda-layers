import {LambdaResourceType} from "../lambdas";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";

export const HttpResource = {
    users: 'users',
}
export type LambdaIntegrationType = Pick<LambdaResourceType, "resource"|"httpMethod"> & {
    fn: NodejsFunction
}
