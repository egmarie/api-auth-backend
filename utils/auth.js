const jwt = require('jsonwebtoken');

function generateToken(userInfo1) {
    if (!userInfo1) {
        return null
    }
    const userInfo3 = {
        username: userInfo1.username,
        email: userInfo1.email
    }
    return jwt.sign(userInfo3, process.env.JWT_SECRET, {
        expiresIn: '1h'
    })
}

function verifyToken(username, token) {
    return jwt.verify(token, process.env.JWT_SECRET, (error, response) => {
        if (error) {
            return {
                verified: false,
                message: 'invalid token'
            }
        }
        if (response.username !== username) {
            return {
                verified: false,
                message: 'invalid user'
            }
        }

        return {
            verified: true,
            message: 'verified'
        }
    })
}

module.exports.generateToken = generateToken;
module.exports.verifyToken = verifyToken;