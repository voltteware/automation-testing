import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as gridViewRequest from '../../../../src/api/request/gridView.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { faker } from '@faker-js/faker';
import _ from "lodash";
import { gridViewPayLoadSupplier } from '../../../../src/utils/gridViewPayLoad';

let link: any;
let payload: gridViewPayLoadSupplier = {};

Then(`{} sets POST api endpoint to create grid view keys`, async function (actor: string) {
    link = Links.API_CREATE_GRIDVIEW;
});
//Payload sort
Then('{} sets request body with payload as name: {string} and itemType: {string} and dir: {string} and field: {string}',
    async function (actor, name, itemType, dir, field: string) {
        payload.gridState = {
            columns: [
                {
                    visible: true,
                    width: "*",
                    name: "name",
                    sort:{
                        direction: dir
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
                    dir: dir,
                    field: field,
                }
            ]

        };
        payload.itemType = itemType;
        if (name == 'random') {
            payload.name = `sortedNameByAsc_${Number(faker.datatype.number({ 'min': 1, 'max': 1000 }))}_${faker.animal.dog()}`;
        }else{
            payload.name = name;
        }
        this.attach(`Payload: ${JSON.stringify(payload, undefined, 4)}`)
    });

//Payload filter
Then('{} sets request body with payload as name: {string} and itemType: {string} and field: {string} and operator: {string} and logic: {string} and value: {int}',
    async function (actor, name, itemType, field, operator, logic: string, value: Number) {
        payload.gridState = {
            columns: [
                {
                    visible: true,
                    width: "*",
                    name: "name",
                },
                {
                    visible: true,
                    width: "*",
                    name: "serviceLevel",
                    filters: {
                        filters: [
                            {
                                field: field,
                                operator: operator,
                                value: value
                            }
                        ],
                        logic: logic
                    }
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
                    name: "links",
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
                filters: [
                    {
                        filters: [
                            {
                                field: field,
                                operator: operator,
                                value: value
                            }
                        ],
                        logic: logic
                    }
                ],
                logic: logic
            },
            sort: [
                {
                }
            ]

        };
        payload.itemType = itemType;
        if (name == 'random') {
            payload.name = `filterServiceLevel_${Number(faker.datatype.number({ 'min': 1, 'max': 1000 }))}_${faker.animal.cat()}`;
        }else{
            payload.name = name;
        }
        this.attach(`Payload: ${JSON.stringify(payload, undefined, 4)}`)
    });

Then('{} sends a POST method to create gridview', async function (actor: string) {
    this.response = this.createGridViewResponse = await gridViewRequest.createGridView(this.request, link, payload, this.headers);
    const responseBodyText = await this.createGridViewResponse.text();
    console.log(responseBodyText);
    if (this.createGridViewResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBodyOfAGridViewObject = JSON.parse(responseBodyText)
        logger.log('info', `Response POST ${link}` + JSON.stringify(this.responseBodyOfAGridViewObject, undefined, 4));
        this.attach(`Response POST ${link}` + JSON.stringify(this.responseBodyOfAGridViewObject, undefined, 4))
    }
    else if (responseBodyText.includes('<!doctype html>')) {
        logger.log('info', `Response POST ${link} ${responseBodyText}`);
        this.attach(`Response POST ${link} returns html`)
    }
})
    
Then('{} checks values in response of create grid view are correct', async function (actor: string) {
    const companyType = ['ASC', 'CSV', 'QBFS', 'QBO'];
    const expectedName = payload.name;
    const expectedItemType = payload.itemType;
    expect(this.responseBodyOfAGridViewObject.name, `In response body, name should be matched with the data request: ${expectedName}`).toBe(expectedName);
    expect(this.responseBodyOfAGridViewObject.itemType, `In response body, itemType should be matched with the data request: ${expectedItemType}`).toBe(expectedItemType);
    expect(companyType, `Company Type should be one of ${companyType}`).toContain(this.responseBodyOfAGridViewObject.companyType);
    expect(this.responseBodyOfAGridViewObject.companyKey).not.toBeNull();
})