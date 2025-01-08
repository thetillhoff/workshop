# Lab 5: Global Content Delivery with CloudFront

## Overview

In this lab, you'll learn how to implement global content delivery using Amazon CloudFront. We'll build upon our load-balanced ECS infrastructure from previous labs, adding a content delivery network to improve performance and security worldwide.

## Key Concepts

- **Edge Locations**: Distributed points of presence that cache content closer to users
- **Regional Edge Caches**: Larger caches that sit between edge locations and origins
- **Origin Servers**: Your application's source content (in our case, the ALB)
- **Cache Behaviors**: Rules that control how CloudFront handles different types of requests
- **Origin Access Control**: A security feature that controls how CloudFront can access your origin
- **Custom Error Pages**: Tailored responses for different error scenarios
- **AWS Shield Standard**: Built-in protection against common web vulnerabilities

## Architecture

We'll extend our Lab 4 architecture by adding:
1. CloudFront distribution with ALB as origin
2. SSL certificate for the distribution
3. Custom error handling

For reference on AWS global infrastructure and edge locations, see:

![CloudFront Architecture](../../media/lab_5_arch.drawio.svg)