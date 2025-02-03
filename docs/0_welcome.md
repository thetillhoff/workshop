# AWS Workshop

![Welcome to this AWS Workshop](media/welcome.png)


## Introduction

Welcome to this AWS Workshop! It is designed for developers who want to learn about container orchestration, load balancing, databases, lambdas 
<!-- TODO update this later -->
and content delivery on AWS. Through the included hands-on labs, you'll build a containerized application infrastructure using aws-cdk.


## Target Audience

## How to Use This Guide

This workshop is structured into several labs, each focusing on a specific AWS service or concept. Each lab contains:

- An introduction to the topic
- Step-by-step instructions
- Hands-on exercises
- Additional resources for further learning

Navigate through the labs in order, as each builds upon the previous one. Use the sidebar to move between sections.


<!-- TODO change or remove this
## Project Overview

This guide takes you beyond the basics of AWS, focusing on building modern containerized applications. Through the hands-on labs, you'll create a sophisticated cloud infrastructure using Amazon ECS, Application Load Balancers, and CloudFront, all orchestrated with Pulumi's infrastructure as code. You'll learn how to deploy containerized applications, manage container registries, implement load balancing, and optimize content delivery. This workshop builds upon fundamental AWS knowledge, guiding you through the practical implementation of container orchestration, high availability patterns, and scalable architectures. By the end of this workshop, you'll have hands-on experience building and deploying containerized applications on AWS, preparing you for real-world cloud architecture challenges. -->


## Prerequisites

- Basic understanding of AWS, commandline and containerization concepts
- Familiarity with Docker
- AWS account with appropriate permissions
- Docker installed
- Node.js (v22 recommended)
- AWS CLI version 2 installed
- curl or Postman installed
- jq installed (optional)


## How to use this workshop

The topics covered by this workshop are the first level chapters.
Each topic has multiple hands-on steps, which are the second level chapters.
Each step contains instructions, and a codebase containing the end-state.

If you get stuck during any of the steps, you can always check the end-state to see what you should have at the end of the particular step.
To see the difference between your current state and the end-state, you can use for example `diff -Nur --exclude=node_modules task-service goal-step-2/task-service`.

To be able to `diff`, you'll need to check out this repository locally.

It's recommended to start with the workshop from the root folder of this repository.

When this workshop describes filepaths, like `cdk/package.json`, they're always relative to that path.
