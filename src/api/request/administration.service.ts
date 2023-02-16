import { APIRequestContext, Browser } from "@playwright/test";
import logger from '../../Logger/logger';
// Delete user
async function deleteUser(request: APIRequestContext, linkApi:string, email:string, options?: object) {
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
// Get user
async function getUser(request: APIRequestContext, linkApi:string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info',`Send GET request ${url}`);
    return await request.get(url, options);
}
export {
    deleteUser,
    getCompanies,
    getUser
}