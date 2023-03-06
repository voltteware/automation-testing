import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as gridViewRequest from '../../../../src/api/request/gridView.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";
import { faker } from '@faker-js/faker';
import { gridViewPayLoadBom, gridViewPayLoadSupplier } from '../../../../src/utils/gridViewPayLoad';

let link: any;
let payload: gridViewPayLoadBom = {};

Then(`{} sets GET api endpoint to get grid view boms`, async function (actor: string) {
    link = Links.API_GET_GRIDVIEW_BOM;
});

Then(`{} sends a GET request to get grid view boms of {} by company key and company type`, async function (actor, email: string) {
    const options = {
        headers: this.headers
    }
    this.getGridViewBomResponse = this.response = await gridViewRequest.getGridViewBom(this.request, link, options);
    const responseBodyText = await this.getGridViewBomResponse.text();
    if (this.getGridViewBomResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getGridViewBomResponseBody = JSON.parse(await this.getGridViewBomResponse.text());
        logger.log('info', `Response GET ${link}` + JSON.stringify(this.getGridViewBomResponseBody, undefined, 4));
        this.attach(`Response GET ${link}` + JSON.stringify(this.getGridViewBomResponseBody, undefined, 4))
    }
    else if (responseBodyText.includes('<!doctype html>')) {
        logger.log('info', `Response GET ${link} ${responseBodyText}`);
        this.attach(`Response GET ${link} returns html`)
    }
})

Then('Check grid view bom exist in the company, if it does not exist will create grid view bom', async function () {
    if (this.getGridViewBomResponseBody.length < 1) {
        payload.gridState = {
            columns: [
                {
                    visible: true,
                    width: "*",
                    name: "qty",
                    sort:{
                        direction: "desc"
                    }
                },
                {
                    visible: true,
                    width: "*",
                    name: "parentName",
                },
                {
                    visible: true,
                    width: "*",
                    name: "childName",
                },
                {}
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
                    field: "qty",
                }
            ]

        };
        payload.itemType = "bom";
        payload.name = `sortedKitQtyByDesc ${Number(faker.random.numeric(3))}`;
        this.attach(`Payload: ${JSON.stringify(payload, undefined, 4)}`)

        this.createGridViewBomResponse = await gridViewRequest.createGridView(this.request, Links.API_CREATE_GRIDVIEW, payload, this.headers);
        this.createGridViewBomResponseBody = JSON.parse(await this.createGridViewBomResponse.text())
        //logger.log('info', `Response after create ${link}` + JSON.stringify(this.createGridViewSupplierResponseBody, undefined, 4));
        this.attach(`Response after create ${link}` + JSON.stringify(this.createGridViewBomResponseBody, undefined, 4))
        // Get list after create grid view supplier new
        const options = {
            headers: this.headers
        }
        this.getGridViewBomResponse = await gridViewRequest.getGridViewBom(this.request, link, options);
        if (this.getGridViewBomResponse.status() == 200) {
            this.getGridViewBomResponseBody = JSON.parse(await this.getGridViewBomResponse.text());
            logger.log('info', `Response GET ${link}` + JSON.stringify(this.getGridViewBomResponseBody, undefined, 4));
            this.attach(`Response GET ${link}` + JSON.stringify(this.getGridViewBomResponseBody, undefined, 4))
        }
    }
})

Then('{} picks random grid view of bom in above response', async function (actor: string) {
    this.responseBodyOfAGridViewObject = await this.getGridViewBomResponseBody[Math.floor(Math.random() * this.getGridViewBomResponseBody.length)];
    logger.log('info', `Random grid view bom: ${JSON.stringify(this.responseBodyOfAGridViewObject, undefined, 4)}`);
    this.attach(`Random grid view bom: ${JSON.stringify(this.responseBodyOfAGridViewObject, undefined, 4)}`);
})

Then('{} checks values in response of get grid view bom are correct', async function (actor: string) {
    const companyType = ['ASC', 'CSV', 'QBFS', 'QBO'];
    const expecteditemType = "bom";
    expect(this.responseBodyOfAGridViewObject.itemType, `In response body, itemType should be is: ${expecteditemType}`).toBe(expecteditemType);
    expect(companyType, `Company Type should be one of ${companyType}`).toContain(this.responseBodyOfAGridViewObject.companyType);
    expect(this.responseBodyOfAGridViewObject.companyKey).not.toBeNull();
})

