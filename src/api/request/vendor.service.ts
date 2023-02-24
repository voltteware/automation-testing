import { APIRequestContext } from '@playwright/test';
import logger from '../../Logger/logger';

//Get list supplier
async function getSuppliers(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

//Create supplier
async function createSupplier(request: APIRequestContext, linkApi: string, payLoad: any, header?: any) {
    const url = `${linkApi}`;
    logger.log('info', `Send POST request ${url} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const createResponse = await request.post(url, {
        data: payLoad,
        headers: header
    });
    return createResponse;
}

//Delete supplier(s)
async function deleteSupplier(request: APIRequestContext, linkApi: string, payLoad: any, header?: any) {
    const url = `${linkApi}`;
    logger.log('info', `Send DELETE request ${url} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const options = {
        data: payLoad,
        headers: header
    }
    const deleteResponse = await request.delete(url, options);
    return deleteResponse;
}

export {
    getSuppliers,
    createSupplier,
    deleteSupplier
}
