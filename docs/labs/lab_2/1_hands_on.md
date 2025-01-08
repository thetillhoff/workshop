# Lab 2: Adding Application Load Balancer

## Step 1: Create ALB Security Group

Add the following code to your existing `index.ts` before the `taskSg`:
```typescript
// Create Security Group for ALB
const albSg = new aws.ec2.SecurityGroup("alb-sg", {
  vpcId: vpc.id,
  description: "Security group for ALB",
});

new aws.vpc.SecurityGroupIngressRule("alb-sg-allow-http-ipv4", {
  securityGroupId: albSg.id,
  cidrIpv4: "0.0.0.0/0",
  ipProtocol: "tcp",
  fromPort: 80,
  toPort: 80,
});
/*
        cidrIpv4       : "10.0.0.0/16"
        fromPort       : 80
        ipProtocol     : "tcp"
        securityGroupId: "sg-0360bbf84735050d1"
        toPort         : 80
*/
new aws.vpc.SecurityGroupEgressRule("alb-sg-allow-all-traffic-ipv4", {
  securityGroupId: albSg.id,
  cidrIpv4: "0.0.0.0/0",
  ipProtocol: "-1",
});
```

## Step 2: Create ALB and Target Group
Add this code before the ECS Service:
```typescript
// Create Target Group
const targetGroup = new aws.lb.TargetGroup("workshop-tg", {
  port: 80,
  protocol: "HTTP",
  targetType: "ip",
  vpcId: vpc.id,
  healthCheck: {
    enabled: true,
    path: "/",
    healthyThreshold: 2,
    unhealthyThreshold: 10,
  },
});
// Create Application Load Balancer
const alb = new aws.lb.LoadBalancer("workshop-alb", {
  internal: false,
  loadBalancerType: "application",
  securityGroups: [albSg.id],
  subnets: [publicSubnet1.id, publicSubnet2.id],
});
// Create ALB Listener
new aws.lb.Listener("workshop-listener", {
  loadBalancerArn: alb.arn,
  port: 80,
  protocol: "HTTP",
  defaultActions: [
    {
      type: "forward",
      targetGroupArn: targetGroup.arn,
    },
  ],
});
```

## Step 3: Update ECS Service and its Security Group
```typescript
// Update ECS Task Security Group Ingress Rule to allow traffic from ALB
new aws.vpc.SecurityGroupIngressRule("task-sg-allow-http-ipv4", {
  securityGroupId: taskSg.id,
  ipProtocol: "tcp",
  fromPort: 80,
  toPort: 80,
  referencedSecurityGroupId: albSg.id,
});
```
```typescript
// Update ECS Service with Load Balancer
const service = new aws.ecs.Service("workshop-service", {
  cluster: cluster.id,
  taskDefinition: taskDefinition.arn,
  desiredCount: 2,
  launchType: "FARGATE",
  networkConfiguration: {
    subnets: [privateSubnet1.id, privateSubnet2.id],
    securityGroups: [taskSg.id],
    assignPublicIp: false,
  },
  waitForSteadyState: true,
  deploymentCircuitBreaker: {
    enable: true,
    rollback: false,
  },
  loadBalancers: [
    {
      targetGroupArn: targetGroup.arn,
      containerName: containerName,
      containerPort: 80,
    },
  ],
});
// Export ALB DNS name
export const albDnsName = alb.dnsName;
```

## Verify the Deployment

1. **Deploy the Infrastructure**:
```bash
pulumi up
```

Navigate to the EC2 service in the AWS Console and select Load Balancers from the left navigation menu. Verify that your Application Load Balancer shows an "active" state in the console. Then, check your target group to ensure it has healthy targets registered.

To test your application, copy the ALB DNS name from your Pulumi outputs. Open this DNS name in a web browser, and you should see the default nginx welcome page displayed, confirming that your load balancer is properly routing traffic to your containers.
