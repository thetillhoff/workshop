# Hands On

## Create database in AWS

If you've worked with Databases in AWS before, you can continue with the headline below that says "Adding a database stack".

Open the RDS console in AWS and create a new database manually.

Use "Standard create" and "Aurora (PostgreSQL compatible)" as database engine.
Choose the "Dev/Test" template, so we are allowed to create a single instance database.
Give it a name like `taskdb`.
As instance class, choose the burstable `db.t3.micro`.
Set your own password, as the default one might have characters that are not allowed in the connection string.
Since we want to access the database from our local machine and don't have a VPN to the network of the workshop account, we need to set it to allow "Public Access".
Make sure to create a new security group for this postgres database that allows inbound traffic on port 5432 from your IP address.
Disable enhanced monitoring, it's not needed for this workshop and will only add costs.
In the Additional Configuration section, you can have it create an initial database, with a name `postgres`. Otherwise you need to connect manually and create it - which is not covered by this workshop.
Everything else can be left on their default values.
After you submit the creation, you can verify the security group rules. It should have a rule for your IP address and the default postgresql port 5432.

The creation of a RDS database takes roughly 10 minutes, so feel free to grab a coffee in the meantime.


## Todo Service on localhost and Task Database on AWS

When the database cluster is ready, retrieve it's Writer endpoint and update the connection string in the `todo-service/.env` file accordingly.
The credentials can be found in the Secret Manager of the AWS account.

Comment out the `postgres` service section in the `todo-service/docker-compose.yaml` file, including the `depends_on` part of the `todo-service`.
Run `docker compose up` in the `todo-service` folder to start the database container on your local machine.
Verify that the application can connect to the database and works as intended.

Okay, the database on AWS is working and it's relatively easy to work with. But as with the network, we want to manage it with code, so we can replicate it in multiple accounts.


## Adding a database stack

Back in our CDK code, create a new file `lib/database-stack.ts` and add the following code to it:

```typescript
import * as cdk from "aws-cdk-lib";
import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  IVpc,
  SubnetType,
} from "aws-cdk-lib/aws-ec2";
import {
  AuroraPostgresEngineVersion,
  ClusterInstance,
  DatabaseCluster,
  DatabaseClusterEngine,
} from "aws-cdk-lib/aws-rds";
import { ISecret } from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";

interface DatabaseStackProps extends cdk.StackProps {
  vpc: IVpc;
}

export class DatabaseStack extends cdk.Stack {

  public dbCredentialsSecret: ISecret;

  constructor(scope: Construct, id: string, props?: DatabaseStackProps) {
    super(scope, id, props);

    const dbCluster = new DatabaseCluster(this, "DatabaseCluster", {
      engine: DatabaseClusterEngine.auroraPostgres({
        version: AuroraPostgresEngineVersion.VER_16_4,
      }),
      storageEncrypted: true,
      writer: ClusterInstance.provisioned("dbWriter", {
        instanceType: InstanceType.of(
          InstanceClass.BURSTABLE3,
          InstanceSize.MEDIUM
        ),
      }),
      vpc: props?.vpc,
      vpcSubnets: {
        subnetType: SubnetType.PUBLIC, // TODO change to private
      },
      defaultDatabaseName: "postgres",
    });

    this.dbCredentialsSecret = dbCluster.secret!;
  }
}
```

Can you identify which property relates to which setting from the manual setup from earlier?

All of the properties should be familiar to you from the manual setup.
Similar to the VPC stack, you can see there's a public variable. `dbCredentialsSecret` contains the Secret object that contains the credentials for the database, so we can use it in our application later.

This stack needs to be added to the `bin/cdk.ts` file similarly to the `VpcStack`:

```typescript
// ...
import { DatabaseStack } from '../lib/database-stack';
// ...
const databaseStack = new DatabaseStack(app, 'DatabaseStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'eu-central-1' },
  vpc: vpcStack.vpc,
});
```

The `vpcStack.vpc` is the object that was exposed by the `VpcStack` earlier. We now pass it to the `DatabaseStack` as a property, so it can use it to create the database in the VPC and its subnets.
Did you notice the `subnetType: SubnetType.PUBLIC` earlier? That's because the database needs to be publicly accessible, so we can connect to it from our local machine for now.

Deploy the changes with the following command:
```sh
cdk deploy
```

Oh no, we got an error!
Since we have two stacks now, we need to tell cdk which one to deploy. Or, since we want to deploy all our stacks, we can just add `--all` to the deployment command.
```sh
cdk deploy --all
```

Again, the creation of a RDS database takes roughly 10 minutes, so feel free to grab a coffee in the meantime.

After the deployment of this new stack is complete, check if you can find the database in the AWS console.
How is it configured? In which subnets is it running in? Does it have a security group?


## Todo Service on localhost and Task Database on AWS - IaC edition

As in the earlier step, connect your local task service to the database in AWS by adjusting the `todo-service/.env` file and updating it with the new host and credentials from the Secret Manager.

Don't forget the security group rule for your IP :P
Since it's an intermediate step, you can create it manually.

Verify that the application can connect to the database and works as intended.
