# Lab 3: Container Registry Integration

## Overview

In this lab, you'll learn how to integrate Amazon Elastic Container Registry (ECR) to store and manage your container images. We'll build upon the load-balanced ECS infrastructure created in Lab 2.

## Key Concepts

### Amazon ECR
- **Private Registry**: Secure, scalable container image storage within your AWS account
- **Image Management**: Version control and lifecycle policies for container images
- **Security Features**: Image scanning, encryption, and IAM integration
- **ECS Integration**: Seamless deployment of images to ECS services
- **Image Policies**: Control image retention and cleanup

## Architecture

We'll extend our Lab 2 architecture by adding:
1. Private ECR repository for custom images
2. Your custom container image
3. Updated ECS task definitions

![ECR Architecture](../../media/lab_3_arch.drawio.svg)