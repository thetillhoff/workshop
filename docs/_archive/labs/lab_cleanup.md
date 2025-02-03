# Clean-Up: Deleting AWS Resources

## Overview

After completing the labs, it's important to clean up the resources you have created to avoid incurring any unnecessary costs. This clean-up guide will help you delete all the AWS resources created during Labs.

## Steps to Clean Up

### 1. Delete the Resources Using Pulumi

The simplest way to delete all resources created by your Pulumi stack is to destroy the stack itself. This will automatically clean up all resources managed by Pulumi.

1. **Open Your Terminal**

   Navigate to the root directory of your Pulumi project.

2. **Run the Pulumi Destroy Command**

   Run the following command to destroy the stack:

   ```bash
   pulumi destroy
   ```

   Confirm the deletion when prompted. This will delete all resources created by Pulumi.

### 2. Manual Verification (Optional)

To ensure all resources are properly deleted, you can manually verify the deletion using the AWS Management Console and CLI.

**AWS Management Console**:

- **VPC**: Navigate to the VPC dashboard and verify that the VPC and associated resources (subnets, route tables, security groups) are deleted.
- **ALB**: Navigate to the EC2 Load Balancerdashboard and verify that the Load Balancer is no longer listed.
- **Cloudfront**: Navigate to the Cloudfront dashboard and verify that the distribution is deleted.
- **S3**: Navigate to the S3 dashboard and verify that the bucket is deleted.
- **ECS**: Navigate to the ECS dashboard and verify that the cluster is deleted.
- **SQS**: Navigate to the SQS dashboard and verify that the queue and the dead letter queue are deleted.
- **Lambda**: Navigate to the Lambda dashboard and verify that the function is deleted.

### 3. Check for Remaining Resources (Recommended)

After completing the above steps, it's a good practice to double-check for any remaining resources:

- Review the AWS Cost Explorer to ensure there are no unexpected charges.
- Check other AWS services not mentioned above (e.g., CloudWatch logs) to ensure complete cleanup.

## Summary

By following these steps, you will ensure that all resources created during the labs are properly cleaned up, avoiding unnecessary costs. The `pulumi destroy` command is the primary method for clean-up, but manual verification steps are provided for completeness. Always double-check your AWS account to confirm all resources have been removed.
