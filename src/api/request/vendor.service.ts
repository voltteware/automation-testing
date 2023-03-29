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

//Edit supplier
async function editSupplier(request: APIRequestContext, linkApi: string, payLoad: any, header?: any) {
    const url = `${linkApi}`;
    logger.log('info', `Send PUT request ${url} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const editResponse = await request.put(url, {
        data: payLoad,
        headers: header
    });
    return editResponse;
}

//Count Summary by vendor
async function getCountSymmaryByVendor(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

//Get Summary by vendor
async function getSymmaryByVendor(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

//Get Total Qty, Total Price and Unique Items in Summary by vendor
async function getSymmaryByVendorByComppanyKeyAndType(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

//Get Count Items in PO by vendor key
async function getCountItemsinPO(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

//Get Items in PO by vendor key
async function getItemsinPO(request: APIRequestContext, linkApi: string, payLoad: any, header: any) {
    const url = `${linkApi}`;
    logger.log('info', `Send POST request ${url} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const response = await request.post(url, {
        data: payLoad,
        headers: header
    });
    return response;
}

//Get Count Items in Purchasing Custom
async function getCountItemsinPurchasingCustom(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

//Get Items in Purchasing Custom
async function getItemsinPurchasingCustom(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

export {
    getSuppliers,
    createSupplier,
    deleteSupplier,
    editSupplier,
    getCountSymmaryByVendor,
    getSymmaryByVendor,
    getSymmaryByVendorByComppanyKeyAndType,
    getCountItemsinPO,
    getItemsinPO,
    getCountItemsinPurchasingCustom,
    getItemsinPurchasingCustom
}
