# Lab 4: Auto Scaling and Monitoring

## Overview

In this lab, you'll learn how to implement auto scaling for your ECS services. We'll build upon the containerized infrastructure created in Lab 3, adding automatic scaling capabilities.

## Key Concepts

### Application Auto Scaling
- **Target Tracking**: Automatically adjusts capacity based on a target metric value
- **Step Scaling**: Responds to metrics with varying intensity based on threshold breaches
- **Scheduled Scaling**: Predictably adjusts capacity based on known usage patterns
- **Cooldown Periods**: Prevents rapid scaling fluctuations and provides stability

## Architecture

We'll extend our Lab 3 architecture by adding:
1. Application Auto Scaling targets and policies

![Auto Scaling Architecture](../../media/lab_4_arch.drawio.svg)