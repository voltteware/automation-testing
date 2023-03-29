import { APIRequestContext } from '@playwright/test';
import logger from '../../Logger/logger';

//Get list demand
async function getDemand(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

//Create demand
async function createDemand(request: APIRequestContext, linkApi: string, payLoad: any, header?: any) {
    const url = `${linkApi}`;
    logger.log('info', `Send POST request ${url} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const createResponse = await request.post(url, {
        data: payLoad,
        headers: header
    });
    return createResponse;
}

//Edit demand
async function editDemand(request: APIRequestContext, linkApi: string, payLoad: any, header?: any) {
    const url = `${linkApi}`;    
    logger.log('info', `Send PUT request ${url} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const editResponse = await request.put(url, {
        data: payLoad,
        headers: header
    });
    return editResponse;
}

export {
    getDemand,
    createDemand,
    editDemand
}