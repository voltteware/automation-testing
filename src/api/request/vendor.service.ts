import { APIRequestContext } from '@playwright/test';
import logger from '../../Logger/logger';

//Get list supplier
async function getSuppliers(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

//Get list supplier with filter and sort
async function getSuppliersWithFilterAndSort(request: APIRequestContext, linkApi: string, columnName: string, operator: string, value: string, columnNameSort: string, sort: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, {
        params: {
            "sort": JSON.stringify([{"field":columnNameSort,"direction":sort}]),
            "where": JSON.stringify({"logic":"and","filters":[{"filters":[{"field":columnName,"operator":operator,"value":value}],"logic":"and"}]})
        }
    }
    );
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
async function getCountSummaryByVendor(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

//Get Summary by vendor
async function getSummaryByVendor(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

//Get Total Qty, Total Price and Unique Items in Summary by vendor
async function getSummaryByVendorByCompanyKeyAndType(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

//Get Count Items in PO by vendor key
async function getCountItemsInPO(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

//Get Items in PO by vendor key
async function getItemsInPO(request: APIRequestContext, linkApi: string, payLoad: any, header: any) {
    const url = `${linkApi}`;
    logger.log('info', `Send POST request ${url} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const response = await request.post(url, {
        data: payLoad,
        headers: header
    });
    return response;
}

//Get Vendor Sales Velocity Settings
async function getVendorSalesVelocitySettings(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

//Update Vendor Sales Velocity Settings
async function updateVendorSalesVelocitySettings(request: APIRequestContext, linkApi: string, payLoad: any, header?: any) {
    const url = `${linkApi}`;
    logger.log('info', `Send PUT request ${url} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const editResponse = await request.put(url, {
        data: payLoad,
        headers: header
    });
    return editResponse;
}

// Count all suppliers 
async function countAllSuppliers(request: APIRequestContext, linkApi: string, headers: string, option?: any) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, option);
}

export {
    getSuppliers,
    createSupplier,
    deleteSupplier,
    editSupplier,
    getCountSummaryByVendor,
    getSummaryByVendor,
    getSummaryByVendorByCompanyKeyAndType,
    getCountItemsInPO,
    getItemsInPO,
    getVendorSalesVelocitySettings,
    updateVendorSalesVelocitySettings,
    countAllSuppliers,
    getSuppliersWithFilterAndSort
}
