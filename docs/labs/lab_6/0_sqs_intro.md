# Lab 6: Message Queuing with SQS and Lambda

## Overview

In this lab, you'll learn how to implement asynchronous message processing using Amazon Simple Queue Service (SQS). We'll build upon our CloudFront-enabled infrastructure from previous labs, adding message queuing capabilities to handle background tasks efficiently.

## Key Concepts

### SQS

- **Message Queues**: Managed service for storing messages between application components
- **Dead Letter Queues**: Secondary queues for handling failed message processing
- **Message Visibility**: Controls how long messages are hidden during processing
- **Lambda Triggers**: Serverless compute that processes messages automatically
- **Batch Processing**: Efficient handling of multiple messages in a single invocation
- **Message Retention**: Configurable duration for storing messages in the queue
- **Access Control**: IAM-based permissions for message producers and consumers

### Lambda

- **Function Code**: Write in familiar languages (Python, Node.js, Java, etc.) with support for standard libraries and AWS SDKs
- **Event Sources**: Functions respond to events from services like S3, DynamoDB, API Gateway, or custom applications
- **Resource Management**: Only configure memory - AWS automatically handles CPU, network, and I/O scaling
- **Serverless Scaling**: Functions scale automatically based on incoming events with no infrastructure management
- **State Management**: Functions are stateless and require external storage for maintaining state between invocations
- **Cost Model**: Pay-per-use billing in 1ms increments, only charged for actual compute time
- **Configuration Parameters**: Set memory allocation, timeout limits, environment variables, and concurrency controls
- **Security Model**: IAM roles and policies control function permissions and resource access
- **Dependencies**: Include external libraries and shared code using Lambda layers
- **High Availability**: Built-in fault tolerance and automatic replication across availability zones

## Architecture

We'll extend our Lab 5 architecture by adding:

1. SQS queue with dead-letter queue configuration
2. Lambda function for message processing
3. Update the ECS application to publish messages to the SQS queue
4. Updated ECS task role for message publishing

![Lab 6 Architecture](../../media/lab_6_arch.drawio.svg)
