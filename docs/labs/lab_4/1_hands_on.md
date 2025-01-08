# Lab 4: Implementing Auto Scaling and Monitoring

## Prerequisites

## Step 1: Configure Auto Scaling

Add to your existing `index.ts`:
```typescript
// Create Auto Scaling Target
const scalableTarget = new aws.appautoscaling.Target(
  "workshop-scaling-target",
  {
    maxCapacity: 5,
    minCapacity: 2,
    resourceId: pulumi.interpolate`service/${cluster.name}/${service.name}`,
    scalableDimension: "ecs:service:DesiredCount",
    serviceNamespace: "ecs",
  }
);
// Create CPU-based Scaling Policy
const cpuPolicy = new aws.appautoscaling.Policy("cpu-policy", {
  policyType: "TargetTrackingScaling",
  resourceId: scalableTarget.resourceId,
  scalableDimension: scalableTarget.scalableDimension,
  serviceNamespace: scalableTarget.serviceNamespace,
  targetTrackingScalingPolicyConfiguration: {
    predefinedMetricSpecification: {
      predefinedMetricType: "ECSServiceAverageCPUUtilization",
    },
    targetValue: 20.0,
    scaleInCooldown: 60, // 1 minute
    scaleOutCooldown: 60, // 1 minute
  },
});
```

## Verify the Deployment

1. **Deploy the Changes**:
```bash
pulumi up
```

2. **Verify in AWS Console**:
   Check ECS service auto scaling configuration in the AWS Console.

3. **Test Scaling**:
   - install [hey](https://github.com/rakyll/hey):

   ```bash
   brew install hey # for MacOS
   ```
   
   - run the following command to generate load:

   ```bash
   hey -z 4m http://$(pulumi stack output albDnsName)
   ```

   - observe the scaling in action
