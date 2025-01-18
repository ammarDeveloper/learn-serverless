'use strict';

module.exports.endpoint = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello, the current time is ${new Date().toTimeString()}.`,
    }),
  };
};