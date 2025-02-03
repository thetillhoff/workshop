# Theory

In this lab, we'll learn how to optimize the cost of our AWS setup and how to autoscale our services.


## Cost Optimization on AWS

Cost optimization itself is a very broad topic, so we'll focus on the technical aspects of it.
The term itself is self-explanatory, but the actual implementation is not. So, in this theory section, we'll focus on some technical approaches to cost optimization.

In general, cost optimization on AWS can be broken down into two main fields:

1. Resource Efficiency
- Right Sizing, like choosing the right instance type
- Using spot instances and reserved capacity
- Optimizing storage and network usage
- Right-sizing containers and databases

2. Architecture Decisions  
- Selecting cost-effective service combinations
- Implementing proper auto-scaling that can scale down
- Using managed services vs self-hosted
- Designing for multi-AZ vs single-AZ tradeoffs


## Key technical approaches for AWS cost optimization

1. CPU Architecture Selection
- ARM-based Graviton processors (t4g, c7g) are ~20% cheaper than x86
- Example: t4g.medium costs $0.0336/hour vs t3.medium at $0.0416/hour
- Requires ARM-compatible container images

2. Spot Instances
- Up to 90% discount for interruptible workloads
- Best for stateless containers and batch processing
- Requires handling termination notices (2-minute warning)
- Example: ECS tasks with spot capacity providers

3. Instance Right-sizing
- Match vCPU/memory to actual utilization
- Use CloudWatch metrics to identify peak usage
- Example: Reducing from 1 vCPU to 0.5 vCPU for low-CPU services

4. Reserved Instances vs On-Demand
- Standard RIs: Fixed instance type, up to 72% savings
- Convertible RIs: Flexible instance family, ~54% savings
- Best for steady-state workloads like databases

5. Network Optimization
- Single NAT Gateway per VPC instead of per subnet
- Use VPC Endpoints for AWS services to avoid NAT costs
- Enable VPC Flow Logs only when needed for debugging

6. Storage Choices
- Use gp3 over gp2 for EBS volumes (20% cheaper)
- S3 Intelligent-Tiering for variable access patterns
- RDS storage autoscaling with proper thresholds

7. Container Optimization
- Multi-stage Docker builds for smaller images
- ECR lifecycle policies to clean old images
- Share container layers between similar images


## Common Technical Pitfalls:
- Using x86 instead of ARM for compute
- Using on-demand compute for predictable workloads
- Over-provisioning of resources
- Running multi-AZ in non-production
- Unnecessary IOPS (disk-IO) provisioning
- Never deleting unused resources, like ECR images, EC2 & RDS instances, snapshots, or even logs
