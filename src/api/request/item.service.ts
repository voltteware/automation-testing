import { APIRequestContext } from '@playwright/test';
import logger from '../../Logger/logger';

//Get item summary
async function getItemSummary(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

//Count item
async function getItemCount(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

//get items
async function getItems(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

//Get Count Items that is Hidden
async function getCountItemsThatIsHidden(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

//Get Count Items in Purchasing Custom
async function getCountItemsInPurchasingCustom(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

//Get Items in Purchasing Custom 
async function getItemsInPurchasingCustom(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

//Get Items in Purchasing Custom with filter and sort
async function getItemsInPurchasingCustomWithFilter(request: APIRequestContext, headers: any, linkApi: string, columnName: string, operator: string, value: string, columnNameSort: string, sort: string, options?: object) {
    const url = `${linkApi}`;
    const exportResponse = await request.get(url, {
        headers: headers,
        params: {
            "offset": 0,
            "limit": 10000,
            "sort": JSON.stringify([{
                "field": columnNameSort,
                "direction": sort
            }]),
            "where": JSON.stringify({ 
                "logic": "and" ,
                "filters": [{ 
                    "filters": [{ 
                        "field": columnName, 
                        "operator": operator, 
                        "value": value 
                    }], 
                    "logic": "and" 
                }], 
            }),
        }
    });
    console.log("Get items in Purchasing > Custom with filter: ", exportResponse.url(), "operator: ", operator, "value: ", value, "Column Name: ", columnName, "columnNameSort: ",columnNameSort, sort );
    return exportResponse;
}

//Get Items in Purchasing Custom with filter and sort
async function getCountItemsInPurchasingCustomWithFilter(request: APIRequestContext, headers: any, linkApi: string, columnName: string, operator: string, value: string) {
    const url = `${linkApi}`;
    const exportResponse = await request.get(url, {
        headers: headers,
        params: {
            "where": JSON.stringify({
                "filters": [{
                    "filters": [{
                        "field": columnName,
                        "operator": operator,
                        "value": value
                    }],
                    "logic": "and"
                }],
                "logic": "and"
            }),
        }
    });
    console.log("header: ", headers, "Get count items in Purchasing > Custom with filter: ", exportResponse.url(), "operator: ", operator, "value: ", value, "Column Name: ", columnName);
    return exportResponse;
}

// Get Count Items in Purchasing > My Suggested by Vendor with filter and sort
async function getCountItemsInPurchasingSuggestedByVendorWithFilter(request: APIRequestContext, headers: any, linkApi: string, columnName: string, operator: string, value: number, columnNameSort: string, sort: string, vendorKey: any) {
    const url = `${linkApi}`;
    const exportResponse = await request.get(url, {
        headers: headers,
        data: {
            "removedItemKeys": []
        },
        params: {
            "offset": 0,
            "limit": 100,
            "sort": JSON.stringify([{
                "field": columnNameSort,
                "direction": sort
            }]),
            "where": JSON.stringify({
                "logic": "and",
                "filters": [{
                    "filters": [{
                        "field": columnName,
                        "operator": operator,
                        "value": Number(value)
                    }],
                    "logic": "and"
                }],
            }),
            "vendorKey": vendorKey,
        }
    });
    console
    console.log("header: ", headers, "Get count items in Purchasing > Custom with filter: ", exportResponse.url(), "operator: ", operator, "value: ", value, "Column Name: ", columnName);
    return exportResponse;
}

// Get Items in Purchasing > My Suggested by Vendor with filter and sort
async function getItemsInPurchasingSuggestedByVendorWithFilter(request: APIRequestContext, headers: any, linkApi: string, columnName: string, operator: string, value: number, columnNameSort: string, sort: string, vendorKey: any) {
    const url = `${linkApi}`;
    const exportResponse = await request.post(url, {
        headers: headers,
        data: {
            "removedItemKeys": []
        },
        params: {
            "offset": 0,
            "limit": 100,
            "sort": JSON.stringify([{
                "field": columnNameSort,
                "direction": sort
            }]),
            "where": JSON.stringify({
                "logic": "and",
                "filters": [{
                    "filters": [{
                        "field": columnName,
                        "operator": operator,
                        "value": Number(value)
                    }],
                    "logic": "and"
                }],
            }),
            "vendorKey": vendorKey,
        }
    });
    console
    console.log("header: ", headers, "Get count items in Purchasing > Custom with filter: ", exportResponse.url(), "operator: ", operator, "value: ", value, "Column Name: ", columnName);
    return exportResponse;
}

//Create item
async function createItem(request: APIRequestContext, linkApi: string, payLoad: any, header?: any) {
    const url = `${linkApi}`;
    logger.log('info', `Send POST request ${url} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const createResponse = await request.post(url, {
        data: payLoad,
        headers: header
    });
    return createResponse;
}

//Edit item
async function editItem(request: APIRequestContext, linkApi: string, payLoad: any, header?: any) {
    const url = `${linkApi}`;
    logger.log('info', `Send PUT request ${url} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const editResponse = await request.put(url, {
        data: payLoad,
        headers: header
    });
    return editResponse;
}

//get item detail
async function getItemDetail(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

//get items sale velocity settings
async function getItemSalesVelocitySettings(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

//Update Item Sales Velocity Settings
async function updateItemSalesVelocitySettings(request: APIRequestContext, linkApi: string, payLoad: any, header?: any) {
    const url = `${linkApi}`;
    logger.log('info', `Send PUT request ${url} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const editResponse = await request.put(url, {
        data: payLoad,
        headers: header
    });
    return editResponse;
}

// Get get-consolidated-qty
async function getConsolidatedQty(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request getConsolidatedQty${url}`);
    return await request.get(url, options);
}

// Get multiple random items from an array
function getMultipleRandom(responseBody: string, num: number) {
    const shuffled = [...responseBody].sort(() => 0.5 - Math.random());

    return shuffled.slice(0, num);
}


export {
    getItemSummary,
    getItemCount,
    createItem,
    getItems,
    editItem,
    getItemDetail,
    getItemSalesVelocitySettings,
    updateItemSalesVelocitySettings,
    getCountItemsInPurchasingCustom,
    getItemsInPurchasingCustom,
    getConsolidatedQty,
    getCountItemsThatIsHidden,
    getMultipleRandom,
    getCountItemsInPurchasingCustomWithFilter,
    getItemsInPurchasingCustomWithFilter,
    getCountItemsInPurchasingSuggestedByVendorWithFilter,
    getItemsInPurchasingSuggestedByVendorWithFilter
}
