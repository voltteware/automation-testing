import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as gridViewRequest from '../../../../src/api/request/gridView.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";
import { faker } from '@faker-js/faker';
import { gridViewPayLoadSuggestedPos } from '../../../../src/utils/gridViewPayLoad';

let link: any;
let payload: gridViewPayLoadSuggestedPos = {};

Then(`{} sets GET api endpoint to get grid view suggested pos`, async function (actor: string) {
    link = Links.API_GET_GRIDVIEW_SUGGESTED_POS;
});

Then(`{} sends a GET request to get grid view suggested pos`, async function (actor) {
    const options = {
        headers: this.headers
    }
    this.getGridViewSuggestedPosResponse = this.response = await gridViewRequest.getGridViewSuggestedPos(this.request, link, options);
    const responseBodyText = await this.getGridViewSuggestedPosResponse.text();
    if (this.getGridViewSuggestedPosResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getGridViewSuggestedPosResponseBody = JSON.parse(await this.getGridViewSuggestedPosResponse.text());
        logger.log('info', `Response GET ${link}` + JSON.stringify(this.getGridViewSuggestedPosResponseBody, undefined, 4));
        this.attach(`Response GET ${link}` + JSON.stringify(this.getGridViewSuggestedPosResponseBody, undefined, 4))
    }
    else if (responseBodyText.includes('<!doctype html>')) {
        logger.log('info', `Response GET ${link} ${responseBodyText}`);
        this.attach(`Response GET ${link} returns html`)
    }
});

Then('Check grid view suggested pos exist in the company, if it does not exist will create grid view suggested pos', async function () {
    if (this.getGridViewSuggestedPosResponseBody.length < 1) {
        payload.gridState = {
            columns: [
                {
                    visible: true,
                    width: "*",
                    name: "totalQty",
                    sort:{
                        direction: "asc"
                    }
                },
                {
                    visible: true,
                    width: "*",
                    name: "earliestDueDate"
                },
                {
                    visible: true,
                    width: "*",
                    name: "uniqueItems"
                },
                {
                    visible: true,
                    width: "*",
                    name: "vendorName"
                },
                {
                    visible: true,
                    width: "*",
                    name: "totalPrice"
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
                    field: "totalQty"
                }
            ]
        };
        payload.itemType = "suggested-pos";
        payload.name = `sortedSuggestedPosByAsc ${Number(faker.random.numeric(3))}`;
        this.attach(`Payload: ${JSON.stringify(payload, undefined, 4)}`)

        this.createGridViewSuggestedPosResponse = await gridViewRequest.createGridView(this.request, Links.API_CREATE_GRIDVIEW, payload, this.headers);
        this.createGridViewSuggestedPosResponseBody = JSON.parse(await this.createGridViewSuggestedPosResponse.text())
        //logger.log('info', `Response after create ${link}` + JSON.stringify(this.createGridViewSuggestedPosResponseBody, undefined, 4));
        this.attach(`Response after create ${link}` + JSON.stringify(this.createGridViewSuggestedPosResponseBody, undefined, 4))
        // Get list after create grid view Suggested Pos new
        const options = {
            headers: this.headers
        }
        this.getGridViewSuggestedPosResponse = await gridViewRequest.getGridViewCustomItems(this.request, link, options);
        if (this.getGridViewSuggestedPosResponse.status() == 200) {
            this.getGridViewSuggestedPosResponseBody = JSON.parse(await this.getGridViewSuggestedPosResponse.text());
            logger.log('info', `Response GET ${link}` + JSON.stringify(this.getGridViewSuggestedPosResponseBody, undefined, 4));
            this.attach(`Response GET ${link}` + JSON.stringify(this.getGridViewSuggestedPosResponseBody, undefined, 4))
        }
    }
});

Then('{} picks random grid view of suggested pos in above response', async function (actor: string) {
    this.responseBodyOfAGridViewObject = await this.getGridViewSuggestedPosResponseBody[Math.floor(Math.random() * this.getGridViewSuggestedPosResponseBody.length)];
    logger.log('info', `Random grid view custom items in PO: ${JSON.stringify(this.responseBodyOfAGridViewObject, undefined, 4)}`);
    this.attach(`Random grid view custom items in PO: ${JSON.stringify(this.responseBodyOfAGridViewObject, undefined, 4)}`);
});

Then('{} checks values in response of get grid view suggested pos are correct', async function (actor: string) {
    const companyType = ['ASC', 'CSV', 'QBFS', 'QBO'];
    const expectedItemType = "suggested-pos";
    expect(this.responseBodyOfAGridViewObject.itemType, `In response body, itemType should be is: ${expectedItemType}`).toBe(expectedItemType);
    expect(companyType, `Company Type should be one of ${companyType}`).toContain(this.responseBodyOfAGridViewObject.companyType);
    expect(this.responseBodyOfAGridViewObject.companyKey).not.toBeNull();
})
