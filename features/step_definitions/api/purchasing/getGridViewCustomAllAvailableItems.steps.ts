import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as gridViewRequest from '../../../../src/api/request/gridView.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";
import { faker } from '@faker-js/faker';
import { gridViewPayLoadCustomAllAvailableItems } from '../../../../src/utils/gridViewPayLoad';

let link: any;
let payload: gridViewPayLoadCustomAllAvailableItems = {};

Then(`{} sets GET api endpoint to get grid view custom all available items`, async function (actor: string) {
    link = Links.API_GET_GRIDVIEW_CUSTOM_ALL_AVAILABLE_ITEMS;
});

Then(`{} sends a GET request to get grid view custom all available items`, async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getGridViewCustomAllAvailableItemsResponse = this.response = await gridViewRequest.getGridViewCustomItems(this.request, link, options);
    const responseBodyText = await this.getGridViewCustomAllAvailableItemsResponse.text();
    if (this.getGridViewCustomAllAvailableItemsResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getGridViewCustomAllAvailableItemsResponseBody = JSON.parse(await this.getGridViewCustomAllAvailableItemsResponse.text());
        logger.log('info', `Response GET ${link}` + JSON.stringify(this.getGridViewCustomAllAvailableItemsResponseBody, undefined, 4));
        this.attach(`Response GET ${link}` + JSON.stringify(this.getGridViewCustomAllAvailableItemsResponseBody, undefined, 4))
    }
    else if (responseBodyText.includes('<!doctype html>')) {
        logger.log('info', `Response GET ${link} ${responseBodyText}`);
        this.attach(`Response GET ${link} returns html`)
    }
});

Then('Check grid view custom all available items exist in the company, if it does not exist will create grid view custom all available items', async function () {
    if (this.getGridViewCustomAllAvailableItemsResponseBody.length < 1) {
        payload.gridState = {
            columns: [
                {
                    visible: true,
                    width: "*",
                    name: "dueDate",
                    sort: {
                        direction: "desc"
                    }
                },
                {
                    visible: true,
                    width: "*",
                    name: "itemName"
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
                    visible: true,
                    width: "*",
                    name: "vendorName"
                },
                {
                    visible: false,
                    width: "*",
                    name: "onNewPo"
                },
                {
                    visible: true,
                    width: "*",
                    name: "recommendedQty"
                },
                {
                    visible: true,
                    width: "*",
                    name: "details" 
                },
                {
                    visible: false,
                    width: "*",
                    name: "moq"
                },
                {
                    visible: true,
                    width: "*",
                    name: "lotMultipleQty"
                },
                {
                    visible: false,
                    width: "*",
                    name: "purchaseQty"
                },
                {
                    visible: true,
                    width: "*",
                    name: "vendorPrice"
                },
                {
                    visible: false,
                    width: "*",
                    name: "total"
                },
                {
                    visible: false,
                    width: "*",
                    name: "s7d"
                    
                },
                {
                    visible: true,
                    width: "*",
                    name: "s30d",
                    
                },
                {
                    visible: true,
                    width: "*",
                    name: "s90d"
                },
                {
                    visible: true,
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
                    visible: false,
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
                    visible: false,
                    width: "*",
                    name: "onHand"
                },
                {
                    visible: true,
                    width: "*",
                    name: "onHandMin"
                },
                {
                    visible: false,
                    width: "*",
                    name: "onHandThirdParty"
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
                    name: "lastOrderDate"
                },
                {
                    visible: false,
                    width: "*",
                    name: "nextScheduledOrderDate"
                },
                {
                    visible: true,
                    width: "*",
                    name: "daysUntilNextScheduledOrder"
                },
                {
                    visible: true,
                    width: "*",
                    name: "outOfStockDate"
                },
                {
                    visible: false,
                    width: "*",
                    name: "daysLeft"
                },
                {
                    visible: true,
                    width: "*",
                    name: "recommendedOrderDate"
                },
                {
                    visible: true,
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
                },

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
                    dir: "desc",
                    field: "dueDate",
                }
            ]
        };
        payload.itemType = "custom-all-available-items";
        payload.name = `sortedDueDateByDesc ${Number(faker.random.numeric(3))}`;
        
        this.attach(`Payload: ${JSON.stringify(payload, undefined, 4)}`)
        this.createGridViewCustomAllAvailableItemsResponse = await gridViewRequest.createGridView(this.request, Links.API_CREATE_GRIDVIEW, payload, this.headers);
        this.createGridViewCustomAllAvailableItemsResponseBody = JSON.parse(await this.createGridViewCustomAllAvailableItemsResponse.text())
        //logger.log('info', `Response after create ${link}` + JSON.stringify(this.createGridViewCustomAllAvailableItemsResponseBody, undefined, 4));
        this.attach(`Response after create ${link}` + JSON.stringify(this.createGridViewCustomAllAvailableItemsResponseBody, undefined, 4))
        // Get list after create grid view custom all available items new
        const options = {
            headers: this.headers
        }
        this.getGridViewCustomAllAvailableItemsResponse = await gridViewRequest.getGridViewCustomItems(this.request, link, options);
        if (this.getGridViewCustomAllAvailableItemsResponse.status() == 200) {
            this.getGridViewCustomAllAvailableItemsResponseBody = JSON.parse(await this.getGridViewCustomAllAvailableItemsResponse.text());
            logger.log('info', `Response GET ${link}` + JSON.stringify(this.getGridViewCustomAllAvailableItemsResponseBody, undefined, 4));
            this.attach(`Response GET ${link}` + JSON.stringify(this.getGridViewCustomAllAvailableItemsResponseBody, undefined, 4))
        }
    }
    
});

Then('{} picks random grid view of custom all available items in above response', async function (actor: string) {
    this.responseBodyOfAGridViewObject = await this.getGridViewCustomAllAvailableItemsResponseBody[Math.floor(Math.random() * this.getGridViewCustomAllAvailableItemsResponseBody.length)];
    logger.log('info', `Random grid view custom all available items: ${JSON.stringify(this.responseBodyOfAGridViewObject, undefined, 4)}`);
    this.attach(`Random grid view custom all available items: ${JSON.stringify(this.responseBodyOfAGridViewObject, undefined, 4)}`);
});

Then('{} checks values in response of get grid view custom all available items are correct', async function (actor: string) {
    const companyType = ['ASC', 'CSV', 'QBFS', 'QBO'];
    const expectedItemType = "custom-all-available-items";
    expect(this.responseBodyOfAGridViewObject.itemType, `In response body, itemType should be is: ${expectedItemType}`).toBe(expectedItemType);
    expect(companyType, `Company Type should be one of ${companyType}`).toContain(this.responseBodyOfAGridViewObject.companyType);
    expect(this.responseBodyOfAGridViewObject.companyKey).not.toBeNull();
})
