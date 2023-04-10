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

export {
    postShipment,
    getShipmentInfo,
    putShipment,
    getCheckLocalQtyError,
    postShipmentPlan,
    completeShipment,
    getShipmentDetail,
    getWorkflowExport,
    deleteShipment
}