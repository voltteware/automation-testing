import { APIRequestContext } from '@playwright/test';
import logger from '../../Logger/logger';

//Update History Override
async function updateHistoryOverride(request: APIRequestContext, linkApi: string, payLoad: any, header?: any) {
    const url = `${linkApi}`;    
    logger.log('info', `Send PUT request ${url} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const updateHistoryOverrideResponse = await request.put(url, {
        data: payLoad,
        headers: header
    });
    return updateHistoryOverrideResponse;
};

//Get history override
async function getHistoryOverride(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
};

//delete History Override
async function deleteHistoryOverride(request: APIRequestContext, linkApi: string, payLoad: any, header?: any) {
    const url = `${linkApi}`;    
    logger.log('info', `Send PUT request ${url} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const deleteHistoryOverrideResponse = await request.delete(url, {
        data: payLoad,
        headers: header
    });
    return deleteHistoryOverrideResponse;
};
export {
    updateHistoryOverride,
    getHistoryOverride,
    deleteHistoryOverride
}