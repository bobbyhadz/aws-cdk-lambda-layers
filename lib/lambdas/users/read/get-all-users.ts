import {getAllUsers} from "/opt/nodejs/db";
import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from "aws-lambda";

const DATABASE_URL = process.env.DATABASE_URL;
export const handler = async function main(
    event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
    console.log(event);
    console.log(DATABASE_URL);
    const allUsers = await getAllUsers()
    return {
        body: JSON.stringify(allUsers),
        statusCode: 200,
    };
}
