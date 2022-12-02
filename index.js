const registerService = require('./service/register');
const loginService = require('./service/login');
const verifyService = require('./service/verify');
const util = require('./utils/util');

const healthPath = '/health';
const registerPath = '/register';
const loginPath = '/login';
const verifyPath = '/verify';

//export const handler
exports.handler = async (e) => {
    let response;
    switch(true) {
        case e.httpMethod === 'GET' && e.path === healthPath:
            response = util.buildResponse(200)
            break;
        case e.httpMethod === 'POST' && e.path === registerPath:
            const registerBody = JSON.parse(e.body)
            response = await registerService.register(registerBody)
            break;
        case e.httpMethod === 'POST' && e.path === loginPath:
            const loginBody = JSON.parse(e.body)
            response = await loginService.login(loginBody)
            break;

        case e.httpMethod === 'POST' && e.path === verifyPath:
            const verifyBody = JSON.parse(e.body)
            response = verifyService.verify(verifyBody)
            break;
        default:
            response = util.buildResponse(404, {
                message: '404 Not Found'
            })
    }
    return response;
}