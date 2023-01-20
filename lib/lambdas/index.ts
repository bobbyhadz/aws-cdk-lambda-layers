import {Duration} from "aws-cdk-lib";

export type LambdaType = {
    id: string,
    lambdaName: string,
    entryPath: string,
    handlerName: string,
    timeOutMins?: Duration,
}
export const ALL_LAMBDAS: LambdaType[] = [
    {id: 'GetAllUsersFn', lambdaName: 'GetAllUsers', handlerName: "handler", entryPath: "users/read/get-all-users.ts"},
    {id: 'CreateUserFn', lambdaName: 'CreateUser', handlerName: "handler", entryPath: "users/create/create-user.ts"},
]
