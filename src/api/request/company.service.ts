import { APIRequestContext } from '@playwright/test';
import logger from '../../Logger/logger';

async function getRealm(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

async function getCompanyInfo(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

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

//Update company
async function updateCompany(request: APIRequestContext, linkApi: string, companyKey: any, payLoad: any, header?: any) {
    const url = `${linkApi}${companyKey}`;
    logger.log('info', `Send PUT request ${url} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const updateResponse = await request.put(url, {
        data: payLoad,
        headers: header
    });
    return updateResponse;
}
export {
    getRealm,
    getCompanyInfo,
    getSuppliers,
    updateCompany,
    createSupplier
}
