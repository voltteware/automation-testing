import { APIRequestContext } from '@playwright/test';
import logger from '../../Logger/logger';

// Get restock suggestion
async function getRestockSuggestion(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
};

// Edit item in Item List
async function editItemInItemList(request: APIRequestContext, linkApi: string, payLoad: any, header?: any) {
    const url = `${linkApi}`;    
    logger.log('info', `Send PUT request ${url} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const editResponse = await request.put(url, {
        data: payLoad,
        headers: header
    });    
    return editResponse;
}

export {
    getRestockSuggestion,
    editItemInItemList
}