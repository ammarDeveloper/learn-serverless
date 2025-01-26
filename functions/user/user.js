const response = require('../../utils/response');
const { USERS_TABLE } = process.env;
const { addUpdateUser, getUserData, getallUsersData, getallUsersDataScan } = require('../../utils/dynamodb');
require('dotenv').config();

module.exports.createUser = async (event, context) => {
    try {
        // Log the incoming event for debugging
        console.log('Incoming event:', JSON.stringify(event, null, 2));

        // Parse the request body
        if (!event.body) {
            throw new Error('Request body is missing.');
        }
        const body = JSON.parse(event.body);

        // Add/update the user in DynamoDB
        await addUpdateUser(body, USERS_TABLE);

        // Return a success response
        return {
            ...response.success,
            body: JSON.stringify({
                message: 'User created/updated successfully',
                data: body,
            }),
        };
    } catch (error) {
        // Log the error for debugging
        console.error('Error in createUser:', error);

        // Return an error response
        return {
            ...response.error,
            body: JSON.stringify({
                message: 'Failed to create/update user',
                error: error.message,
            }),
        };
    }
}

module.exports.getUser = async (event, context) => {
    try {
        if (!event.pathParameters || !event.pathParameters.email) {
            throw new Error('Required Path parameters are missing.');
        }

        const email = event.pathParameters.email;

        const userData = await getUserData({email}, USERS_TABLE);

        if (!userData) {
            throw new Error('User with the given email doesn\'t exist');
        }

        return {
            ...response.success,
            body: JSON.stringify({
                userData
            })
        }
    } catch (error) {
        console.error('Error in getting the user data: ', error);

        return {
            ...response.error,
            body: JSON.stringify({
                message: 'Failed to get the user data',
                error: error.message
            })
        }
    }
}

module.exports.getUsers = async (event, context) => {
    console.log('event:', event);
    try {
        if (!event.queryStringParameters || !event.queryStringParameters.country || !event.queryStringParameters.createdAt) {
            throw new Error('Required Query parameters are missing.');
        }
        
        console.log('event.queryStringParameters:', event.queryStringParameters);
        console.log('event.queryStringParameters.country:', event.queryStringParameters.country);

        const country = event.queryStringParameters.country;
        const createdAt = event.queryStringParameters.createdAt;

        const usersData = await getallUsersData(country, createdAt, USERS_TABLE);

        return {
            ...response.success,
            body: JSON.stringify({
                usersData
            })
        }
    } catch (error) {
        console.error('Error in getting the user data: ', error);

        return {
            ...response.error,
            body: JSON.stringify({
                message: 'Failed to get the user data',
                error: error.message
            })
        }
    }
}

module.exports.getUsersScan = async (event, context) => {
    try {
        if (!event.queryStringParameters || !event.queryStringParameters.country) {
            throw new Error('Required Query parameters are missing.');
        }

        const country = JSON.stringify(event.queryStringParameters.country);
        const usersData = await getallUsersDataScan(country, USERS_TABLE);

        return {
            ...response.success,
            body: JSON.stringify({
                usersData
            })
        }
    } catch (error) {
        console.log('Error in getting the user data:', error);

        return {
            ...response.error,
            body: JSON.stringify({
                message: 'Failed to Scan the users data',
                error: error.message
            })
        }
    }
}