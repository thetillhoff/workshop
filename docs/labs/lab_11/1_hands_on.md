# Hands On


In this hands-on section, you have to start to use your newly gained knowledge and figure out some parts on your own and - if you are completely stuck - with the help of your workshop coaches.


## Create a second Lambda

- Create a second Lambda function in the LambdaStack.
- Make it listen to the previously unused DLQ.

Hint: You can manually verify by sending a message from the SQS Console.


## Create SNS topic

Create a new stack for SNS and reference it in the `bin/cdk.ts`.

An SNS topic is created with the following code:

```typescript
this.topic = new Topic(this, 'Topic');
```


## Manually subscribe to SNS topic with your email address

You can create a subscription to this topic with the following code:

```typescript
this.topic.addSubscription(
    new EmailSubscription('till.hoffmann+workshop@superluminar.io') // replace me
);
```

This will send out a confirmation email. You'll only start to receive notification mails after you've confirmed the subscription.

Afterwards, verify the subscription is working correctly by manually triggering a notification from the SNS Console in your browser. The button is labled "Publish message".


## DLQ processing

In the lab about SQS, we set up and used a SQS queue, but also and a dlq. Yet, so far we've only used the queue.

Now, we want to send out notifications whenever something arrives in the dlq.

Add a new Lambda for processing dlq messages to the LambdaStack.

The code for it could look like this:

```typescript
import { SQSEvent, SQSRecord } from "aws-lambda";

export const handler = async (event: SQSEvent) => {
	const records: SQSRecord[] = event.Records;

	for (let index = 0; index < records.length; index++) {

		const body = records[index].body;

		console.log('body from dlq:',body);
	}

	return;
}
```

This function will print the body of dlq messages to the logs.

You can verify this works by manually sending a message to the dlq.


## Add date verification in FilenameProcessingLambda

At the moment, the FilenameProcessingLambda processes almost everything - and the todo-service in ECS alreads does all the type-checks.
Let's adjust the code of the FilenameProcessingLambda, so it only allows dueDates that are in the future - and have all others go to the dlq.
The relevant code snippet looks like this:

```typescript
// ...
interface Todo {
  title: string;
  description: string;
  dueDate: Date;
  status: string;
  userEmail: string;
}

// ...

for (let index = 0; index < records.length; index++) {
    const body = records[index].body;

    const todo: Todo = JSON.parse(body);

    console.log(todo.dueDate);

	const today = new Date()
	const todoDueDate = new Date(todo.dueDate)

    if (todoDueDate < today) {
      // before today
	  throw new Error("the due date is in the past");
    }
  }
```

Create a new task, either via API call, or directly in the SQS queue (not the dlq).
Check the logs of the lambdas.
You'll have to wait for three retries of the message, before it'll be send to the dlq.

Try these example messages/todos:

```json
{
    "title": "One Task",
    "description": "This is an example task",
    "dueDate": "2025-01-01",
    "status": "pending",
    "userEmail": "till.hoffmann@superluminar.io"
}
```

```json
{
    "title": "One Task",
    "description": "This is another example task",
    "dueDate": "2525-01-01",
    "status": "pending",
    "userEmail": "till.hoffmann@superluminar.io"
}
```
(The devil is in the year)


## Send a SNS notification on errors

Now that we have a lambda that's only triggered on errors, we have more options regarding error handling.
At the moment, we're reading from the dlq and throwing the messages away after reading and logging it.

As the next step, we want to inform the administrator (subscriber of the SNS topic we set up earlier) to be notified if an error occurs.

First, we need to allow our Lambda to publish messages to SNS.
Again, use your knowledge from the previous labs to expose the SNS topic from the SnsStack and pass it to the LambdaStack.
If you need to reorder things, that shouldn't be a problem, as long as the IDs stay the same.

(The ID in `const snsStack = new SnsStack(app, 'SnsStack', {...});` is `SnsStack`)

In the LambdaStack, you need to pass the SNS topic ARN as environment variable (hint: they work similar to environment variables in ECS, and the value could look like `props!.topic.topicArn`).

And you need to grant the lambda permissions to publish to the topic.
This is new, and can be done with `props!.topic.grantPublish(dlqLambda);`.

Lastly, you need to adjust the Lambda code, so it publishes a message to said SNS topic.

The relevant code to do that looks like this:

```typescript
// ...
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
// This requires `npm install @aws-sdk/client-sns` in the cdk folder.
// ...
    console.log("body from dlq:", body);

    const snsClient = new SNSClient({});
    const response = await snsClient.send(
      new PublishCommand({
        Message: body,
        TopicArn: process.env.SNS_TOPIC_ARN,
      })
    );
    console.log(response);
// ...
```

Verify your changes by creating new todos with different dates.
Check the logs of the Lambdas and remember that a messages is put into the dlq only after three unsuccessful processing tries.
Did you notice that the retry doesn't happen immediately, but in 30 second intervals?
Don't forget to check your emails, too!

Awesome, now you have a queue for decoupling two applications, and if the queue receives invalid objects, you are getting notified automatically via Email!
