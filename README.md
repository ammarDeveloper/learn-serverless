# Variables Configuration Guide

This guide explains different methods to manage variables in your serverless project.

## Table of Contents
- [Serverless Variable References](#serverless-variable-references)
- [Environment Variables in serverless.yml](#environment-variables-in-serverlessyml)
- [Parameter Store Variables](#parameter-store-variables)
- [Secrets Manager Variables](#secrets-manager-variables)
- [Configuration Files](#configuration-files)
- [.env File Variables](#env-file-variables)
- [Function-Specific Variables](#function-specific-variables)

## Serverless Variable References

### The opt Variable

The `opt` variable allows you to reference command line options passed to the serverless command. It's commonly used for stage selection:

```yaml
provider:
  stage: ${opt:stage, 'dev'}  # Uses command line stage or defaults to 'dev'
```

Usage:
```bash
# Deploy to production stage
serverless deploy --stage prod

# Deploy to development stage (uses default)
serverless deploy
```

### Self References

The `self` variable lets you reference other values within your serverless.yml:

```yaml
provider:
  name: aws
  environment:
    TEST_VAR: TEST_VAR_VALUE-${self:provider.stage}
    ENV_VAR_USING_PLUGIN: ${env:SOME_VALUE}-${self:provider.name}
```

Common self references:
- `${self:service}`: References the service name
- `${self:provider.stage}`: References the current stage
- `${self:provider.region}`: References the configured region
- `${self:custom.someValue}`: References a value from the custom section

### Combined Variable References

You can combine different variable types:

```yaml
environment:
  DB_USERNAME_FILE: ${file(./config/config.${opt:stage, 'dev'}.json):username}
```

This combines:
- `opt` variable for stage selection
- File reference for configuration
- Property reference (`:username`)


## Environment Variables in serverless.yml

Basic environment variables can be defined directly in the `serverless.yml` file:

```yaml
environment:
  TEST_VAR: TEST_VAR_VALUE-${self:provider.stage}
```

The `${self:provider.stage}` syntax allows you to reference other values in your serverless.yml file. In this case, it appends the current stage (e.g., 'dev', 'prod') to the variable value.

## Parameter Store Variables

### Using AWS Systems Manager Parameter Store

Variables can be retrieved from AWS Parameter Store using the following syntax in `serverless.yml`:

```yaml
environment:
  DB_USERNAME_PS: ${ssm:/db_username_ps}
  DB_PASSWORD_PS: ${ssm:/db_password_ps}
```

### Creating Parameters in Parameter Store

Use the AWS CLI to create parameters:

```bash
aws ssm put-parameter \
  --name "/db_username_ps" \
  --value "your-username" \
  --type String \
  --region ap-south-1
```

Parameters can be of type:
- `String`: For plain text values
- `SecureString`: For encrypted sensitive data
- `StringList`: For comma-separated values

## Secrets Manager Variables

### Using AWS Secrets Manager

Secrets can be referenced in two ways:

1. Direct reference in custom variables:
```yaml
custom:
  DB_ADMIN_SM: ${ssm:/aws/reference/secretsmanager/db_admin_sm_1}

environment:
  DB_USERNAME_SM: ${self:custom.DB_ADMIN_SM}
  DB_PASSWORD_SM: ${self:custom.DB_ADMIN_SM}
```

### Creating Secrets

Use the AWS CLI to create secrets:

```bash
aws secretsmanager create-secret \
  --name "db_admin_sm_1" \
  --description "Database credentials" \
  --secret-string '{"username":"admin","password":"Password"}' \
  --region ap-south-1
```

## Configuration Files

### Using External Configuration Files

Variables can be loaded from stage-specific JSON configuration files:

```yaml
environment:
  DB_USERNAME_FILE: ${file(./config/config.${opt:stage, 'dev'}.json):username}
  DB_PASSWORD_FILE: ${file(./config/config.${opt:stage, 'dev'}.json):password}
```

Create stage-specific configuration files:
```json
// config/config.dev.json
{
  "username": "dev-user",
  "password": "dev-password"
}

// config/config.prod.json
{
  "username": "prod-user",
  "password": "prod-password"
}
```

## .env File Variables

### Method 1: Using dotenv Package

1. Install the required package:
```bash
npm install dotenv
```

2. Create a `.env` file:
```plaintext
SOME_VALUES='hello i am under water'
```

3. Load in your code:
```javascript
require('dotenv').config();
const envData = process.env.SOME_VALUES;
```

### Method 2: Using serverless-dotenv-plugin

1. Install the plugin:
```bash
npm install --save-dev serverless-dotenv-plugin
```

2. Add to plugins in `serverless.yml`:
```yaml
plugins:
  - serverless-dotenv-plugin
```

3. Reference environment variables:
```yaml
environment:
  ENV_VAR_USING_PLUGIN: ${env:SOME_VALUE}-${self:provider.name}
```

## Function-Specific Variables

You can define environment variables specific to individual functions:

```yaml
functions:
  user:
    handler: functions/user/user.post
    environment:
      TEST_VAR_FS: 'TEST_VARIABLE_FS'
```

These variables will only be available to the specified function.


## Additional Variable Types

### SLS Variables
- `${sls:instanceId}`: Retrieves the current Serverless Framework instance ID
  ```yaml
  SLS_VARIABLE: ${sls:instanceId}
  ```

### AWS Account Variables
- `${aws:accountId}`: Retrieves the current AWS account ID
  ```yaml
  AWS_VARIABLE: ${aws:accountId}
  ```

### S3 File Variables
- `${s3:bucket/file.txt}`: Loads variables directly from an S3 file
  ```yaml
  S3_VARIABLE: ${s3:slsvariables-1/variables_from_s3.txt}
  ```

### CloudFormation Output Variables
- `${cf:stack-name.OutputKey}`: References outputs from CloudFormation stacks
  ```yaml
  CF_SERVICE_ENDPOINT: ${cf:serverless-project-v1-prod.ServiceEndpoint}
  ```

### String to Boolean Conversion
- `${strToBool()}`: Converts string values to boolean
  ```yaml
  STR_TO_BOOL: ${strToBool(${ssm:/ENABLE_DEBUG})}
  ```

## Best Practices

1. **Sensitive Information**
   - Use SecureString type for sensitive parameters in Parameter Store
   - Use Secrets Manager for complex secrets or rotating credentials
   - Never commit .env files to version control

2. **Stage-Specific Configuration**
   - Use stage-specific configuration files for different environments
   - Leverage the `${opt:stage, 'dev'}` syntax for default values

3. **Organization**
   - Group related variables in Secrets Manager
   - Use consistent naming conventions for parameters
   - Document all environment variables and their purposes

4. **Security**
   - Implement proper IAM roles and policies
   - Regularly rotate sensitive credentials
   - Encrypt sensitive values in transit and at rest