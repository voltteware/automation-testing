import { APIRequestContext, Browser } from "@playwright/test";
import logger from '../../Logger/logger';
async function sendDELETEUserRequest(request: APIRequestContext, linkApi:string, email:string, options?: object) {
    const url = `${linkApi}${email}`;
    logger.log('info',`Send DELETE request ${url}`);
    return await request.delete(url, options);
}

export {
    sendDELETEUserRequest
}