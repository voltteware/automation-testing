import { APIRequestContext, Browser } from "@playwright/test";
import logger from '../../Logger/logger';
async function sendDELETEUserRequest(request: APIRequestContext, linkApi:string, email:string, options?: object) {
    const url = `${linkApi}${email}`;
    logger.log('info',`Send DELETE request ${url}`);
    return await request.delete(url, options);
}
// Get companies
async function getCompanies(request: APIRequestContext, linkApi:string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info',`Send GET request ${url}`);
    return await request.get(url, options);
}

export {
    sendDELETEUserRequest,
    getCompanies
}