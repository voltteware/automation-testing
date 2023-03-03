import { APIRequestContext } from '@playwright/test';
import logger from '../../Logger/logger';

//Get list bom
async function getBom(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

//Create bom
async function createBom(request: APIRequestContext, linkApi: string, payLoad: any, header?: any) {
    const url = `${linkApi}`;
    logger.log('info', `Send PUT request ${url} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const createResponse = await request.put(url, {
        data: payLoad,
        headers: header
    });
    return createResponse;
}

export {
    getBom,
    createBom
}
