# Lab 1: Building with ECS Fargate

## Overview

In this lab, you'll learn how to deploy containerized applications using Amazon ECS (Elastic Container Service) with AWS Fargate. We'll start with a basic nginx container and set up the foundational infrastructure needed for container orchestration.

## Key Concepts: Containerization and AWS Container Services

### Understanding Containers

Containers represent a fundamental shift in how we package and deploy applications. Unlike traditional deployment methods where applications run directly on servers, containers package the application code together with all its dependencies, ensuring consistent behavior across different environments. This approach solves the age-old problem of "it works on my machine" by creating a standardized unit that runs identically everywhere.

### Container Orchestration with Amazon ECS

Amazon Elastic Container Service (ECS) is AWS's fully managed container orchestration service. It handles the complex tasks of placing containers across a cluster of virtual machines, monitoring their health, and maintaining the desired number of containers to support your application's demands. Think of ECS as a conductor coordinating an orchestra – ensuring that each container (musician) plays its part at the right time and in harmony with the others.

### Launch Types: Fargate vs EC2

AWS offers two primary ways to run your containers: Fargate and EC2. Fargate is a serverless approach where you don't have to worry about the underlying infrastructure. It's like having a managed hosting service that takes care of all the infrastructure details for you. You simply specify the needs of your container and AWS takes care of everything else.

EC2, on the other hand, provides more control over your infrastructure. It's similar to having your own dedicated servers but with the flexibility of the cloud. This approach is especially valuable if you need specific instance types or have unique requirements for the hosts running your containers.

### Container Architecture Components

The ECS architecture consists of several key components that work together. 

- **Task Definitions** serve as blueprints for your applications, specifying everything from memory allocations to environment variables. 
- **Task** is the instantiation of a task definition inside a cluster. You can run a standalone task, or you can run a task as part of a service.
- **Services** ensure your tasks maintain high availability, automatically replacing failed containers and integrating with load balancers for traffic distribution.
- **Cluster** is a logical grouping of tasks or services. When your tasks run on Fargate, your cluster resources are also managed by Fargate.
- **Task execution role** grants the ECS container and Fargate agents permission to make AWS API calls on your behalf. For example, to pull a container image from an Amazon ECR private repository
- **Task role** can be associated to an ECS task to grant permissions to use other AWS services. he task role is required when your application accesses other AWS services, such as Amazon S3.

### Container Images: Using Public ECR

While Docker Hub is commonly used for public images, it has rate limits for anonymous users which can cause deployment failures. Instead, use AWS Public ECR which doesn't have these limitations. For example, instead of:
```typescript
image: "nginx:latest" // Docker Hub image
```

Use the AWS Public ECR equivalent:
```typescript
image: "public.ecr.aws/nginx/nginx:latest" // AWS Public ECR image
```

This ensures reliable deployments even without authentication. AWS Public ECR also provides better availability and faster pull times within AWS infrastructure.

For a list of official images on AWS Public ECR, visit the [AWS Public ECR Gallery](https://gallery.ecr.aws/).

## Architecture

In this lab, we'll build:

1. VPC with public and private subnets
2. ECS Cluster using Fargate
3. Task Definition for nginx container
4. ECS Service

![ECS Basic Architecture](../../media/lab_1_arch.drawio.svg)

## Prerequisites

Make sure you've completed Lab 0 and have:
- Pulumi project initialized
- AWS credentials configured
