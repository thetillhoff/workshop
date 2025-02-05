# Hands On

## Automating Secret handling

Did you notice we have a critical security issue in our setup?

The database credentials are still hardcoded in the code of the todo-service.

Since it's best practice to keep application code independent from the environment it's running in, it would be great if we could move the credentials to the environment variables. And if we could automatically retrieve them by our infrastructure code, as they are stored in AWS Secrets Manager anyway. Let's see what we can do.

First up, our application needs to read the credentials from the environment variables.
Replace the contents of the `todo-service/src/database.ts` file with the following code:

```typescript
import { DataSource } from "typeorm";
import { Todo } from "./entities/todo";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // Auto creates tables, disable in production
  logging: false,
  entities: [Todo],
});
```

These changes should be self-explanatory.
Before deploying to AWS, we can verify the changes locally, by using our docker-compose setup.

Add the following content to a newly created `.env` file:

```sh
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=postgres
```

Ensure you have both the database and the todo-service enabled in the `docker-compose.yml` file.
Then, configure the `todo-service` service, so it picks up the environment variables from the `.env` file:

```yaml
todo-service:
  build:
    context: ./todo-service
  ports:
    - "3000:3000"
  env_file:
    - .env
  depends_on:
    - postgres
```

Run `docker compose up` to start the todo-service and the database.
Verify the application is working as expected.

Next, the environment variables need to be set to the correct values in the ECS stack.
First we need a source where to read them from.
Open the database secret in the Secrets Manager console in your browser.
When you display the secrets contents and click on the `Plaintext` tab, you'll see that the key-value AWS showes, refers to the secret being JSON-formatted.
You'll need that knowledge in a moment.

In the `lib/ecs-stack.ts` file, at the end of the `taskImageOptions`, right after the `logDriver` of the `ApplicationLoadBalancedFargateService` properties, add the following lines:

```typescript
logDriver: //...
environment: {
  DB_HOST: "postgres",
  DB_PORT: "5432",
  DB_USERNAME: "postgres",
  DB_PASSWORD: "password",
  DB_NAME: "postgres",
}
```

Well, now we still have the credentials hardcoded in the codebase, as we just moved them to the infrastructure...

Wouldn't it be nice if we could just read them from the secret manager? ;P
Yes, that's possible, it's what we'll do next.

Since we already expose the `dbCredentialsSecret` from the databaseStack, we only need to pass it to the ecsStack and use the secret reference it represents.

Add the secret to the `EcsStackProps` in `lib/ecs-stack.ts`:

```typescript
interface EcsStackProps extends cdk.StackProps {
  vpc: Vpc;
  databaseConnections: Connections;
  databaseCredentialsSecret: ISecret;
}
```

Then, pass the secret reference from the databaseStack to the ecsStack in the `bin/cdk.ts` file:

```typescript
const ecsStack = new EcsStack(app, "EcsStack", {
  vpc: vpc,
  databaseConnections: databaseConnections,
  databaseCredentialsSecret: databaseStack.dbCredentialsSecret,
});
```

That resolves the necessary references.

In the `lib/ecs-stack.ts` file, the `environment` property is now replaced by the `secrets` property.
Rename the `environment` property to `secrets` and adjust the variables like in the following lines:

```typescript
// ...
import { AwsLogDriver, Cluster, ContainerImage, PropagatedTagSource, Secret } from "aws-cdk-lib/aws-ecs";
// ...
secrets: {
  DB_HOST: Secret.fromSecretsManager(
      props!.databaseCredentialsSecret,
      'host'
  ),
  DB_PORT: Secret.fromSecretsManager(
      props!.databaseCredentialsSecret,
      'port'
  ),
  DB_USERNAME: Secret.fromSecretsManager(
      props!.databaseCredentialsSecret,
      'username'
  ),
  DB_PASSWORD: Secret.fromSecretsManager(
      props!.databaseCredentialsSecret,
      'password'
  ),
  DB_NAME: Secret.fromSecretsManager(
      props!.databaseCredentialsSecret,
      'dbname'
  ),
};
```

You can see, that in this case the `host` key is referenced. That's because the secret is stored in JSON format and the kind `fromSecretsManager` function supports to extract a specific value from the JSON.

Now, no environment-specific credentials are now hardcoded in the codebase.

Deploy the changes now and verify the todo-service is working as expected.

Did you notice how cdk automatically managed the permissions, so ECS can access the secret as necessary?

When the deployment is complete, check out the new ECS-task in the ECS console.
There's additional information towards the bottom of its details page.
Go to the `Environment variables and files` tab and check out how a secret references look like.

## Security Hub

Next, go to the Security Hub page in the AWS console.

Explore the different sub pages on your own, while thinking of the following questions:

- How to ensure your AWS organisation / account complies with a security standard like NIST?
- Where would you see company-specific security issues specified via organisation wide AWS Config rules?
- Where can you see security issues in your account, based on severity?
- Are the findings meant for your account only, or are they meant for the whole organisation?
- When looking at a specific finding, which resource is affected and how can you find out how to fix it?

Security Hub sadly is a rather "slow" tool. Most rules it applies to AWS resources are only checked once every 24 hours.
Can you identify a finding that you relates to this workshop?

Keep in mind, not all findings - even if labeled as `HIGH` - are critical. The rules AWS applies are sometimes a bit too generic, and your environment might be fine even if Security Hub lists a finding.
But it's still a good practice to regularly check the findings and fix them.
For some findings, "fixing" might be as simple as setting its so-called Workflow status to `SUPPRESSED` if you are sure it's not a security issue in your case.
