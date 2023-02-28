import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as gridViewRequest from '../../../../src/api/request/gridView.service';
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

Then(`{} sets GET api endpoint to get grid view item`, async function (actor: string) {
    link = Links.API_GET_GRIDVIEW_ITEM;
});

Then(`{} sends a GET request to get grid view item of {} by company key and company type`, async function (actor, email: string) {
    const options = {
        headers: this.headers
    }
    this.getGridViewItemResponse = this.response = await gridViewRequest.getGridViewItem(this.request, link, options);
    const responseBodyText = await this.getGridViewItemResponse.text();
    if (this.getGridViewItemResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getGridViewItemResponseBody = JSON.parse(await this.getGridViewItemResponse.text());
        // logger.log('info', `Response GET ${link}` + JSON.stringify(this.getGridViewItemResponseBody, undefined, 4));
        this.attach(`Response GET ${link}` + JSON.stringify(this.getGridViewItemResponseBody, undefined, 4))
    }
    else if (responseBodyText.includes('<!doctype html>')) {
        logger.log('info', `Response GET ${link} ${responseBodyText}`);
        this.attach(`Response GET ${link} returns html`)
    }
})

Then('{} picks random grid view of item in above response', async function (actor: string) {
    this.responseBodyOfAGridViewObject = await this.getGridViewItemResponseBody[Math.floor(Math.random() * this.getGridViewItemResponseBody.length)];
    logger.log('info', `Random grid view Item: ${JSON.stringify(this.responseBodyOfAGridViewObject, undefined, 4)}`);
    this.attach(`Random grid view Item: ${JSON.stringify(this.responseBodyOfAGridViewObject, undefined, 4)}`);
})

Then('{} checks values in response of get grid view item are correct', async function (actor: string) {
    const companyType = ['ASC', 'CSV', 'QBFS', 'QBO'];
    const expecteditemType = 'item';
    expect(this.responseBodyOfAGridViewObject.itemType, `In response body, itemType should be is: ${expecteditemType}`).toBe(expecteditemType);
    expect(companyType, `Company Type should be one of ${companyType}`).toContain(this.responseBodyOfAGridViewObject.companyType);
    expect(this.responseBodyOfAGridViewObject.companyKey).not.toBeNull();
})

Then('Check grid view Item exist in the company, if it does not exist will create grid view Item', async function () {
    if (this.getGridViewItemResponseBody.length < 1) {
        if(this.companyType == "ASC"){
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
                        name: "history",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "links",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "imageUrl",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "description",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "vendorName",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "vendorPrice",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "moq",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "leadTime",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "orderInterval",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "serviceLevel",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "onHand",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "onHandMin",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "onHandThirdParty",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "onHandThirdPartyMin",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "isHidden",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "useHistoryOverride",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "lotMultipleQty",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "lotMultipleItemName",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "tags",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "useBackfill",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "createdAt",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "itemHistoryLength",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "s7d",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "s30d",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "s90d",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "s365d",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "fnsku",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "packageWeight",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "onHandFbm",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "prepGuide",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "prepNotes",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "ItemRebate",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "inboundShippingCost",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "reshippingCost",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "repackagingMaterialCost",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "repackingLaborCost",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "dimensionalWeight",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "hazmat",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "oversized",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "category",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "upc",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "ean",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "rank",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "inventorySourcePreference",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "average7DayPrice",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "isFbm",
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
        }else{
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
                        name: "history",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "description",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "vendorName",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "vendorPrice",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "moq",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "leadTime",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "orderInterval",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "serviceLevel",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "onHand",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "onHandMin",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "onHandThirdParty",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "onHandThirdPartyMin",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "isHidden",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "useHistoryOverride",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "lotMultipleQty",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "lotMultipleItemName",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "tags",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "useBackfill",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "createdAt",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "itemHistoryLength",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "s7d",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "s30d",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "s90d",
                    },
                    {
                        visible: true,
                        width: "*",
                        name: "s365d",
                    },
                    {},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},
                   
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
        }
        payload.itemType = "item";
        payload.name = `sortedNameByAsc ${Number(faker.random.numeric(3))}`;
        this.attach(`Payload: ${JSON.stringify(payload, undefined, 4)}`)

        this.createGridViewItemResponse = await gridViewRequest.createGridView(this.request, Links.API_CREATE_GRIDVIEW, payload, this.headers);
        this.createGridViewItemResponseBody = JSON.parse(await this.createGridViewItemResponse.text())
        this.attach(`Response after create ${link}` + JSON.stringify(this.createGridViewItemResponseBody, undefined, 4))
        // Get list after create grid view Item new
        const options = {
            headers: this.headers
        }
        this.getGridViewItemResponse = await gridViewRequest.getGridViewItem(this.request, link, options);
        if (this.getGridViewItemResponse.status() == 200) {
            this.getGridViewItemResponseBody = JSON.parse(await this.getGridViewItemResponse.text());
            logger.log('info', `Response GET ${link}` + JSON.stringify(this.getGridViewItemResponseBody, undefined, 4));
            this.attach(`Response GET ${link}` + JSON.stringify(this.getGridViewItemResponseBody, undefined, 4))
        }
    }
})

