require('dotenv').config();

module.exports.post = async (event, context) => {
    const response = {
        "statusCode": 200,
        "isBase64Encoded": false,
        "headers": {
            'Access-Control-Allow-Origin': '*'
        },
        "body": JSON.stringify({
            TEST_VAR: `${process.env.TEST_VAR}`,
            TEST_FS: `${process.env.TEST_VAR_FS}`,
            DB_USERNAME_PS: `${process.env.DB_USERNAME_PS}`,
            DB_PASSWORD_PS: `${process.env.DB_PASSWORD_PS}`,
            DB_USERNAME_SM: `${process.env.DB_USERNAME_SM}`,
            DB_PASSWORD_SM: `${process.env.DB_PASSWORD_SM}`,
            VAR_FROM_ENV_FILE: `${process.env.SOME_VALUE}`,
            ENV_VAR_USING_PLUGIN: `${process.env.ENV_VAR_USING_PLUGIN}`,
            DB_USERNAME_FILE: `${process.env.DB_USERNAME_FILE}`,
            DB_PASSWORD_FILE: `${process.env.DB_PASSWORD_FILE}`,
            SLS_VARIABLE: `${process.env.SLS_VARIABLE}`,
            AWS_VARIABLE: `${process.env.AWS_VARIABLE}`,
            S3_VARIABLE: `${process.env.S3_VARIABLE}`,
            CF_SERVICE_ENDPOINT: `${process.env.CF_SERVICE_ENDPOINT}`,
            STR_TO_BOOL: `${process.env.STR_TO_BOOL}`
        })
    }
    return response;
}