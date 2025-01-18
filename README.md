# Serverless Project Setup Guide

This guide explains how to create, run, and deploy a simple serverless project using the Serverless Framework with AWS Node.js.

## Method 1: Using Serverless Create Command

```bash
serverless create --template aws-nodejs --path .
```

> **Note**: If this command fails, it might be due to:
> - Serverless Framework not being installed globally
> - Version compatibility issues
> - Insufficient permissions

In case of issues, proceed with Method 2.

## Method 2: Manual Setup

1. Initialize a Node.js project:
```bash
npm init -y
```

2. Create the required files:
```bash
touch serverless.yml
touch handler.js
```

3. Configure your `serverless.yml`:
```yaml
service: my-serverless-service  # Replace with your service name

provider:
  name: aws
  runtime: nodejs20.x
  region: ap-south-1
  stage: ${opt:stage, 'dev'}

functions:
  currentTime:
    handler: handler.endpoint
    events:
      - http:
          path: /time
          method: GET

plugins:
  - serverless-offline
```

4. Create your handler function in `handler.js`:
```javascript
'use strict';

module.exports.endpoint = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello, the current time is ${new Date().toTimeString()}.`,
    }),
  };
};
```

## Local Development

### Option 1: Direct Function Invocation
```bash
serverless invoke local --function currentTime
```

### Option 2: Running a Local Server

1. Install the serverless-offline plugin:
```bash
npm install serverless-offline --save-dev
# or
serverless plugin install --name serverless-offline
```

2. Start the local server:
```bash
serverless offline start
```

## Deployment

### Deploy to AWS
```bash
serverless deploy
```
After deployment, you can verify the stack creation in AWS CloudFormation.

### Remove Deployment
To remove all deployed resources:
```bash
serverless remove
```

## Prerequisites
- Node.js installed
- AWS CLI configured with appropriate credentials
- Serverless Framework installed globally (`npm install -g serverless`)
- AWS account with appropriate permissions

## Best Practices
- Always review the generated CloudFormation stack before deployment
- Use environment variables for sensitive information
- Test your functions locally before deployment
- Follow AWS regional compliance requirements when choosing your region