import { APIRequestContext } from '@playwright/test';
import logger from '../../Logger/logger';

//Create grid-view
async function createGridView(request: APIRequestContext, linkApi: string, payLoad: any, header?: any) {
    const url = `${linkApi}`;
    const createResponse = await request.post(url, {
        data: payLoad,
        headers: header
    });
    return createResponse;
}
//Get grid-view Supplier
async function getGridViewSupplier(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}
// Delete grid-view
async function deleteGridView(request: APIRequestContext, linkApi:string, key:string, options?: object) {
    const url = `${linkApi}${key}`;
    logger.log('info',`Send DELETE request ${url}`);
    return await request.delete(url, options);
}
//Get grid-view Item
async function getGridViewItem(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}
// Get grid-view Demand
async function getGridViewDemand(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}
// Get grid-view Supply
async function getGridViewSupply(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}
// Get grid-view Bom
async function getGridViewBom(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}
// Get grid-view Custom Items
async function getGridViewCustomItems(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

// Get grid-view Suggested Pos
async function getGridViewSuggestedPos(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

// Get grid-view Suggested Pos
async function getGridViewCustomAllAvailableItem(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}
export {
    createGridView,
    getGridViewSupplier,
    getGridViewItem,
    getGridViewDemand,
    deleteGridView,
    getGridViewSupply,
    getGridViewBom,
    getGridViewCustomItems,
    getGridViewSuggestedPos,
    getGridViewCustomAllAvailableItem
}
