# Lab 0: Setting Up Your Environment

This lab will guide you through setting up your development environment with Pulumi and AWS credentials. If you did the aws_fundamentals_workshop, you can skip this lab and use the project created in that workshop.

## Prerequisites

- AWS Account with appropriate permissions
- Node.js (version 14 or later)
- AWS CLI version 2 installed
- Docker installed locally

## AWS Credentials Setup

1. **Configure AWS CLI with IAM Identity Center**:
   Copy the exported credentials from the AWS SSO page for the account you want to use and paste them into your terminal.
   ```bash
   export AWS_ACCESS_KEY_ID="<KEY_ID>"
   export AWS_SECRET_ACCESS_KEY="<SECRET_ACCESS_KEY>"
   export AWS_SESSION_TOKEN="<SESSION_TOKEN>"
   ```

2. **Verify AWS Setup**:
   ```bash
   aws sts get-caller-identity
   ```

3. **Login to Pulumi**:
   ```bash
   pulumi login --local
   ```

4. **Create a new Pulumi project**:
   ```bash
   mkdir aws_advanced_workshop
   cd aws_advanced_workshop
   pulumi new aws-typescript
   ```
   Follow the prompts:
   - Project name: aws-advanced-workshop
   - Description: AWS Advanced Workshop with ECS, ALB, ECR, and CloudFront
   - Stack name: dev
   - AWS region: eu-central-1

5. **Export the Pulumi passphrase**:
   ```bash
   export PULUMI_CONFIG_PASSPHRASE="<passphrase>" # could be empty
   ```

Your environment is now ready for the workshop labs!
