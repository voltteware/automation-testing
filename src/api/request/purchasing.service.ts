import { APIRequestContext } from '@playwright/test';
import logger from '../../Logger/logger';

//Get restock suggestion purchasing
async function getRestockSuggestionPurchasing(request: APIRequestContext, linkApi: string, options?: object) {
    logger.log('info', `Send GET request ${linkApi}`);
    return await request.get(linkApi, options);
}

export {
    getRestockSuggestionPurchasing
}
