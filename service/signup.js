const AWS = require('aws-sdk')
const util = require('./utils/util')
const bcrypt = require('./bcryptjs');

AWS.config.update({
    region: 'us-east-1'
})

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'jinkidjda' // defined in Dynamo db

async function register(userInfo) {
    const name = userInfo.name;
    const email = userInfo.email;
    const password = userInfo.password;

    if(!email || !name || !password) {
        return util.buildResponse(401, {
            message: 'All fields are required'
        })
    }

    const dynamoUser = await getUser(userName);
    if (dynamoUser && dynamoUser.username) {
        return util.buildResponse(401, {
            message: 'username already exists in our database. Please choose a different username.'
        })
    }

    const encryptedPW = bcrypt.hashSync(password.trim(), 10)

    const user = {
        name: name,
        email: email,
        password: encryptedPW
    }

    const saveUserResponse = await saveUser(user);
        if (!saveUserResponse) {
            return util.buildResponse(503, {message: 'Server Error. Please try again later.'})
        }
      return util.buildResponse(200, { name: name }) 

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

async function saveUser(user) {
    const params = {
        TableName: userTable,
        Key: {
            Item: user
        }
    }
    return await dyanmodb.get(params).promise().then(() => {
        return true;
    }, error => {
        console.error('There is an error saving user: ', error)
    })
}
}

module.exports.register = register
