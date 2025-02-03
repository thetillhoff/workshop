# Hands On

## Install AWS-CDK

First, install AWS-CDK globally on your machine.
That way, it's available for all your projects, and you don't have to install it in each project.

```sh
npm install -g aws-cdk
```


## Create a new AWS-CDK project

Create an empty folder named `cdk` at the root of your workshop folder.
Enter it from commandline and run the following command to create a new AWS-CDK project:

```sh
cdk init app --language typescript
```

This will create multiple files and folders.
Among them, you'll find a `package.json` file, which makes it an NPM project.

## Explore the project

In the `package.json` file, you'll find a reference to `bin/cdk.js`.
Since the project is already set up to build javascript code from typescript, you can think of it as a reference to `bin/cdk.ts`.

In the `bin/cdk.ts` file, you'll see an `cdk.App` being initialized, and a `CdkStack` being created.
This `CdkStack` is imported from a file in `lib/cdk-stack.ts`.

The `lib/cdk-stack.ts` file contains the actual code for this particular stack.
It contains an empty Stack and some sample code which is commented out.

Empty stacks are omitted from deployment by CDK.

The other files and folders aren't relevant for this lab.


## Prepare your AWS account for AWS-CDK

To deploy CDK stacks to your AWS account, you need to set up your AWS account for CDK.
This process is called "bootstraping".

Run the following command to bootstrap your account:

```sh
cdk bootstrap
```

This will create a CloudFormation Stack in your account that sets up the necessary resources for CDK.

In your Browser navigate to the CloudFormation console and find the Stack named `CDKToolkit`.

This Stack is used by CDK to store assets and resources needed for deployment. It contains:

- An S3 bucket to store files and artifacts that CDK needs to deploy your stacks
- IAM roles and policies that grant CDK permission to deploy resources
- A Docker image repository (ECR) for storing container images
- Other configuration parameters CDK needs for deployment

These resources enable CDK to properly stage and deploy your infrastructure code to AWS.

It's a single "fire-and-forget" operation, but it enables us to deploy our own Stacks to this AWS account.
