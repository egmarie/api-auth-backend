//var AWS  = require("aws-sdk");
const { DynamoDB, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const util = require('../utils/util');
const bcrypt = require('bcryptjs');
const dynamodb = new DynamoDB({
    region: 'us-east-1'
});
const userTable = 'auth-practice-users'; // defined in Dynamo db

async function register(userInfo) {

    const name = userInfo.name;
    const username = userInfo.username;
    const email = userInfo.email;
    const password = userInfo.password;

    if(!email || !name || !password || !username) {
        return util.buildResponse(401, {
            message: 'All fields are required'
        });
    }

    // const dynamoUser = await getUser(username);
    // if (dynamoUser && dynamoUser.username) {
    //     return util.buildResponse(401, {
    //         message: 'username already exists in our database. Please choose a different username.'
    //     });
        
    // }

    const encryptedPW = bcrypt.hashSync(password.trim(), 10);

    const user = {
        name: name,
        email: email,
        username: username.toLowerCase().trim(),
        password: encryptedPW
    };

    const saveUserResponse = saveUser(user);
        if (!saveUserResponse) {
            
            return util.buildResponse(503, {message: user});
        
        }
    return util.buildResponse(200, { username: username }) ;
}
    
async function getUser(username) {
    const params = {
        TableName: userTable,
         Item: {
            primaryKey: username, 
        },
    };
    return await dynamodb.getItem(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else console.log(data);           // successful response
 });
}

const saveUser = async (user) => {
    const params = {
        TableName: userTable,
        Key: {
            Item: user
        }
    };
  try {
    const data = await dynamodb.send(new PutItemCommand(params));
    console.log(data);
    return data;
  } catch (err) {
    console.error(err);
  }
};


module.exports.register = register;
