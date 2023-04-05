import { APIRequestContext } from '@playwright/test';
import logger from '../../Logger/logger';

async function getRealm(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

//Get company by company key
async function getCompanyInfo(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
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

//Create company
async function createCompany(request: APIRequestContext, linkApi: string, payLoad: any, header?: any) {
    const url = `${linkApi}`;
    logger.log('info', `Send POST request ${url} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const createResponse = await request.post(url, {
        data: payLoad,
        headers: header
    });
    return createResponse;
}

//Get list company info
async function getListCompanyInfo(request: APIRequestContext, linkApi: string, options?: any) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

// Edit purchasing daily sale rate of company
async function editPurchasingDailyRate(request: APIRequestContext, linkApi: string, payLoad: any, header?: any) {    
    logger.log('info', `Send PUT request ${linkApi} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const updateResponse = await request.put(linkApi, {
        data: payLoad,
        headers: header
    });
    return updateResponse;
}

export {
    getRealm,
    getCompanyInfo,
    updateCompany,
    createCompany,
    getListCompanyInfo,
    editPurchasingDailyRate
}
