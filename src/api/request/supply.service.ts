import { APIRequestContext } from '@playwright/test';
import logger from '../../Logger/logger';

//Get list supplier
async function getSupply(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

//Create supplier
async function createSupply(request: APIRequestContext, linkApi: string, payLoad: any, orderKey: any, rowKey: any, header?: any) {
    const url = `${linkApi}${orderKey}/${rowKey}`;
    logger.log('info', `Send POST request ${url} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const createResponse = await request.post(url, {
        data: payLoad,
        headers: header
    });
    return createResponse;
}

export {
    getSupply,
    createSupply
}
