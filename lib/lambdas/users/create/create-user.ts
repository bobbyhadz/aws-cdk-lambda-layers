import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from "aws-lambda";
import {createUser} from "/opt/nodejs/db";

//const DATABASE_URL = process.env.DATABASE_URL;
type UserType = {
    name: string,
    email: string
}
export const handler = async function main(
    event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
    console.log(event);
    const {name, email} = JSON.parse(event.body as string) as UserType;
    console.log({name, email})
    const user = await createUser(name, email)
    return {
        body: JSON.stringify(user),
        statusCode: 200,
    };
}
