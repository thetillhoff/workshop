# Lab 6: Implementing Message Queuing

## Step 1: Create the infrastructure

**1. Create SQS Queue and Lambda Function**

Add add the beginning of your existing `index.ts`:
```typescript
// Create SQS Queue
const deadLetterQueue = new aws.sqs.Queue("workshop-dlq");
const queue = deadLetterQueue.arn.apply(
  (dlqArn) =>
    new aws.sqs.Queue("workshop-queue", {
      visibilityTimeoutSeconds: 30,
      messageRetentionSeconds: 86400,
      redrivePolicy: JSON.stringify({
        deadLetterTargetArn: dlqArn,
        maxReceiveCount: 3,
      }),
    })
);
// Create Lambda Role
const lambdaRole = new aws.iam.Role("message-processor-role", {
  assumeRolePolicy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Action: "sts:AssumeRole",
        Effect: "Allow",
        Principal: {
          Service: "lambda.amazonaws.com",
        },
      },
    ],
  }),
  managedPolicyArns: [
    // to allow the lambda function to send logs to CloudWatch
    "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
  ],
});
// Add SQS permissions to Lambda Role
new aws.iam.RolePolicy("lambda-sqs-policy", {
  role: lambdaRole.id,
  policy: queue.arn.apply((arn) =>
    JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Action: [
            "sqs:ReceiveMessage",
            "sqs:DeleteMessage",
            "sqs:GetQueueAttributes",
          ],
          Resource: arn,
        },
      ],
    })
  ),
});
// Create Lambda Function
const processor = new aws.lambda.Function("message-processor", {
  runtime: "nodejs18.x",
  handler: "index.handler",
  role: lambdaRole.arn,
  code: new pulumi.asset.AssetArchive({
    "index.js": new pulumi.asset.StringAsset(
      `exports.handler = async (event) => { console.log(JSON.stringify(event, 2, null)); return { statusCode: 200 }; }; `
    ),
  }),
});
// Add SQS trigger to Lambda
new aws.lambda.EventSourceMapping("queue-trigger", {
  eventSourceArn: queue.arn,
  functionName: processor.name,
  batchSize: 1,
});

const taskRole = new aws.iam.Role("ecs-task-role", {
  assumeRolePolicy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Action: "sts:AssumeRole",
        Effect: "Allow",
        Principal: {
          Service: "ecs-tasks.amazonaws.com",
        },
      },
    ],
  }),
});

new aws.iam.RolePolicy("task-sqs-policy", {
  role: taskRole.id,
  policy: pulumi.jsonStringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: ["sqs:SendMessage"],
        Resource: queue.arn,
      },
    ],
  }),
});
```

**2. Update ECS Task Definition**

Update your task definition to include the queue URL and permissions:
```typescript
// Update Task Definition with environment variables
const taskDefinition = new aws.ecs.TaskDefinition("workshop-task", {
  ...
  containerDefinitions: pulumi.jsonStringify([
    {
      ...
      environment: [
        {
          name: "QUEUE_URL",
          value: queue.url,
        },
      ],
    },
  ]),
  taskRoleArn: taskRole.arn,
});
```

## Step 2: Modify the Typescript application to send messages
Add the `AWS SDK` package for the SQS client:
```bash
cd application
yarn add @aws-sdk/client-sqs
```

Then add the following code to the `app.ts` file:
```typescript
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqsClient = new SQSClient({ region: process.env.AWS_REGION });

app.use(express.json());
app.post("/message", async (req, res) => {
  const { content } = req.body;
  const params = {
    QueueUrl: process.env.QUEUE_URL,
    MessageBody: content,
  };

  try {
    const command = new SendMessageCommand(params);
    const result = await sqsClient.send(command);
    res.status(200).json({ messageId: result.MessageId });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message to SQS" });
  }
});
```

## Verify the Deployment

Following the checkpoint style from Lab 2 (lines 276-292):

1. **Build and Push the Docker Image** (make sure you exported the `PULUMI_CONFIG_PASSPHRASE` environment variable):

```bash
docker build -t workshop-app .
docker tag workshop-app:latest $(pulumi stack output repositoryUrl):latest
docker push $(pulumi stack output repositoryUrl):latest
```

2. **Deploy the infrastructure changes**:

```bash
cd ../ # Go back to the root of the project
pulumi up
```

3. **Test Message Processing**:

Send a test message

```bash
curl -X POST -H "Content-Type: application/json" \
-d '{"content":"Hello from local!"}' \
https://$(pulumi stack output cloudfrontDomain)/message
```

4. **Verify the message was received**:
Check SQS > Monitoring in the AWS Console to ensure that the message was received (metrics).
Check Lambda > Monitoring in the AWS Console to verify that the function was invoked.
Review the Lambda logs in CloudWatch Logs to see the content of the processed message.

## Summary of Steps

With the addition of SQS and Lambda for asynchronous message processing, you've completed building a modern, distributed application architecture that incorporates containers, load balancing, content delivery, and event-driven patterns. 

This lab completes your journey through creating and managing a containerized application using Pulumi, equipping you with practical skills for building and managing distributed cloud infrastructure.
