import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as gridViewDemandRequest from '../../../../src/api/request/gridView.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";
import { faker } from '@faker-js/faker';

let link: any;
let payload: {
    gridState?: {
        columns?: [
            {
                visible?: boolean,
                width?: string,
                name?: string,
                sort?:{
                    direction: string
                }
            },
            {
                visible?: boolean,
                width?: string,
                name?: string,
                filters?: {
                    filters?: [
                        {
                            field?: string,
                            operator?: string,
                            value?: Number
                        }
                    ],
                    logic?: string
                }
            },
            {
                visible?: boolean,
                width?: string,
                name?: string,
            },
            {
                visible?: boolean,
                width?: string,
                name?: string,
            },
            {
                visible?: boolean,
                width?: string,
                name?: string,
            },
            {
                visible?: boolean,
                width?: string,
                name?: string,
            },
            {
                visible?: boolean,
                width?: string,
                name?: string,
            },
            {
                visible?: boolean,
                width?: string,
                name?: string,
            },
            {
                visible?: boolean,
                width?: string,
                name?: string,
            },
            {
                visible?: boolean,
                width?: string,
                name?: string,
            },
            {
                visible?: boolean,
                width?: string,
                name?: string,
            }
        ],
        scrollFocus?: {},
        selection?: [],
        grouping?: {},
        treeView?: {},
        pagination?:{
            paginationCurrentPage?: Number,
            paginationPageSize?: Number
        },
        filter?: {
            filters?: [
                {
                    filters?:[
                        {
                            field?: string,
                            operator?: string,
                            value?: Number
                        }
                    ],
                    logic?: string
                }
            ],
            logic?: string
        },
        sort?: [
            {
                dir?: string,
                field?: string,
            }
        ]
    },
    name?: string,
    itemType?: string 
} = {};

Then(`{} sets GET api endpoint to get grid view demand keys`, async function (actor: string) {
    link = Links.API_GET_GRIDVIEW_DEMAND;
});

Then(`{} sends a GET request to get grid view demand of {} by company key and company type`, async function (actor, email: string) {
    const options = {
        headers: this.headers
    }
    this.getGridViewDemandResponse = this.response = await gridViewDemandRequest.getGridViewDemand(this.request, link, options);
    const responseBodyText = await this.getGridViewDemandResponse.text();
    if (this.getGridViewDemandResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getGridViewDemandResponseBody = JSON.parse(await this.getGridViewDemandResponse.text());
        // logger.log('info', `Response GET ${link}` + JSON.stringify(this.getGridViewDemandResponseBody, undefined, 4));
        this.attach(`Response GET ${link}` + JSON.stringify(this.getGridViewDemandResponseBody, undefined, 4))
    }
    else if (responseBodyText.includes('<!doctype html>')) {
        logger.log('info', `Response GET ${link} ${responseBodyText}`);
        this.attach(`Response GET ${link} returns html`)
    }
})

Then('Check grid view demand exist in the company, if it does not exist will create grid view demand', async function () {
    if (this.getGridViewDemandResponseBody.length < 1) {
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
        payload.itemType = "demand";
        payload.name = `sortedName ${Number(faker.random.numeric(3))}`;
        this.attach(`Payload: ${JSON.stringify(payload, undefined, 4)}`)

        this.createGridViewDemandResponse = await gridViewDemandRequest.createGridView(this.request, Links.API_CREATE_GRIDVIEW, payload, this.headers);
        this.createGridViewDemandResponseBody = JSON.parse(await this.createGridViewDemandResponse.text())
        //logger.log('info', `Response after create ${link}` + JSON.stringify(this.createGridViewDemandResponseBody, undefined, 4));
        this.attach(`Response after create ${link}` + JSON.stringify(this.createGridViewDemandResponseBody, undefined, 4))
        // Get list after create grid view demand new
        const options = {
            headers: this.headers
        }
        this.getGridViewDemandResponse = await gridViewDemandRequest.getGridViewDemand(this.request, link, options);
        if (this.getGridViewDemandResponse.status() == 200) {
            this.getGridViewDemandResponseBody = JSON.parse(await this.getGridViewDemandResponse.text());
            logger.log('info', `Response GET ${link}` + JSON.stringify(this.getGridViewDemandResponseBody, undefined, 4));
            this.attach(`Response GET ${link}` + JSON.stringify(this.getGridViewDemandResponseBody, undefined, 4))
        }
    }
})

Then('{} picks random grid view of demand in above response', async function (actor: string) {
    this.responseBodyOfAGridViewObject = await this.getGridViewDemandResponseBody[Math.floor(Math.random() * this.getGridViewDemandResponseBody.length)];
    logger.log('info', `Random grid view demand: ${JSON.stringify(this.responseBodyOfAGridViewObject, undefined, 4)}`);
    this.attach(`Random grid view demand: ${JSON.stringify(this.responseBodyOfAGridViewObject, undefined, 4)}`);
})

Then('{} checks values in response of get grid view demand are correct', async function (actor: string) {
    const companyType = ['ASC', 'CSV', 'QBFS', 'QBO'];
    const expectedItemType = "demand";
    expect(this.responseBodyOfAGridViewObject.itemType, `In response body, itemType should be is: ${expectedItemType}`).toBe(expectedItemType);
    expect(companyType, `Company Type should be one of ${companyType}`).toContain(this.responseBodyOfAGridViewObject.companyType);
    expect(this.responseBodyOfAGridViewObject.companyKey).not.toBeNull();
})
