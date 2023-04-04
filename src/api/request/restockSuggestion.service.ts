import { APIRequestContext } from '@playwright/test';
import logger from '../../Logger/logger';

//Get restock suggestion
async function getRestockSuggestion(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
};

export {
    getRestockSuggestion
}