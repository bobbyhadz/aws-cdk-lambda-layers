# Prisma IO as a DB layer in AWS CDK

## How to run
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

## How to run migrations and database setup
> Note: To be added soon

# Testing
## Testing Layer (DB and business logic)
This is where the business logic is written and tested without CDK. This is the **fastest** way to test your business logic
against the DB in AWS.

### Pre-requisites
- You must have deployed the application on AWS.
- You must have access to AWS console.
- Locate DB credentials
  - Navigate to Cloudformation stack that contains this deployed app.
  - Click on Resources. Here you will see list of resource including `Database`. Click on it.
  - Then click on **Database** > **Secret**.
  - Here you will find a Secret that starts with name `PostgresPrismaStackDatabaseSecret`. Next to it is a link. Click on it.
  - It takes you the new tab which is the Secret associted with this database.
  - As you scroll, you should see a button called *Retrieve secret value*. Click on that.
  - Here you will find the credentials needed to connect to your database from your local. Keep a note of these values

### Steps
- Navigate to code where `prisma` directory exists
```shell
cd src/layers/db/nodejs/prisma
```
- Create `.env` file
```shell
cp .env.sample .env
```
Copy all the necessary credentials information in `.env` from the Secret Manager page on AWS console.
> Note: The `.env` file is in `.gitignore` so it will not be checked in by default.

- Locate to directory that contains `script.ts`
```shell
cd src/layers/db/nodejs
```
In this file,
- You can import the functions that use as entry point to lambda functions.
- The imported function should be used inside the `main()` method. For example, by default, `getAllUsers()` is imported.
- Now that you have `.env` with the credentials and the function ready to execute, run the function
```shell
npx ts-node script.ts
```
If call succeeds, you should see an output similar to the following
```shell
[
  {
    id: 1,
    email: 'amy@email.com',
    name: 'Amy L',
    post: [
      {
        id: 1,
        title: 'Lasagna Recipe',
        content: 'This is my first recipe',
        published: false,
        authorId: 1
      }
    ]
  },
  {
    id: 2,
    email: 'john@email.com',
    name: 'John A',
    post: [
      {
        id: 2,
        title: 'Mud Bike',
        content: 'This is my first ride in the Alps!',
        published: false,
        authorId: 2
      }
    ]
  },
  { id: 3, email: 'johnny@email.com', name: 'Johnny Smith', post: [] },
  {
    id: 4,
    email: 'jacinda@ardern.govt.nz',
    name: 'Jacinda Ardern',
    post: []
  },
  { id: 5, email: 'remy@email.com', name: 'Remy D', post: [] }
]
```

## Testing Lambdas Locally
This is where business logic is tested when wrapped in AWS Lambda functions. However, the testing is done
on local machine without deploying to AWS.
The benefit is that we can test AWS lambdas before deploying and save a lot of time by iterating on local machine.

### Pre-requisites
- You must have [`SAM CLI`](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) installed
- You must have a stack deployed once. That means you have a DB instance up and running
that you can access from your local instance.
- Copy `DATABASE_URL`
  - You must access your AWS console and open any existing lambda function page.
  - Here you will see mutiple tabs such as Code, Test, Monitor, Configuration, among others. Click on Configuration.
  - On the left you will see many variables including **Environment variables**. Click on that.
  - Then, on the right, you will see all environment variables that are available to this function. Here you will find **DATABASE_URL**. Copy this value.
- In your application root, create `env.json` file
```shell
cp env.json.sample env.json
```
In this file, replace value of `DATABASE_URL` with your copied value.
> Note: This file is in `.gitignore` so it is not checked in. You must not check it in to avoid
> any security issues.

### Steps
- From your project root run the following command
```shell
cdk synth
```
This creates the CloudFormation template in a directory called `cdk.out`. Depending on how many stacks you have, you will find multiple `<stackname>.template.json`.
> Remember to call this command every time you make changes in your stack to generate the latest template.json file

For example
```shell
> ls cdk.out 
PostgresPrismaStack.assets.json                                        asset.a4b4befa5d4ca8935d210e0b9e857a607dd688bd940aef7fbfb39b52a0286657
PostgresPrismaStack.template.json                                      asset.b0ae7f26dc342b1306fdf2c64fad32153feab1f734c7c4504ac0166f2c4c1b5e
asset.2b7f962faf096fc72fd478d2ba723f98ead48701876a8a72b4f2c3f0e22562f8 asset.b241bf993e5de56fccf48dfc0234e526969bb49fb9a8c6303b329791e94abbbc
asset.2b8564637c9bfbeb11fa44feb49da778c5d3a95aba062c146cb4c4ddcbbfae5f asset.b28ea193a2246619892eca5c2470feff955bc08a071937112023890158ccbbe3
asset.37455321e7b9b5ba188a2ca8a635ba37770786b30b70cf91e5d8a1a23b1ad285 asset.bf16469423c37b5814e39b4faa5f0d362d2ac5fbdc9ac7a3eb79d79124115d21
asset.3791e77fa3b8af4231db90ec0c3593dd52b73dfeb0e2b6e8218e549958fddc3a asset.d2a34ccf4c448875eeafd813f67590905558374193f359d106f65f853a52df07
asset.3db31b085ef1c85737a2768f84bfd2a9193712d5bc23a0c588af7d664f2ac997 asset.d4bbdc55b9b97a466238668266f11b92e73bb1c8eebb9dc99acc8a6e4e7129fc
asset.45a58cf59da16ab47d6dd9339a31c1c998b4405adc1b4b8d54be2537ea5bf5ab asset.d88825fe273d4921a756681d8a49150996e137affe1eb1f8155143b049fa4ccb
asset.505ce672f77196a8aa6c6894ba161a69c03bb74b221f872bcb0c2d111b8fc4e3 asset.dbf1c26009ec8bee61bf9ded826359dd53acfcf15bba79fdff828f4defa670d2
asset.529a566113dea3194fe3e84b54b25b6dd724bffb676f1ea3d2f459c6827b71a4 asset.dc51083fe1193a8934624d17cd212dec111929cb8b6bd018b185c77b37320a7f
asset.61c2f087dd147996cf3a957c1369e65d88a3d50e91e357d2f922ec0182aa8f7e asset.e2481f61b8e6925a3d8353c8f71e68e1e54bca60877fa1f455d4c1a66ccf6736
asset.6ab76852f6e40908237225beb464378a80ffdda1ed78d52e57e5cdd72ce830d9 asset.ef82b5193cb880d27d14a4dcba9bafae29b0c0b26a7159f752d076c08f310766
asset.7a2014ed5117b1d90bd3d96fdf82ca9835eed066a8aafaae66798e7a3ae82901 asset.efd969fe5e1baeb48eb05f0cffea7df6f640781ae33cf927360bd13422821f7c
asset.8b3e3a3cb013c0b7f6b8588fec89e4c19658084f5d26c1df980e219343002c76 asset.f8ef12b7fed1496ed271f7c547fd5a745f3add796350ef938fe9f42b970f2bcf
asset.8cc7e71bbba7a599a52937727ee597e8ea408f3a64f939f68f998e05e35fb993 cdk-stack.assets.json
asset.8d0d310d768a1b47f99e8b615bd5af72ebdd6698463e377ddb5a394140c32566 cdk-stack.template.json
asset.9175f1922ca97d06f0d124deae99ae20d824c7c9d433d60e4dc1e801262c7444 cdk.out
asset.91e369573455e246fec02a25aba72dfdb3a72a5db588a07d4767f2971a4dd4d4 manifest.json
asset.a096a9d304e570a6a26bfaf937bb65a32f1abd6de9b47e627689d7f94b53eace tree.json
asset.a28e2ecdb40a4f5cf5cd9971cac5efe3e5ee9ff36ab67c6cf0b394cab34c3aef
```
Here there is one `.template.json` file called `PostgresPrismaStack.template.json`, where `PostgresPrismaStack` is the `id` of the stack.
- In order to invoke a lambda function locally, you need a few things
    - template json file path, that you found out in the previous step
    - `id` of the lambda function, that you defined when creating a function. See `ALL_LAMBDAS` in [index.ts](./lib/lambdas/index.ts) to get the `id`.
    - `env.json` that you have prepared in the previous steps 
With that you can invoke the function as defined below

**Get All Users**
```shell
sam local invoke -t cdk.out/PostgresPrismaStack.template.json GetAllUsersFn --env-vars env.json
```
If this succeeds, you should see an output similar to the following
```shell
{"body":"[{\"id\":1,\"email\":\"amy@email.com\",\"name\":\"Amy L\",\"post\":[{\"id\":1,\"title\":\"Lasagna Recipe\",\"content\":\"This is my first recipe\",\"published\":false,\"authorId\":1}]},{\"id\":2,\"email\":\"john@email.com\",\"name\":\"John A\",\"post\":[{\"id\":2,\"title\":\"Mud Bike\",\"content\":\"This is my first ride in the Alps!\",\"published\":false,\"authorId\":2}]},{\"id\":3,\"email\":\"johnny@email.com\",\"name\":\"Johnny Smith\",\"post\":[]},{\"id\":4,\"email\":\"jacinda@ardern.govt.nz\",\"name\":\"Jacinda Ardern\",\"post\":[]}]","statusCode":200}
```
**Create User**  
Since this functions, takes input, we need to create an event file to provide events.
- Copy event file
```shell
cp events.json.sample event.json
```
- Update event data as per your needs in `events.json`.
- Invoke function
```shell
sam local invoke -t cdk.out/PostgresPrismaStack.template.json CreateUserFn --env-vars env.json -e events.json
```
If this succeeds, you should see an output similar to the following
```shell
{"body":"{\"id\":5,\"email\":\"remy@email.com\",\"name\":\"Remy D\"}","statusCode":200}
```

## API
> Note: You will get `API_ENDPOINT` as the output of `cdk deploy` command.

### GET users
```shell
curl -H"Content-Type:application/json" -v <API_ENDPOINT>/users
```

If the call succeeds, you should get an output similar to the following
```shell
[{"id":1,"email":"amy@email.com","name":"Amy B","post":[]},{"id":2,"email":"johnny@email.com","name":"Johnny J","post":[]}]
```

### POST users
```shell
curl -H "Content-Type:application/json" -XPOST -d '{"name": "Charlie C", "email": "charlie@email.com"}' -v <API_ENDPOINT>>/users
```
If the call succeeds, you should get an output similar to the following
```shell
{"id":3,"email":"charlie@email.com","name":"Charlie C"}
```

## Resources
[Invoking Lambda Functions Locally](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-using-invoke.html)
