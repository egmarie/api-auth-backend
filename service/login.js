const AWS = require('aws-sdk')
const util = require('../utils/util')
const bcrypt = require('./bcryptjs');

const { util } = require("webpack");

AWS.config.update({
    region: 'us-east-1'
})
const auth = require('../utils/auth')
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'jinkidjda' // defined in Dynamo db


async function login(user) {
    const username = user.username;
    const password = user.password;

    if (!user || !username || !password) {
        return util.buildResponse(401, {
            message: 'username and password are required.'
        })
    }
    const dynamoUser = await getUser(username);

    if (!dynamoUser || !dynamoUser.username) {
        return util.buildResponse(403, { 
            message: 'username and password are required.'
        })
    }

    if (!bcrypt.compareSync(password, dynamo.password)) {
        return util.buildResponse(403, { message: 'Either the username or password are incorrect.'})
    }

    const userInfo = {
        username: dynamoUser.username,
        name: dynamoUser.name
    }

    const token = auth.generateToken(userInfo)

    const response = {
        user: userInfo,
        token: token
    }
    return util.buildResponse(200)
}
async function getUser(name) {
    const params = {
        TableName: userTable,
        Key: {
            username: username
        }
    }
    return await dyanmodb.get(params).promise().then(response = () => {
        return response.Item;
    }, error => {
        console.error('There is an error: ', error)
    })
}

module.exports.login = login


