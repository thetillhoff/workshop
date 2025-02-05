import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import {
  AwsLogDriver,
  Cluster,
  ContainerImage,
  PropagatedTagSource,
  Secret,
} from "aws-cdk-lib/aws-ecs";
import { Connections, SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { ApplicationLoadBalancedFargateService } from "aws-cdk-lib/aws-ecs-patterns";
import { Platform } from "aws-cdk-lib/aws-ecr-assets";
import { ISecret } from "aws-cdk-lib/aws-secretsmanager";
interface EcsStackProps extends cdk.StackProps {
  vpc: Vpc;
  databaseConnections: Connections;
  databaseCredentialsSecret: ISecret;
}

export class EcsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: EcsStackProps) {
    super(scope, id, props);

    const cluster = new Cluster(this, "EcsCluster", {
      vpc: props?.vpc,
      enableFargateCapacityProviders: true,
    });

    const albFargateService = new ApplicationLoadBalancedFargateService(
      this,
      "TodoService",
      {
        cluster,
        cpu: 512,
        memoryLimitMiB: 1024,
        desiredCount: 2,
        taskImageOptions: {
          image: ContainerImage.fromAsset("../todo-service", {
            platform: Platform.LINUX_AMD64,
            exclude: ["node_modules"],
          }),
          containerPort: 3000,
          logDriver: new AwsLogDriver({
            streamPrefix: "ecs/todo-service",
          }),
          secrets: {
            DB_HOST: Secret.fromSecretsManager(
              props!.databaseCredentialsSecret,
              "host"
            ),
            DB_PORT: Secret.fromSecretsManager(
              props!.databaseCredentialsSecret,
              "port"
            ),
            DB_USERNAME: Secret.fromSecretsManager(
              props!.databaseCredentialsSecret,
              "username"
            ),
            DB_PASSWORD: Secret.fromSecretsManager(
              props!.databaseCredentialsSecret,
              "password"
            ),
            DB_NAME: Secret.fromSecretsManager(
              props!.databaseCredentialsSecret,
              "dbname"
            ),
          },
        },
        taskSubnets: {
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        },
        propagateTags: PropagatedTagSource.SERVICE,
      }
    );

    albFargateService.service.connections.allowToDefaultPort(
      props!.databaseConnections
    );

    albFargateService.targetGroup.configureHealthCheck({
      path: "/health",
    });
  }
}
