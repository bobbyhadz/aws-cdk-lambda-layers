# Prisma IO as a DB layer in AWS CDK

## How to Use

- Clone the repository
- Install the dependencies
```bash
cd aws-cdk-lambda-layers
npm install && npm install --prefix src/layers/db/nodejs
```
- Create the CDK stack
```bash
cdk deploy
```
- Open the AWS Console and the stack should be created in your default region
- Cleanup
```bash
cdk destroy
```
