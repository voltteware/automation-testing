import { APIRequestContext } from '@playwright/test';
import logger from '../../Logger/logger';

//Create Shipment
async function postShipment(request: APIRequestContext, linkApi: string, payLoad: any, header?: any) {
    const url = `${linkApi}`;
    logger.log('info', `Send POST request ${url} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const createShipmentResponse = await request.post(url, {
        data: payLoad,
        headers: header
    });
    return createShipmentResponse;
};

//Complete Shipment
async function completeShipment(request: APIRequestContext, linkApi: string, payLoad: any, header?: any) {
    const url = `${linkApi}`;
    logger.log('info', `Send POST request ${url} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const completeShipmentResponse = await request.post(url, {
        data: payLoad,
        headers: header
    });
    return completeShipmentResponse;
};

//Create Shipment Plan
async function postShipmentPlan(request: APIRequestContext, linkApi: string, payLoad: any, header?: any) {
    const url = `${linkApi}`;
    logger.log('info', `Send POST request ${url} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const createShipmentPlanResponse = await request.post(url, {
        data: payLoad,
        headers: header
    });
    return createShipmentPlanResponse;
};

//Update Shipment
async function putShipment(request: APIRequestContext, linkApi: string, payLoad: any, header?: any) {
    const url = `${linkApi}`;
    logger.log('info', `Send PUT request ${url} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const updateShipmentInfo = await request.put(url, {
        data: payLoad,
        headers: header
    });
    return updateShipmentInfo;
};

//Get Shipment Info
async function getShipmentInfo(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
};

//Check local qty error
async function getCheckLocalQtyError(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
};

//Delete shipment
async function deleteShipment(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send DELETE request ${url}`);
    return await request.delete(url, options);
};

//Export file
async function getWorkflowExport(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
};

//Get Shipment Detail
async function getShipmentDetail(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
};

//Get List Shipments
async function getListShipments(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
};

// GET endpoint for export item
async function getAllShipmentsInManageShipments(request: APIRequestContext, linkApi: string, headers: any, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    const exportResponse = await request.get(url, {
        headers: headers,
        params: {
            "where": JSON.stringify({ "logic": "and", "filters": [] })
        }
    });
    console.log("exportResponse: ", exportResponse.url());
    return exportResponse;
}

// GET endpoint for export item
async function countAllSKUsInShipmentDetails(request: APIRequestContext, linkApi: string, headers: any, key: string, restockType: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request to count sku in Shipment Details ${url}`);
    const countAllSKUsInShipmentDetailsResponse = await request.get(url, {
        headers: headers,
        params: {
            "key": key,
            "type": "amazon",
            "restockType": restockType,
            "where": JSON.stringify({ "logic": "and", "filters": [] })
        }
    });
    console.log("exportResponse: ", countAllSKUsInShipmentDetailsResponse.url());
    return countAllSKUsInShipmentDetailsResponse;
}

// GET endpoint for get list SKUs in Shipment Details
async function getSKUsInShipmentDetails(request: APIRequestContext, linkApi: string, headers: any, key: string, restockType: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request to get sku in Shipment Details ${url}`);
    const countAllSKUsInShipmentDetailsResponse = await request.get(url, {
        headers: headers,
        params: {
            "key": key,
            "type": "amazon",
            "restockType": restockType,
            "where": JSON.stringify({ "logic": "and", "filters": [] })
        }
    });
    console.log("exportResponse: ", countAllSKUsInShipmentDetailsResponse.url());
    return countAllSKUsInShipmentDetailsResponse;
}

//Get List Shipments with limit row
async function getListShipmentsWithLimitRow(request: APIRequestContext, linkApi: string, headers: any, limitRow: number) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request to get list SKUs in Shipment Details with limit row >>> ${url}`);
    const getListShipmentsWithLimitRowResponse = await request.get(url, {
        headers: headers,
        params: {
            "offset": 0,
            "limit": limitRow,
            "key": "01161049-fd6f-4778-924b-9cfe1ed1e543",
            "type": "amazon",
            "restockType": "SUPPLIER",
            "where": JSON.stringify({ "logic": "and", "filters": [] })
        }
    });
    return getListShipmentsWithLimitRowResponse;
};

//Get List SKUs in Shipment Details with limit row
async function getListSKUsInShipmentDetails(request: APIRequestContext, linkApi: string, headers: any, limitRow: number) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request to get list Shipments with limit row >>> ${url}`);
    const getListShipmentsWithLimitRowResponse = await request.get(url, {
        headers: headers,
        params: {
            "offset": 0,
            "limit": limitRow,
            "where": JSON.stringify({ "logic": "and", "filters": [] })
        }
    });
    return getListShipmentsWithLimitRowResponse;
};

export {
    postShipment,
    getShipmentInfo,
    putShipment,
    getCheckLocalQtyError,
    postShipmentPlan,
    completeShipment,
    getShipmentDetail,
    getWorkflowExport,
    deleteShipment,
    getListShipments,
    getAllShipmentsInManageShipments,
    getListShipmentsWithLimitRow,
    countAllSKUsInShipmentDetails,
    getListSKUsInShipmentDetails,
    getSKUsInShipmentDetails
}