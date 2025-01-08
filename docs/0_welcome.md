# AWS Advanced Workshop: Container Orchestration and Delivery

![Welcome to AWS Advanced Workshop](media/welcome.png)

## Introduction

Welcome to the AWS Advanced Workshop! This workshop is designed for developers who want to learn about container orchestration, load balancing, and content delivery on AWS. Through hands-on labs, you'll build a containerized application infrastructure using Pulumi.

## How to Use This Guide

This workshop is structured into several labs, each focusing on a specific AWS service or concept. Each lab contains:

- An introduction to the topic
- Step-by-step instructions
- Hands-on exercises
- Additional resources for further learning

Navigate through the labs in order, as each builds upon the previous one. Use the sidebar to move between sections.

## Project Overview

This guide takes you beyond the basics of AWS, focusing on building modern containerized applications. Through the hands-on labs, you'll create a sophisticated cloud infrastructure using Amazon ECS, Application Load Balancers, and CloudFront, all orchestrated with Pulumi's infrastructure as code. You'll learn how to deploy containerized applications, manage container registries, implement load balancing, and optimize content delivery. This workshop builds upon fundamental AWS knowledge, guiding you through the practical implementation of container orchestration, high availability patterns, and scalable architectures. By the end of this workshop, you'll have hands-on experience building and deploying containerized applications on AWS, preparing you for real-world cloud architecture challenges.

## Prerequisites

- Basic understanding of AWS and containerization concepts
- Familiarity with Docker
- AWS account with appropriate permissions
- Node.js (version 14 or later)
- Docker installed locally
- AWS CLI version 2 installed and configured
- Previous experience with Pulumi (completion of AWS Fundamentals Workshop recommended)

## Workshop Architecture Evolution

Throughout this workshop, we'll build our architecture in stages:

1. **ECS Fargate Setup**: Basic ECS cluster with Fargate launch type
   ![ECS Setup Architecture](media/lab_1_arch.drawio.svg)

2. **Load Balancer Integration**: Adding ALB and target groups
   ![ALB Integration Architecture](media/lab_2_arch.drawio.svg)

3. **Container Registry**: Building and pushing custom images to ECR
   ![ECR Integration Architecture](media/lab_3_arch.drawio.svg)

4. **Autoscaling**: Adding autoscaling to the ECS cluster
   ![Complete Architecture](media/lab_4_arch.drawio.svg)

5. **Content Delivery**: Adding CloudFront distribution
   ![Complete Architecture](media/lab_5_arch.drawio.svg)

6. **Message Queuing**: Adding SQS with a lambda consumer
   ![Complete Architecture](media/lab_6_arch.drawio.svg)

### Labs Overview

#### 1. Container Orchestration with ECS
- **Introduction to containerization and ECS concepts**
- **Understanding Fargate vs EC2 launch types**
- **Container networking and security**
- **Hands-On: Deploy containerized applications using Pulumi**
  - Set up ECS cluster and VPC
  - Define task definitions and services
  - Configure container networking

#### 2. Load Balancing and Service Discovery
- **Application Load Balancer architecture**
- **Target groups and health checks**
- **SSL/TLS termination**
- **Hands-On: Implement load balancing with Pulumi**
  - Create ALB and target groups
  - Configure listeners and rules
  - Integrate with ECS services

#### 3. Container Registry and Image Management
- **Introduction to Amazon ECR**
- **Docker image best practices**
- **Image lifecycle policies**
- **Hands-On: Build and deploy custom containers**
  - Create ECR repositories
  - Build and tag Docker images
  - Push images to ECR
  - Update ECS services

#### 4. Auto Scaling and Monitoring
- **Scaling patterns and strategies**
- **CloudWatch metrics and alarms**
- **Capacity planning**
- **Hands-On: Implement auto scaling**
  - Configure scaling policies
  - Set up CloudWatch alarms
  - Monitor application metrics
  - Test scaling behavior

#### 5. Content Delivery and Edge Computing
- **CloudFront architecture and concepts**
- **Cache behaviors and policies**
- **Edge computing patterns**
- **Hands-On: Implement CDN with Pulumi**
  - Create CloudFront distributions
  - Configure origins and behaviors
  - Set up cache policies
  - Implement SSL/TLS

#### 6. Message Processing
- **Event-driven architecture patterns**
- **Message queue concepts**
- **Dead letter queues**
- **Hands-On: Implement message processing**
  - Create SQS queues
  - Configure message retention
  - Implement Lambda consumers
  - Set up monitoring

## Workshop Duration

This is a self-paced workshop. The time ranges provided for each lab are estimates, and you should feel free to spend more time on areas you find challenging or interesting. Remember to take breaks as needed.

Total estimated time: 4-6 hours

- Lab 1: 45-60 minutes
- Lab 2: 30-45 minutes
- Lab 3: 45-60 minutes
- Lab 4: 30-45 minutes
- Lab 5: 45-60 minutes
- Lab 6: 45-60 minutes

Note: Actual duration may vary based on individual pace and prior experience.

## Conclusion

By the end of this workshop, you will have built a production-ready containerized application infrastructure on AWS. You'll understand how to orchestrate containers, implement load balancing, manage container images, and optimize content delivery. The hands-on experience with Pulumi will prepare you for implementing Infrastructure as Code in real-world scenarios.

### Next Steps

To continue your AWS learning journey:

1. Explore the AWS documentation for services covered in this workshop
2. Try applying these concepts to your own projects
3. Consider pursuing AWS certifications, starting with the AWS Certified Cloud Practitioner

Let's begin your journey into advanced AWS services!
