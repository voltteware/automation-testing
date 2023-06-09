import { APIRequestContext } from '@playwright/test';
import logger from '../../Logger/logger';

//Get list supply
async function getSupply(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

//Create supply
async function createSupply(request: APIRequestContext, linkApi: string, payLoad: any, orderKey: any, rowKey: any, header?: any) {
    const url = `${linkApi}${orderKey}/${rowKey}`;
    logger.log('info', `Send POST request ${url} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const createResponse = await request.post(url, {
        data: payLoad,
        headers: header
    });
    return createResponse;
}

//Delete supply
async function deleteSupply(request: APIRequestContext, linkApi: string, payLoad: any, header?: any) {
    const url = `${linkApi}`;
    logger.log('info', `Send DELETE request ${url} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const deleteResponse = await request.delete(url, {
        data: payLoad,
        headers: header
    });
    return deleteResponse;
}

// Edit supply
async function editSupply(request: APIRequestContext, linkApi: string, payLoad: any, header?: any) {
    const url = `${linkApi}`;    
    logger.log('info', `Send PUT request ${url} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const editResponse = await request.put(url, {
        data: payLoad,
        headers: header
    });
    return editResponse;
}

export {
    getSupply,
    createSupply,
    deleteSupply,
    editSupply
}
