import { APIRequestContext, Browser } from "@playwright/test";
import logger from '../../Logger/logger';
//API login
async function sendPOSTAuthenticatieRequest(request: APIRequestContext, url: string, payLoad: any) {
    logger.log('info', `Send POST request ${url} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const authenticateResponse = await request.post(url, {
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