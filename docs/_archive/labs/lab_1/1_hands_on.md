# Lab 1: Hands-on ECS Deployment

## Step 1: Create the VPC Infrastructure

First, let's set up our networking infrastructure. Add the following to your `index.ts`:

```typescript
import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
// Create VPC
const vpc = new aws.ec2.Vpc("workshop-vpc", {
  cidrBlock: "10.0.0.0/16",
  enableDnsHostnames: true,
  enableDnsSupport: true,
});
// Create Internet Gateway
const internetGateway = new aws.ec2.InternetGateway("workshop-igw", {
  vpcId: vpc.id,
});
// Create Public Subnets in different AZs
const publicSubnet1 = new aws.ec2.Subnet("workshop-public-1", {
  vpcId: vpc.id,
  cidrBlock: "10.0.1.0/24",
  availabilityZone: "eu-central-1a",
  mapPublicIpOnLaunch: true,
});
const publicSubnet2 = new aws.ec2.Subnet("workshop-public-2", {
  vpcId: vpc.id,
  cidrBlock: "10.0.2.0/24",
  availabilityZone: "eu-central-1b",
  mapPublicIpOnLaunch: true,
});
// Create NAT Gateway (in public subnet)
const eip = new aws.ec2.Eip("nat-eip", {});
const natGateway = new aws.ec2.NatGateway("nat-gateway", {
  allocationId: eip.id,
  subnetId: publicSubnet1.id,
});
// Create Private Subnets
const privateSubnet1 = new aws.ec2.Subnet("workshop-private-1", {
  vpcId: vpc.id,
  cidrBlock: "10.0.3.0/24",
  availabilityZone: "eu-central-1a",
});
const privateSubnet2 = new aws.ec2.Subnet("workshop-private-2", {
  vpcId: vpc.id,
  cidrBlock: "10.0.4.0/24",
  availabilityZone: "eu-central-1b",
});
// Create Route Tables and Routes
const publicRouteTable = new aws.ec2.RouteTable("workshop-public-rt", {
  vpcId: vpc.id,
  routes: [
    {
      cidrBlock: "0.0.0.0/0",
      gatewayId: internetGateway.id,
    },
  ],
});
// Associate Public Subnets with Public Route Table
new aws.ec2.RouteTableAssociation("workshop-public-rt-assoc-1", {
  subnetId: publicSubnet1.id,
  routeTableId: publicRouteTable.id,
});
new aws.ec2.RouteTableAssociation("workshop-public-rt-assoc-2", {
  subnetId: publicSubnet2.id,
  routeTableId: publicRouteTable.id,
});
const privateRouteTable = new aws.ec2.RouteTable("workshop-private-rt", {
  vpcId: vpc.id,
  routes: [
    {
      cidrBlock: "0.0.0.0/0",
      natGatewayId: natGateway.id,
    },
  ],
});
// Associate Private Subnets with Private Route Table
new aws.ec2.RouteTableAssociation("workshop-private-rt-assoc-1", {
  subnetId: privateSubnet1.id,
  routeTableId: privateRouteTable.id,
});
new aws.ec2.RouteTableAssociation("workshop-private-rt-assoc-2", {
  subnetId: privateSubnet2.id,
  routeTableId: privateRouteTable.id,
});
// Create ECS Cluster
const cluster = new aws.ecs.Cluster("workshop-cluster", {
  name: "workshop-cluster",
});
// Create Task Execution Role
const taskExecutionRole = new aws.iam.Role("ecs-task-execution-role", {
  assumeRolePolicy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Action: "sts:AssumeRole",
        Effect: "Allow",
        Principal: {
          Service: "ecs-tasks.amazonaws.com",
        },
      },
    ],
  }),
});
new aws.iam.RolePolicyAttachment("ecs-task-execution-role-policy", {
  role: taskExecutionRole.name,
  policyArn:
    "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
});
```

## Step 3: Create Task Definition and Service

Add the following code to create the task definition and ECS service:
```typescript
// Create CloudWatch Log Group
const logGroup = new aws.cloudwatch.LogGroup("workshop-log-group", {
  name: "/ecs/workshop-app",
  retentionInDays: 7,
});

// Create Task Definition
const containerName = "workshop-app";
const taskDefinition = new aws.ecs.TaskDefinition("workshop-task", {
  family: "workshop-app",
  cpu: "256",
  memory: "512",
  networkMode: "awsvpc",
  requiresCompatibilities: ["FARGATE"],
  executionRoleArn: taskExecutionRole.arn,
  containerDefinitions: pulumi.jsonStringify([
    {
      name: containerName,
      image: "public.ecr.aws/nginx/nginx:latest",
      portMappings: [
        {
          containerPort: 80,
          protocol: "tcp",
        },
      ],
      logConfiguration: {
        logDriver: "awslogs",
        options: {
          "awslogs-group": logGroup.name,
          "awslogs-region": "eu-central-1",
          "awslogs-stream-prefix": "ecs",
        },
      },
    },
  ]),
});

// Create Security Group for ECS Tasks
const taskSg = new aws.ec2.SecurityGroup("task-sg", {
  vpcId: vpc.id,
});
new aws.vpc.SecurityGroupIngressRule("task-sg-allow-http-ipv4", {
  securityGroupId: taskSg.id,
  cidrIpv4: "0.0.0.0/0",
  ipProtocol: "tcp",
  fromPort: 80,
  toPort: 80,
});
new aws.vpc.SecurityGroupEgressRule("task-sg-allow-all-traffic-ipv4", {
  securityGroupId: taskSg.id,
  cidrIpv4: "0.0.0.0/0",
  ipProtocol: "-1",
});

// Create ECS Service
const service = new aws.ecs.Service("workshop-service", {
  cluster: cluster.id,
  taskDefinition: taskDefinition.arn,
  desiredCount: 2,
  launchType: "FARGATE",
  networkConfiguration: {
    subnets: [privateSubnet1.id, privateSubnet2.id],
    // securityGroups: [taskSg.id],
    assignPublicIp: false,
  },
  waitForSteadyState: true,
  deploymentCircuitBreaker: {
    enable: true,
    rollback: false,
  },
});
```
- **waitForSteadyState**: makes Pulumi wait until your ECS service deployment is fully complete before moving on. This ensures that your infrastructure deployment only succeeds when all tasks are actually running and healthy.
- **Deployment Circuit Breaker**: determines whether a service deployment will fail if the service can't reach a steady state. If it is turned on, a service deployment will transition to a failed state and stop launching new tasks.
  - [Learn more](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-circuit-breaker.html)

## Verify the Deployment

1. **Deploy the Infrastructure**:
```bash
pulumi up
```

2. **Verify in AWS Console**:
Navigate to the ECS service in the AWS Console. Check that your ECS service status is "ACTIVE" and verify that you have the expected number of tasks running in your service. You can find detailed task information, including their current status and any recent events, in the Tasks tab of your ECS service.

