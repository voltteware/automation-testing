import { APIRequestContext, request } from "@playwright/test";
import logger from '../../Logger/logger';
import { config } from '../../../playwright.config'
//API login
async function sendPOSTAuthenticatieRequest(url: string, payLoad: any) {
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
export { 
    sendPOSTAuthenticatieRequest,
    resetPassword
}