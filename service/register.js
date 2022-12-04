//var AWS  = require("aws-sdk");
const { DynamoDB, PutItemCommand, GetItemCommand, ListTablesCommand } = require("@aws-sdk/client-dynamodb");
const util = require('../utils/util');
const bcrypt = require('bcryptjs');
const dynamodb = new DynamoDB({
    region: 'us-east-1'
});
let saveUserResponse;
const userTable = 'auth-practice-users'; // defined in Dynamo db
async function register(userInfo) {

    const name = userInfo.name;
    const username = userInfo.username;
    const usernameSearch = {"S": username.toLowerCase().trim()}
    const email = userInfo.email;
    const password = userInfo.password;

    if(!email || !name || !password || !username) {
        return util.buildResponse(401, {
            message: 'All fields are required'
        });
    }
    // let x = true
    //     const tables = await getTable();
    // if (x) {
    //     return util.buildResponse(200, {
    //         message: tables.TableNames.join("\n")
    //     });
    // } else {
    //     console.log("huh")
    // }

    const dynamoUser = await getUser(usernameSearch);
    if (dynamoUser.Item && dynamoUser.Item.username) {
        return util.buildResponse(401, {
            message: `username already exists in our database. Please choose a different username. ${dynamoUser}`
        });
    }

    const encryptedPW = bcrypt.hashSync(password.trim(), 10);

    const user = {
        name: {"S": name},
        email: {"S": email},
        username: {"S": username.toLowerCase().trim()},
        password: {"S": encryptedPW},
    };

  try {
    saveUserResponse = await saveUser(user);

    if (saveUserResponse) {
    return util.buildResponse(200, { body: `mission accomplished: ${saveUserResponse}` } );
    }
  } catch (err) {
    if (!saveUserResponse) {
        
    return util.buildResponse(503, {message: "input not processed."});
    } else {
        console.log(err.stack);
    }
    }
    }
    
  
    


 async function getUser(username) {
    const params = {
        TableName: userTable,
        Key: {
            username: username, 
        },
    };
    const getInput = new GetItemCommand(params);
  try {
    let data = await dynamodb.send(getInput);
    return data //JSON.stringify(data);
  } catch (err) {
    return err;
  }
}

const saveUser = async (user) => {
    const params = {
        TableName: userTable,
        Item: user
    };
    const putInput = new PutItemCommand(params);

  try {
     let data = await dynamodb.send(putInput);
     return JSON.stringify(data)
  } catch (err) {
    return err;
  }
};
module.exports.register = register;
