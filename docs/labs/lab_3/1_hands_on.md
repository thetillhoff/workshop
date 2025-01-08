# Lab 3: Building and Deploying Custom Images

## Step 1: Create ECR Repository

Add this code to the beginning of your `index.ts`:
```typescript
// Create ECR Repository
const repository = new aws.ecr.Repository("workshop-app", {
    name: "workshop-app",
    imageScanningConfiguration: {
        scanOnPush: true,
    },
    forceDelete: true,
});

// Export the repository URL
export const repositoryUrl = repository.repositoryUrl;
```

And deploy the changes:

```bash
pulumi up
```

## Step 2: Build and Push the Image

Create and prepare an application directory:

```bash
mkdir application
cd application
yarn init -y
yarn add express @types/express typescript ts-node
```

Create a `tsconfig.json` file:
```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

Create `src/app.ts`:
```typescript
import express from 'express';

const app = express();
const port = 80;

app.get('/', (req, res) => {
  res.json({ message: 'Hello from ECS!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

Create a `Dockerfile`:
```dockerfile
FROM --platform=linux/amd64 node:18-alpine

WORKDIR /usr/app

COPY . .
RUN yarn && yarn add typescript tsc ts-node && yarn build

EXPOSE 80
CMD ["node", "dist/app.js"]
```

Update `package.json` scripts:
```json
{
...
  "scripts": {
    "build": "tsc",
    "start": "node dist/app.js"
  }
...
}
```

2. **Build and Push Commands**:
Get ECR login credentials (make sure you exported the `PULUMI_CONFIG_PASSPHRASE` environment variable):

```bash
aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin $(pulumi stack output repositoryUrl)
```

Build the image
```bash
docker build -t workshop-app .
```

Tag the image
```bash
docker tag workshop-app:latest $(pulumi stack output repositoryUrl):latest
```

Push to ECR
```bash
docker push $(pulumi stack output repositoryUrl):latest
```

## Step 3: Update ECS Task Definition

Update your task definition in `index.ts` to use the custom image:
```typescript
// Update Task Definition with custom image
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
      image: pulumi.interpolate`${repository.repositoryUrl}:latest`,
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
```

## Step 4: Deploy and Verify

1. **Deploy the Changes**:
```bash
cd ../ # go back to the root of the project
pulumi up
```

2. **Verify the Deployment**:
Navigate to the Amazon ECR service in the AWS Console to verify that your container image was successfully pushed to your repository. Then, go to the ECS service to check your running tasks and ensure they're using the new image. Finally, access your application by opening the ALB DNS name (which you configured in Lab 2) in your web browser - you should see the "Hello from ECS!" message, confirming that your custom container is running properly.
