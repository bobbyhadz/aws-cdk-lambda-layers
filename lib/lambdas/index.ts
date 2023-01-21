import {Duration} from "aws-cdk-lib";
import {HttpMethod} from "aws-cdk-lib/aws-lambda";
import {HttpResource} from "../apis";

export type LambdaResourceType = {
    id: string,
    lambdaName: string,
    entryPath: string,
    handlerName: string,
    timeOutMins?: Duration,
    resource: string,
    httpMethod: HttpMethod
}
export const ALL_LAMBDAS: LambdaResourceType[] = [
    {
        id: 'GetAllUsersFn',
        lambdaName: 'GetAllUsers',
        handlerName: "handler",
        entryPath: "users/read/get-all-users.ts",
        resource: HttpResource.users,
        httpMethod: HttpMethod.GET
    },
    {
        id: 'CreateUserFn',
        lambdaName: 'CreateUser',
        handlerName: "handler",
        entryPath: "users/create/create-user.ts",
        resource: HttpResource.users,
        httpMethod: HttpMethod.POST
    },
]
