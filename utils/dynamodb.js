const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const bcrypt = require('bcryptjs');

/**
 * Adds or updates a user in the specified DynamoDB table.
 * This function can handle both creating a new user and updating an existing user.
 * 
 * @param {Object} item - The user data to be saved. Must include the primary key.
 * @param {string} tableName - The name of the DynamoDB table.
 * @returns {Promise<Object>} - A promise that resolves to the result of the DynamoDB operation.
 * @throws {Error} - Throws an error if the primary key is missing or if DynamoDB operation fails.
 */
const addUpdateUser = async (item, tableName) => {
    try {
        // Validate input
        if (!item || !tableName) {
            throw new Error('Item and tableName are required.');
        }

        // Ensure the primary key is present
        if (!item.email) { // Replace 'userId' with your actual primary key attribute
            throw new Error('Primary key (email) is missing in the item.');
        }

        // Validate password field
        if (!item.password || typeof item.password !== 'string') {
            throw new Error('Password is required and must be a string.');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(item.password, 10);

        // Add timestamps
        const timestamp = new Date().toISOString();
        const params = {
            TableName: tableName,
            Item: {
                ...item,
                password: hashedPassword, // Replace plaintext password with hashed password
                createAt: timestamp, // Timestamp for when the item is created
                updatedAt: timestamp, // Timestamp for when the item is updated
            },
        };

        console.log('DynamoDB Params:', params);

        // Save to DynamoDB
        const result = await dynamoDb.put(params).promise();
        console.log('User added/updated successfully.');

        return result; // Return the result of the DynamoDB operation
    } catch (error) {
        console.error('Error in addUpdateUser:', error);

        // Handle specific DynamoDB errors
        if (error.code === 'ValidationException') {
            throw new Error('Bad request: Primary key is missing or invalid.');
        }

        throw error; // Re-throw the error for the caller to handle
    }
}

const getUserData = async (item, tableName) => {
    try {

        if (!item || !tableName) {
            throw new Error('Item and tablename is required');
        }


        if (!item.email) {
            throw new Error('Primary key (email) is missing in the item.');
        }

        const params = {
            TableName: tableName,
            Key: {
                "email": item.email
            },
            ProjectionExpression: 'email, lastName, FirstName',
            ReturnConsumedCapacity: 'TOTAL',
            ConsistentRead: true
        };

        console.log('DynamoDB Params ', params);

        const userData = await dynamoDb.get(params).promise();

        return userData;
    } catch (error) {
        console.error('Error in getting the user data');

        if (error.code === 'ValidationException') {
            throw new Error('Bad request: Primary key is missing or invalid');
        }

        throw error;
    }
}

const getallUsersData = async (country, createdAt, tableName) => {
    try {

        if (!country || !createdAt || !tableName) {
            throw new Error('Country, createdAt and tablename is required');
        }

        const params = {
            TableName: tableName,
            IndexName: 'createdAtIndex',
            KeyConditionExpression: 'country = :country AND createdAt > :createdAt',
            ExpressionAttributeValues: {
                ':country': country,
                ':createdAt': createdAt 
            },
        };

        console.log('DynamoDB Params:', params);

        const usersData = await dynamoDb.query(params).promise();
        console.log('Users data:', usersData);

        return usersData;
    } catch (error) {
        console.error('Error in getting the user data: ', error);

        if (error.code === 'ValidationException') {
            throw new Error('Bad request: Required Query parameters are missing.');
        }

        throw error;
    }
}

const getallUsersDataScan = async (country, tableName) => {
    try {

        if (!country || !tableName) {
            throw new Error('Country and tablename is required');
        }

        const params = {
            TableName: tableName,
            IndexName: 'createdAtIndex',
            FilterExpression: 'country = :country',
            ExpressionAttributeValues: {
                ':country': country,
            },
        };

        console.log('DynamoDB Params:', params);

        const usersData = await dynamoDb.scan(params).promise();
        console.log('Users data:', usersData);

        return usersData;
    } catch (error) {
        console.error('Error in getting the user data: ', error);

        if (error.code === 'ValidationException') {
            throw new Error('Bad request: Required Query parameters are missing.');
        }

        throw error;
    }
}


module.exports = {
        addUpdateUser,
        getUserData,
        getallUsersData,
        getallUsersDataScan
    }