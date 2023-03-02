import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as gridViewRequest from '../../../../src/api/request/gridView.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";
import { faker } from '@faker-js/faker';
import { gridViewPayLoadSupplier } from '../../../../src/utils/gridViewPayLoad';

let link: any;
let payload: gridViewPayLoadSupplier = {};

Then(`{} sets GET api endpoint to get grid view supplys`, async function (actor: string) {
    link = Links.API_GET_GRIDVIEW_SUPPLY;
});

Then(`{} sends a GET request to get grid view supplys of {} by company key and company type`, async function (actor, email: string) {
    const options = {
        headers: this.headers
    }
    this.getGridViewSupplyResponse = this.response = await gridViewRequest.getGridViewSupply(this.request, link, options);
    const responseBodyText = await this.getGridViewSupplyResponse.text();
    if (this.getGridViewSupplyResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getGridViewSupplyResponseBody = JSON.parse(await this.getGridViewSupplyResponse.text());
        // logger.log('info', `Response GET ${link}` + JSON.stringify(this.getGridViewSupplierResponseBody, undefined, 4));
        this.attach(`Response GET ${link}` + JSON.stringify(this.getGridViewSupplyResponseBody, undefined, 4))
    }
    else if (responseBodyText.includes('<!doctype html>')) {
        logger.log('info', `Response GET ${link} ${responseBodyText}`);
        this.attach(`Response GET ${link} returns html`)
    }
})

Then('Check grid view supply exist in the company, if it does not exist will create grid view supply', async function () {
    if (this.getGridViewSupplyResponseBody.length < 1) {
        payload.gridState = {
            columns: [
                {
                    visible: true,
                    width: "*",
                    name: "docDate",
                    sort:{
                        direction: "desc"
                    }
                },
                {
                    visible: true,
                    width: "*",
                    name: "refNum",
                },
                {
                    visible: true,
                    width: "*",
                    name: "vendorName",
                },
                {
                    visible: true,
                    width: "*",
                    name: "dueDate",
                },
                {
                    visible: true,
                    width: "*",
                    name: "itemKey",
                },
                {
                    visible: true,
                    width: "*",
                    name: "itemName",
                },
                {
                    visible: true,
                    width: "*",
                    name: "orderQty",
                },
                {
                    visible: true,
                    width: "*",
                    name: "openQty",
                },
                {},{},{}
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
            },
            sort: [
                {
                    dir: "desc",
                    field: "docDate",
                }
            ]

        };
        payload.itemType = "supply";
        payload.name = `sortedDateByDesc ${Number(faker.random.numeric(3))}`;
        this.attach(`Payload: ${JSON.stringify(payload, undefined, 4)}`)

        this.createGridViewSupplyResponse = await gridViewRequest.createGridView(this.request, Links.API_CREATE_GRIDVIEW, payload, this.headers);
        this.createGridViewSupplyResponseBody = JSON.parse(await this.createGridViewSupplyResponse.text())
        //logger.log('info', `Response after create ${link}` + JSON.stringify(this.createGridViewSupplierResponseBody, undefined, 4));
        this.attach(`Response after create ${link}` + JSON.stringify(this.createGridViewSupplyResponseBody, undefined, 4))
        // Get list after create grid view supplier new
        const options = {
            headers: this.headers
        }
        this.getGridViewSupplyResponse = await gridViewRequest.getGridViewSupply(this.request, link, options);
        if (this.getGridViewSupplyResponse.status() == 200) {
            this.getGridViewSupplyResponseBody = JSON.parse(await this.getGridViewSupplyResponse.text());
            logger.log('info', `Response GET ${link}` + JSON.stringify(this.getGridViewSupplyResponseBody, undefined, 4));
            this.attach(`Response GET ${link}` + JSON.stringify(this.getGridViewSupplyResponseBody, undefined, 4))
        }
    }
})

Then('{} picks random grid view of supply in above response', async function (actor: string) {
    this.responseBodyOfAGridViewObject = await this.getGridViewSupplyResponseBody[Math.floor(Math.random() * this.getGridViewSupplyResponseBody.length)];
    logger.log('info', `Random grid view supply: ${JSON.stringify(this.responseBodyOfAGridViewObject, undefined, 4)}`);
    this.attach(`Random grid view supply: ${JSON.stringify(this.responseBodyOfAGridViewObject, undefined, 4)}`);
})

Then('{} checks values in response of get grid view supply are correct', async function (actor: string) {
    const companyType = ['ASC', 'CSV', 'QBFS', 'QBO'];
    const expecteditemType = "supply";
    expect(this.responseBodyOfAGridViewObject.itemType, `In response body, itemType should be is: ${expecteditemType}`).toBe(expecteditemType);
    expect(companyType, `Company Type should be one of ${companyType}`).toContain(this.responseBodyOfAGridViewObject.companyType);
    expect(this.responseBodyOfAGridViewObject.companyKey).not.toBeNull();
})

