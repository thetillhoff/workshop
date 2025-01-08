# Lab 5: Setting up CloudFront

## Step 1: Create CloudFront Distribution

Add to your existing `index.ts`:
```typescript
// Create CloudFront distribution
const distribution = new aws.cloudfront.Distribution("workshop-cdn", {
  enabled: true,
  defaultCacheBehavior: {
    allowedMethods: [
      "DELETE",
      "GET",
      "HEAD",
      "OPTIONS",
      "PATCH",
      "POST",
      "PUT",
    ],
    cachedMethods: ["GET", "HEAD"],
    targetOriginId: "ALB",
    viewerProtocolPolicy: "redirect-to-https",
    forwardedValues: {
      queryString: true,
      cookies: {
        forward: "all",
      },
    },
    minTtl: 0,
    defaultTtl: 3600,
    maxTtl: 86400,
  },
  restrictions: {
    geoRestriction: {
      restrictionType: "none",
    },
  },
  viewerCertificate: {
    cloudfrontDefaultCertificate: true,
  },
  origins: [
    {
      domainName: alb.dnsName,
      originId: "ALB",
      customOriginConfig: {
        httpPort: 80,
        httpsPort: 443,
        originProtocolPolicy: "http-only",
        originSslProtocols: ["TLSv1.2"],
      },
    },
  ],
});
// Export CloudFront domain
export const cloudfrontDomain = distribution.domainName;
```

## Verify the Deployment

1. **Deploy the Changes**:
```bash
pulumi up
```

2. **Verify in AWS Console**:
   - Navigate to CloudFront
   - Check distribution status
   - Test the application through CloudFront URL with HTTPS

## Step 2: Add a custom error page served from an S3 bucket

Add an S3 bucket and a custom error page served from it before the CloudFront distribution:

```typescript
// Create S3 bucket for error pages
const errorPagesBucket = new aws.s3.BucketV2("error-pages", {
  forceDestroy: true,
});

// Block all public access
new aws.s3.BucketPublicAccessBlock("error-pages-public-access", {
  bucket: errorPagesBucket.id,
  blockPublicAcls: true,
  blockPublicPolicy: true,
  ignorePublicAcls: true,
  restrictPublicBuckets: true,
});

// Upload error page to S3
new aws.s3.BucketObject("404-page", {
  bucket: errorPagesBucket.id,
  key: "404.html",
  content: `
<!DOCTYPE html>
<html>
<head>
  <title>Page Not Found</title>
</head>
<body>
  <h1>404 - Page Not Found</h1>
  <p>This error page is served from an S3 bucket.</p>
</body>
</html>
  `,
  contentType: "text/html",
});
```

Update the CloudFront distribution to use the error page by adding an Origin Access Control:

```typescript
// Create Origin Access Control for S3
const oac = new aws.cloudfront.OriginAccessControl("error-pages-oac", {
  description: "OAC for error pages",
  originAccessControlOriginType: "s3",
  signingBehavior: "always",
  signingProtocol: "sigv4",
});
```

Update the CloudFront distribution configuration:

```typescript
// Update CloudFront distribution configuration
const distribution = new aws.cloudfront.Distribution("workshop-cdn", {
    // ... existing configuration ...
  origins: [
    {
      domainName: alb.dnsName,
      originId: "ALB",
      customOriginConfig: {
        httpPort: 80,
        httpsPort: 443,
        originProtocolPolicy: "http-only",
        originSslProtocols: ["TLSv1.2"],
      },
    },
    {
      domainName: errorPagesBucket.bucketRegionalDomainName,
      originId: "ErrorPages",
      originAccessControlId: oac.id,
    },
  ],
  orderedCacheBehaviors: [
    {
      pathPattern: "/404.html",
      targetOriginId: "ErrorPages",
      allowedMethods: ["GET", "HEAD"],
      cachedMethods: ["GET", "HEAD"],
      viewerProtocolPolicy: "redirect-to-https",
      forwardedValues: {
        queryString: false,
        headers: [],
        cookies: {
          forward: "none",
        },
      },
    },
  ],
  customErrorResponses: [
    {
      errorCode: 404,
      responseCode: 404,
      responsePagePath: "/404.html",
      errorCachingMinTtl: 300,
    },
  ],
});
```

Add a bucket policy to allow CloudFront to access the error page:

```typescript
// Add bucket policy for CloudFront access
new aws.s3.BucketPolicy("error-pages-policy", {
  bucket: errorPagesBucket.id,
  policy: pulumi
    .all([errorPagesBucket.arn, distribution.arn])
    .apply(([bucketArn, distributionArn]) =>
      JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "cloudfront.amazonaws.com",
            },
            Action: "s3:GetObject",
            Resource: `${bucketArn}/*`,
            Condition: {
              StringEquals: {
                "AWS:SourceArn": distributionArn,
              },
            },
          },
        ],
      })
    ),
});
```

According to the best practices, the error page should be served via cloudfront and not directly from the S3 bucket. The bucket itself is private and only accessible via the CloudFront distribution.


## Verify the Deployment

1. **Deploy the Changes**:
```bash
pulumi up
```

2. **Verify Error Pages**:
   - Test the error pages by adding a random path to the CloudFront URL
