import { APIRequestContext, Browser } from "@playwright/test";
import logger from '../../Logger/logger';

// Get user information
async function getUserInformation(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

// Change Password
async function changePassword(request: APIRequestContext, linkApi: string, payLoad: any, header?: any) {
    logger.log('info', `Send PUT request ${linkApi} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const updateResponse = await request.put(linkApi, {
        data: payLoad,
        headers: header
    });
    return updateResponse;
}

export {
    getUserInformation,
    changePassword
}