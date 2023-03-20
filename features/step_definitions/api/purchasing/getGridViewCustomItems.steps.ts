import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as gridViewRequest from '../../../../src/api/request/gridView.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";
import { faker } from '@faker-js/faker';
import { gridViewPayLoadCustomItems } from '../../../../src/utils/gridViewPayLoad';

let link: any;
let payload: gridViewPayLoadCustomItems = {};

Then(`{} sets GET api endpoint to get grid view custom items in PO`, async function (actor: string) {
    link = Links.API_GET_GRIDVIEW_CUSTOM_ITEMS;
});

Then(`{} sends a GET request to get grid view custom items in PO of {} by company key and company type`, async function (actor, email: string) {
    const options = {
        headers: this.headers
    }
    this.getGridViewCustomItemsResponse = this.response = await gridViewRequest.getGridViewCustomItems(this.request, link, options);
    const responseBodyText = await this.getGridViewCustomItemsResponse.text();
    if (this.getGridViewCustomItemsResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getGridViewCustomItemsResponseBody = JSON.parse(await this.getGridViewCustomItemsResponse.text());
        logger.log('info', `Response GET ${link}` + JSON.stringify(this.getGridViewCustomItemsResponseBody, undefined, 4));
        this.attach(`Response GET ${link}` + JSON.stringify(this.getGridViewCustomItemsResponseBody, undefined, 4))
    }
    else if (responseBodyText.includes('<!doctype html>')) {
        logger.log('info', `Response GET ${link} ${responseBodyText}`);
        this.attach(`Response GET ${link} returns html`)
    }
});

Then('Check grid view custom items in PO exist in the company, if it does not exist will create grid view custom items in PO', async function () {
    if (this.getGridViewCustomItemsResponseBody.length < 1) {
        payload.gridState = {
            columns: [
                {
                    visible: true,
                    width: "*",
                    name: "details"
                },
                {
                    visible: true,
                    width: "*",
                    name: "imageUrl"
                },
                {
                    visible: true,
                    width: "*",
                    name: "recommendedQty"
                },
                {
                    visible: true,
                    width: "*",
                    name: "itemName"
                },
                {
                    visible: true,
                    width: "*",
                    name: "asin"
                },
                {
                    visible: false,
                    width: "*",
                    name: "fnsku"
                },
                {
                    visible: true,
                    width: "*",
                    name: "description"
                },
                {
                    visible: true,
                    width: "*",
                    name: "tags"
                },
                {
                    visible: false,
                    width: "*",
                    name: "vendorName"
                },
                {
                    visible: true,
                    width: "*",
                    name: "onNewPo"
                },
                {
                    visible: false,
                    width: "*",
                    name: "trueRecommendedQty"
                },
                {
                    visible: true,
                    width: "*",
                    name: "dueDate"
                },
                {
                    visible: false,
                    width: "*",
                    name: "moq"
                },
                {
                    visible: false,
                    width: "*",
                    name: "lotMultipleQty"
                },
                {
                    visible: true,
                    width: "*",
                    name: "purchaseQty",
                    sort: {
                        direction: "asc"
                    }
                },
                {
                    visible: true,
                    width: "*",
                    name: "vendorPrice"
                },
                {
                    visible: true,
                    width: "*",
                    name: "total"
                },
                {
                    visible: false,
                    width: "*",
                    name: "s7d"
                },
                {
                    visible: false,
                    width: "*",
                    name: "s30d"
                },
                {
                    visible: false,
                    width: "*",
                    name: "s90d"
                },
                {
                    visible: false,
                    width: "*",
                    name: "s365d"
                },
                {
                    visible: false,
                    width: "*",
                    name: "sMtd"
                },
                {
                    visible: false,
                    width: "*",
                    name: "sYtd"
                },
                {
                    visible: true,
                    width: "*",
                    name: "snapshotQty"
                },
                {
                    visible: false,
                    width: "*",
                    name: "meanLtd"
                },
                {
                    visible: false,
                    width: "*",
                    name: "safetyStockLtd"
                },
                {
                    visible: true,
                    width: "*",
                    name: "onHand"
                },
                {
                    visible: false,
                    width: "*",
                    name: "onHandMin"
                },
                {
                    visible: true,
                    width: "*",
                    name: "onHandThirdParty"
                },
                {
                    visible: false,
                    width: "*",
                    name: "onHandThirdPartyMin"
                },
                {
                    visible: false,
                    width: "*",
                    name: "onHandFbm"
                },
                {
                    visible: false,
                    width: "*",
                    name: "inbound"
                },
                {
                    visible: true,
                    width: "*",
                    name: "inboundPrice"
                },
                {
                    visible: true,
                    width: "*",
                    name: "inboundSalesLast30Days"
                },
                {
                    visible: false,
                    width: "*",
                    name: "inboundAvailable"
                },
                {
                    visible: true,
                    width: "*",
                    name: "inboundFcTransfer"
                },
                {
                    visible: true,
                    width: "*",
                    name: "inboundFcProcessing"
                },
                {
                    visible: true,
                    width: "*",
                    name: "inboundCustomerOrder"
                },
                {
                    visible: true,
                    width: "*",
                    name: "inboundUnfulfillable"
                },
                {
                    visible: true,
                    width: "*",
                    name: "inboundAlert"
                },
                {
                    visible: false,
                    width: "*",
                    name: "inboundWorking"
                },
                {
                    visible: false,
                    width: "*",
                    name: "mwsFulfillmentFee"
                },
                {
                    visible: false,
                    width: "*",
                    name: "isFbm"
                },
                {
                    visible: false,
                    width: "*",
                    name: "inventorySourcePreference"
                },
                {
                    visible: true,
                    width: "*",
                    name: "lastOrderDate"
                },
                {
                    visible: true,
                    width: "*",
                    name: "nextScheduledOrderDate"
                },
                {
                    visible: true,
                    width: "*",
                    name: "daysUntilNextScheduledOrder"
                },
                {
                    visible: false,
                    width: "*",
                    name: "outOfStockDate"
                },
                {
                    visible: false,
                    width: "*",
                    name: "daysLeft"
                },
                {
                    visible: false,
                    width: "*",
                    name: "recommendedOrderDate"
                },
                {
                    visible: false,
                    width: "*",
                    name: "daysRemaining"
                },
                {
                    visible: true,
                    width: "*",
                    name: "openPurchaseOrders"
                },
                {
                    visible: true,
                    width: "*",
                    name: "openSalesOrders"
                }
            ],
            scrollFocus: {},
            selection: [],
            grouping: {},
            treeView: {},
            pagination: {
                paginationCurrentPage: 0,
                paginationPageSize: 100
            },
            filter: {
                logic: "and",
                filters: []
            },
            sort: [
                {
                    dir: "asc",
                    field: "purchaseQty"
                }
            ]
        };
        payload.itemType = "custom-items-in-po";
        payload.name = `sortedPurchaseQtyByDesc ${Number(faker.random.numeric(3))}`;
        this.attach(`Payload: ${JSON.stringify(payload, undefined, 4)}`)

        this.createGridViewCustomItemsResponse = await gridViewRequest.createGridView(this.request, Links.API_CREATE_GRIDVIEW, payload, this.headers);
        this.createGridViewCustomItemsResponseBody = JSON.parse(await this.createGridViewCustomItemsResponse.text())
        //logger.log('info', `Response after create ${link}` + JSON.stringify(this.createGridViewCustomItemsResponseBody, undefined, 4));
        this.attach(`Response after create ${link}` + JSON.stringify(this.createGridViewCustomItemsResponseBody, undefined, 4))
        // Get list after create grid view Custom Items new
        const options = {
            headers: this.headers
        }
        this.getGridViewCustomItemsResponse = await gridViewRequest.getGridViewCustomItems(this.request, link, options);
        if (this.getGridViewCustomItemsResponse.status() == 200) {
            this.getGridViewCustomItemsResponseBody = JSON.parse(await this.getGridViewCustomItemsResponse.text());
            logger.log('info', `Response GET ${link}` + JSON.stringify(this.getGridViewCustomItemsResponseBody, undefined, 4));
            this.attach(`Response GET ${link}` + JSON.stringify(this.getGridViewCustomItemsResponseBody, undefined, 4))
        }
    }
});

Then('{} picks random grid view of custom items in PO in above response', async function (actor: string) {
    this.responseBodyOfAGridViewObject = await this.getGridViewCustomItemsResponseBody[Math.floor(Math.random() * this.getGridViewCustomItemsResponseBody.length)];
    logger.log('info', `Random grid view custom items in PO: ${JSON.stringify(this.responseBodyOfAGridViewObject, undefined, 4)}`);
    this.attach(`Random grid view custom items in PO: ${JSON.stringify(this.responseBodyOfAGridViewObject, undefined, 4)}`);
});

Then('{} checks values in response of get grid view custom items in PO are correct', async function (actor: string) {
    const companyType = ['ASC', 'CSV', 'QBFS', 'QBO'];
    const expecteditemType = "custom-items-in-po";
    expect(this.responseBodyOfAGridViewObject.itemType, `In response body, itemType should be is: ${expecteditemType}`).toBe(expecteditemType);
    expect(companyType, `Company Type should be one of ${companyType}`).toContain(this.responseBodyOfAGridViewObject.companyType);
    expect(this.responseBodyOfAGridViewObject.companyKey).not.toBeNull();
})
