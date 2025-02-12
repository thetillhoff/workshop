import * as cdk from "aws-cdk-lib";
import { IVpc } from "aws-cdk-lib/aws-ec2";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Topic } from "aws-cdk-lib/aws-sns";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

interface LambdaStackProps extends cdk.StackProps {
  vpc: IVpc;
  queue: Queue;
  dlq: Queue;
  topic: Topic;
  bucket: Bucket;
}

export class LambdaStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props?: LambdaStackProps) {
    super(scope, id, props);

    const filenameProcessingLambda = new NodejsFunction(this, 'FilenameProcessingLambda', {
      runtime: Runtime.NODEJS_22_X,
      vpc: props!.vpc,
      deadLetterQueue: props!.dlq,
      logRetention: RetentionDays.ONE_MONTH,
    });

    filenameProcessingLambda.addEventSource(new SqsEventSource(props!.queue));

    const dlqLambda = new NodejsFunction(this, 'DlqLambda', {
      runtime: Runtime.NODEJS_22_X,
      vpc: props!.vpc,
      deadLetterQueue: props!.dlq,
      environment: {
        SNS_TOPIC_ARN: props!.topic.topicArn,
        BUCKET: props!.bucket.bucketName,
      },
      logRetention: RetentionDays.ONE_MONTH,
    });

    dlqLambda.addEventSource(new SqsEventSource(props!.dlq));
    props!.topic.grantPublish(dlqLambda);

    props!.bucket.grantPut(dlqLambda);

  }
}
