import { APIRequestContext } from '@playwright/test';
import logger from '../../Logger/logger';

//Get item summary
async function getItemSummary(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

//Count item
async function getItemCount(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

export {
    getItemSummary,
    getItemCount
}
