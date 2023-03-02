import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as gridViewSupplierRequest from '../../../../src/api/request/gridView.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";
import { faker } from '@faker-js/faker';
import { gridViewPayLoadSupplier } from '../../../../src/utils/gridViewPayLoad';

let link: any;
let payload: gridViewPayLoadSupplier = {};

Then(`{} sets GET api endpoint to get grid view suppliers keys`, async function (actor: string) {
    link = Links.API_GET_GRIDVIEW_SUPPLIER;
});

Then(`{} sends a GET request to get grid view suppliers of {} by company key and company type`, async function (actor, email: string) {
    const options = {
        headers: this.headers
    }
    this.getGridViewSupplierResponse = this.response = await gridViewSupplierRequest.getGridViewSupplier(this.request, link, options);
    const responseBodyText = await this.getGridViewSupplierResponse.text();
    if (this.getGridViewSupplierResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getGridViewSupplierResponseBody = JSON.parse(await this.getGridViewSupplierResponse.text());
        // logger.log('info', `Response GET ${link}` + JSON.stringify(this.getGridViewSupplierResponseBody, undefined, 4));
        this.attach(`Response GET ${link}` + JSON.stringify(this.getGridViewSupplierResponseBody, undefined, 4))
    }
    else if (responseBodyText.includes('<!doctype html>')) {
        logger.log('info', `Response GET ${link} ${responseBodyText}`);
        this.attach(`Response GET ${link} returns html`)
    }
})

Then('Check grid view supplier exist in the company, if it does not exist will create grid view supplier', async function () {
    if (this.getGridViewSupplierResponseBody.length < 1) {
        payload.gridState = {
            columns: [
                {
                    visible: true,
                    width: "*",
                    name: "name",
                    sort:{
                        direction: "asc"
                    }
                },
                {
                    visible: true,
                    width: "*",
                    name: "links",
                },
                {
                    visible: true,
                    width: "*",
                    name: "averageHistoryLength",
                },
                {
                    visible: true,
                    width: "*",
                    name: "leadTime",
                },
                {
                    visible: true,
                    width: "*",
                    name: "serviceLevel",
                },
                {
                    visible: true,
                    width: "*",
                    name: "freeFreightMinimum",
                },
                {
                    visible: true,
                    width: "*",
                    name: "targetOrderValue",
                },
                {
                    visible: true,
                    width: "*",
                    name: "orderInterval",
                },
                {
                    visible: true,
                    width: "*",
                    name: "isHidden",
                },
                {
                    visible: true,
                    width: "*",
                    name: "description",
                },
                {
                    visible: true,
                    width: "*",
                    name: "restockModel",
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
            },
            sort: [
                {
                    dir: "asc",
                    field: "name",
                }
            ]

        };
        payload.itemType = "supplier";
        payload.name = `sortedName ${Number(faker.random.numeric(3))}`;
        this.attach(`Payload: ${JSON.stringify(payload, undefined, 4)}`)

        this.createGridViewSupplierResponse = await gridViewSupplierRequest.createGridView(this.request, Links.API_CREATE_GRIDVIEW, payload, this.headers);
        this.createGridViewSupplierResponseBody = JSON.parse(await this.createGridViewSupplierResponse.text())
        //logger.log('info', `Response after create ${link}` + JSON.stringify(this.createGridViewSupplierResponseBody, undefined, 4));
        this.attach(`Response after create ${link}` + JSON.stringify(this.createGridViewSupplierResponseBody, undefined, 4))
        // Get list after create grid view supplier new
        const options = {
            headers: this.headers
        }
        this.getGridViewSupplierResponse = await gridViewSupplierRequest.getGridViewSupplier(this.request, link, options);
        if (this.getGridViewSupplierResponse.status() == 200) {
            this.getGridViewSupplierResponseBody = JSON.parse(await this.getGridViewSupplierResponse.text());
            logger.log('info', `Response GET ${link}` + JSON.stringify(this.getGridViewSupplierResponseBody, undefined, 4));
            this.attach(`Response GET ${link}` + JSON.stringify(this.getGridViewSupplierResponseBody, undefined, 4))
        }
    }
})

Then('{} picks random grid view of suppliers in above response', async function (actor: string) {
    this.responseBodyOfAGridViewObject = await this.getGridViewSupplierResponseBody[Math.floor(Math.random() * this.getGridViewSupplierResponseBody.length)];
    logger.log('info', `Random grid view supplier: ${JSON.stringify(this.responseBodyOfAGridViewObject, undefined, 4)}`);
    this.attach(`Random grid view supplier: ${JSON.stringify(this.responseBodyOfAGridViewObject, undefined, 4)}`);
})

Then('{} checks values in response of get grid view supplier are correct', async function (actor: string) {
    const companyType = ['ASC', 'CSV', 'QBFS', 'QBO'];
    const expecteditemType = "supplier";
    expect(this.responseBodyOfAGridViewObject.itemType, `In response body, itemType should be is: ${expecteditemType}`).toBe(expecteditemType);
    expect(companyType, `Company Type should be one of ${companyType}`).toContain(this.responseBodyOfAGridViewObject.companyType);
    expect(this.responseBodyOfAGridViewObject.companyKey).not.toBeNull();
})

