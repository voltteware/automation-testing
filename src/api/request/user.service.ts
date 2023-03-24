import { APIRequestContext, Browser } from "@playwright/test";
import logger from '../../Logger/logger';

// Get user information
async function getUserInformation(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

export {
    getUserInformation,
}