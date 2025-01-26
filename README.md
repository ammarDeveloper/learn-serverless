# Amazon DynamoDB: A Comprehensive Guide

## Overview
Amazon DynamoDB is a fully managed NoSQL database service designed for high-performance, scalable, and reliable database operations in cloud applications.

## Key Features

### 1. Fully Managed Service
- **Automatic Management**: No need to handle hardware provisioning, setup, configuration, replication, or software patching
- **Encryption**: Built-in encryption at rest
- **Flexible Data Storage**: Store and retrieve any amount of data
- **Traffic Handling**: Serve any level of request traffic

### 2. Seamless Scalability
- **Dynamic Throughput**: Scale tables up or down without downtime
- **Backup Options**: 
  - On-demand backups
  - Point-in-time recovery
- **Performance Monitoring**: Track resource utilization and performance metrics
- **Data Lifecycle Management**: 
  - Delete expired data using Time To Live (TTL)

### 3. NoSQL Characteristics
- **Schema Flexibility**: 
  - Schemaless design
  - Supports structured and semi-structured data
  - Handles JSON documents efficiently
- **Primary Key Requirements**:
  - Every table must have a primary key
  - Uniquely identifies each data item

### 4. Performance
- **Low Latency**: Single-digit millisecond performance at any scale
- **Response Time**: 
  - Microsecond response for specific use cases
  - DynamoDB Accelerator (DAX) for faster eventually consistent data access

### 5. Key Components

#### Primary Key Structure
- **Partition Key**: Determines data distribution
- **Sort Key**: Optional secondary key for sorting within a partition
- Enables complex querying and data organization

#### Indexes
- **Local Secondary Indexes (LSI)**
  - Created at table creation
  - Uses same partition key
- **Global Secondary Indexes (GSI)**
  - Can be added after table creation
  - Different partition key possible

### 6. Read Consistency Models
- **Eventually Consistent Reads**
- **Strongly Consistent Reads**
- Configurable based on application requirements

### 7. Capacity Modes
- **Provisioned Mode**
  - Pre-define read/write throughput
  - Manual capacity planning
- **On-Demand Mode**
  - Automatic scaling
  - Pay only for actual reads and writes

### 8. DynamoDB Streams
- **Change Data Capture**: Track item-level modifications
- **Trigger Integration**: Enable event-driven architectures
- **Cross-Region Replication**: Support for advanced data synchronization

## Best Practices
- Choose appropriate partition key for even data distribution
- Use GSIs for flexible querying
- Implement TTL for automatic data expiration
- Monitor and adjust capacity modes

## Use Cases
- Real-time web applications
- Gaming leaderboards
- IoT data storage
- Session management
- High-traffic websites

## Getting Started
1. Define your data model
2. Choose partition and sort keys
3. Configure capacity mode
4. Set up indexes as needed
5. Implement application logic

## Pricing Considerations
- Pay for read/write capacity or actual request volume
- Consider on-demand vs. provisioned modes
- Monitor and optimize resource utilization

## DynamoDB vs MongoDB: Detailed Comparison

### Key Differences

| Aspect | DynamoDB | MongoDB |
|--------|----------|---------|
| **Managed Service** | Fully AWS-managed | Can be self-hosted or cloud-managed |
| **Scalability** | Automatic, seamless | Manual scaling required |
| **Pricing Model** | Pay per request/capacity | Varies (instance-based) |
| **Primary Use** | High-traffic web/mobile apps | Complex querying, varied workloads |
| **Data Model** | Key-value and document | Document-oriented |
| **Query Complexity** | Limited | More flexible |
| **Indexing** | Limited secondary indexes | Comprehensive indexing |

### Disadvantages of DynamoDB

#### When NOT to Use DynamoDB
- Complex join operations
- Large data sets requiring complex querying
- Applications needing extensive aggregation pipelines
- Scenarios with unpredictable read/write patterns
- When you need full-text search capabilities
- ACID transactions across multiple tables
- Applications requiring extensive schema flexibility

### Performance Limitations
- 400KB item size limit
- 10GB maximum table size per partition key
- Limited support for complex transactions
- Higher cost for heavy read/write operations

### Recommended Alternatives
- MongoDB for complex data models
- PostgreSQL for relational data
- Cassandra for massive scale
- Redis for caching

### Ideal DynamoDB Use Cases
- Serverless applications
- Gaming leaderboards
- E-commerce product catalogs
- IoT data storage

## Conclusion
DynamoDB offers a powerful, flexible, and fully managed NoSQL database solution for modern cloud applications, providing seamless scalability and high performance.
Choose DynamoDB for high-performance, predictable workloads with simple access patterns. Consider alternatives for complex data requirements.

***

# DynamoDB Configuration in Serverless

## Table Structure

### Primary Table: `usersTable`

#### Key Attributes
- **Partition Key (Hash Key)**: `email` (String)
- **Global Secondary Index**: `createdAtIndex`

---

## Serverless Configuration Guide

### Project Setup
```yaml
service: serverless-project-v1

provider:
  name: aws
  runtime: nodejs20.x
  stage: ${opt:stage, 'dev'}
  region: 'ap-south-1'
```

## Function Configurations

### 1. User Creation Function
```yaml
user: 
  handler: functions/user/user.createUser
  description: 'Creates a new user'
  events: 
    - http:
        path: user
        method: post
        cors: true
  role: customRole
```
**Step-by-Step Process:**
- **Handler**: Points to `createUser` function in `user.js`
- **HTTP Endpoint**: 
  - Path: `/user`
  - Method: POST
- **Features**:
  - CORS enabled
  - Custom IAM role assigned
- **Input**: User details in request body
- **Output**: User created/updated in DynamoDB

### 2. Get User by Email Function
```yaml
getUser: 
  handler: functions/user/user.getUser
  description: 'Get user by email id'
  events: 
    - http:
        path: user/{email}
        method: get
        cors: true
  role: customRole
```
**Step-by-Step Process:**
- **Handler**: Calls `getUser` function
- **HTTP Endpoint**:
  - Path: `/user/{email}`
  - Method: GET
- **Input**: Email as path parameter
- **Output**: User details retrieved from DynamoDB

### 3. Get Users by Country and CreatedAt
```yaml
getUsersByCountryAndCreatedAt:
  handler: functions/user/user.getUsers
  description: 'Get users by country and createdAt'
  events: 
    - http:
        path: users
        method: get
        cors: true
  role: customRole
```
**Step-by-Step Process:**
- **Handler**: Executes `getUsers` function
- **HTTP Endpoint**:
  - Path: `/users`
  - Method: GET
- **Input**: 
  - `country` query parameter
  - `createdAt` query parameter
- **Output**: List of users matching criteria

### 4. Scan Users by Country
```yaml
getUsersByCountryAndCreatedAtScan:
  handler: functions/user/user.getUsersScan
  description: 'Get users by country using scan'
  events: 
    - http:
        path: users-scan
        method: get
        cors: true
  role: customRole
```
**Step-by-Step Process:**
- **Handler**: Runs `getUsersScan` function
- **HTTP Endpoint**:
  - Path: `/users-scan`
  - Method: GET
- **Input**: `country` query parameter
- **Output**: Full table scan of users by country

## DynamoDB Table Configuration
```yaml
resources:
  Resources:
    UsersTable:
      Type: 'AWS::DynamoDB::Table'
      Properties:
        TableName: ${self:custom.usersTableName}
        AttributeDefinitions: 
          - AttributeName: email
            AttributeType: S
          - AttributeName: country
            AttributeType: S
          - AttributeName: createdAt
            AttributeType: S
        KeySchema:
          - AttributeName: email
            KeyType: HASH
        BillingMode: PAY_PER_REQUEST
        GlobalSecondaryIndexes:
          - IndexName: createdAtIndex
            KeySchema:
              - AttributeName: country
                KeyType: HASH
              - AttributeName: createdAt
                KeyType: RANGE
            Projection:
              ProjectionType: ALL
```

## IAM Role Configuration
```yaml
    customRole:
      Type: AWS::IAM::Role
      Properties:
        RoleName: MyCustRole-${opt:stage, self:provider.stage}
        AssumeRolePolicyDocument:
          Statement: 
            - Effect: Allow
              Principal: 
                Service: [lambda.amazonaws.com]
              Action: sts:AssumeRole
        Policies:
          - PolicyName: customRole-${opt:stage, self:provider.stage}
            PolicyDocument: 
              Statement: 
                - Effect: Allow
                  Action: 
                    - logs:CreateLogGroup
                    - logs:CreateLogStream
                    - logs:PutLogEvents
                  Resource: 'arn:aws:logs:*:*:*'
                - Effect: Allow
                  Action: ["dynamodb:*"]
                  Resource: 
                    - 'arn:aws:dynamodb:*:*:table/${self:custom.usersTableName}'
```

## Deployment Notes
- Uses stage-based configuration
- Supports multiple environments
- Pay-per-request DynamoDB billing

## Code Examples

### 1. User Creation/Update
```javascript
const addUpdateUser = async (item, tableName) => {
    // Hash password
    const hashedPassword = await bcrypt.hash(item.password, 10);

    const params = {
        TableName: tableName,
        Item: {
            ...item,
            password: hashedPassword,
            createAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    };

    return dynamoDb.put(params).promise();
}
```

### 2. Get User by Email
```javascript
const getUserData = async (item, tableName) => {
    const params = {
        TableName: tableName,
        Key: { "email": item.email },
        ProjectionExpression: 'email, lastName, FirstName'
    };

    return dynamoDb.get(params).promise();
}
```

### 3. Query Users by Country and Creation Date
```javascript
const getallUsersData = async (country, createdAt, tableName) => {
    const params = {
        TableName: tableName,
        IndexName: 'createdAtIndex',
        KeyConditionExpression: 'country = :country AND createdAt > :createdAt',
        ExpressionAttributeValues: {
            ':country': country,
            ':createdAt': createdAt 
        }
    };

    return dynamoDb.query(params).promise();
}
```

### 4. Scan Users by Country
```javascript
const getallUsersDataScan = async (country, tableName) => {
    const params = {
            TableName: tableName,
            IndexName: 'createdAtIndex',
            FilterExpression: 'country = :country',
            ExpressionAttributeValues: {
                ':country': country,
            },
        };

    return dynamoDb.scan(params).promise();
}
```

## Key Considerations
- Password hashing before storage
- Automatic timestamp generation
- Flexible querying using GSI
- Secure access through IAM roles

## Recommended Improvements
- Add input validation
- Implement error handling
- Create pagination mechanism
- Add logging for audit trails