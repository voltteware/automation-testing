import { APIRequestContext, request } from "@playwright/test";
import logger from '../../Logger/logger';
import { config } from '../../../playwright.config'
//API login
async function sendPOSTAuthenticateRequest(url: string, payLoad: any) {
    logger.log('info', `Send POST request ${url} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const loginContext = await request.newContext({
        baseURL: config.BASE_URL,
        ignoreHTTPSErrors: true
    })
    const authenticateResponse = await loginContext.post(url, {
        data: payLoad,
    });
    return authenticateResponse
}
//API Reset Password
async function resetPassword(request: APIRequestContext, linkApi:string, email:string) {
    const url = `${linkApi}${email}`;
    logger.log('info',`Send GET request ${url}`);
    return await request.get(url);
}

// Get Signed Request
async function getSignedRequest(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
};

export { 
    sendPOSTAuthenticateRequest,
    resetPassword,
    getSignedRequest
}