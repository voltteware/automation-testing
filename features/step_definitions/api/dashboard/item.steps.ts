import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as itemRequest from '../../../../src/api/request/item.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { faker } from '@faker-js/faker';
import _ from "lodash";

let link: string;
var linkGetAllItems: string;
let linkLimitRow: string;

Then(`{} sets GET api endpoint to get item summary`, async function (actor: string) {
    link = `${Links.API_ITEMS}?summary=true&companyKey=${this.companyKey}&companyType=${this.companyType}`;
});

Then(`{} sets GET api endpoint to get item with limit row: {}`, async function (actor, limitRow: string) {
    linkLimitRow = `${Links.API_ITEMS}?offset=0&limit=${limitRow}`;
});

Then(`{} sends a GET request to get list items`, async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getItemsResponse = this.response = await itemRequest.getItem(this.request, linkLimitRow, options);
    const responseBodyText = await this.getItemsResponse.text();
    if (this.getItemsResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getItemsResponseBody = JSON.parse(await this.getItemsResponse.text());
        // logger.log('info', `Response GET ${link}` + JSON.stringify(this.getSupplierResponseBody, undefined, 4));
        // this.attach(`Response GET ${link}` + JSON.stringify(this.getSupplierResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
})

Then(`{} sends GET api request to get all items`, async function (actor: string) {
    const linkGetItemCount = `${Links.API_ITEMS}/count`
    const getItemCountResponse = await itemRequest.getItemCount(this.request, linkGetItemCount, { headers: this.headers });
    expect(getItemCountResponse.status()).toBe(200);
    const totalItemsCount = Number(await getItemCountResponse.text());
    logger.log('info', `Total Items: ${totalItemsCount}`);
    this.attach(`Total Items: ${totalItemsCount}`)
    linkGetAllItems = `${Links.API_ITEMS}?offset=0&limit=${totalItemsCount}`;

    this.getAllItemsResponse = await itemRequest.getItemCount(this.request, linkGetAllItems, { headers: this.headers });

    const responseBodyText = await this.getAllItemsResponse.text();
    if (this.getAllItemsResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getAllItemsResponseBody = JSON.parse(responseBodyText);
    }
    else {
        logger.log('info', `Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()}`);
        this.attach(`Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()}`)
    }
});

Then(`{} sends a GET request to get item summary`, async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getItemSummaryResponse = this.response = await itemRequest.getItemSummary(this.request, link, options);
    const responseBodyText = await this.getItemSummaryResponse.text();
    if (this.getItemSummaryResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getItemSummaryResponseBody = JSON.parse(responseBodyText);
        logger.log('info', `Response GET ${link}` + JSON.stringify(this.getItemSummaryResponseBody, undefined, 4));
        this.attach(`Response GET ${link}` + JSON.stringify(this.getItemSummaryResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
})

Then('{} checks API contract in item summary object are correct', async function (actor: string) {
    if (this.
        getItemSummaryResponseBody.err !== null) {
        expect(typeof (this.getItemSummaryResponseBody.err), 'Type of err value should be string').toBe("string");
        logger.log('info', `Response GET Item Summary has err${this.getItemSummaryResponseBody.err}`);
        this.attach(`Response GET Item Summary has err${this.getItemSummaryResponseBody.err}`)
    }
    else {
        expect(this.getItemSummaryResponseBody.err, 'err value should be null').toBeNull();
    }

    expect(typeof (this.getItemSummaryResponseBody.model), 'Type of model value should be object').toBe("object");
    expect(typeof (Number(this.getItemSummaryResponseBody.model.onHandCount)), 'Type of onHandCount value should be string').toBe("number");
    expect(typeof (Number(this.getItemSummaryResponseBody.model.onHandThirdPartyCount)), 'Type of onHandThirdPartyCount value should be number').toBe("number");
    expect(typeof (Number(this.getItemSummaryResponseBody.model.olderThan30DaysCount)), 'Type of olderThan30DaysCount value should be number').toBe("number");
    expect(typeof (Number(this.getItemSummaryResponseBody.model.missingVendorCount)), 'Type of missingVendorCount value should be number').toBe("number");
})

Then('{} checks number Items Out of Stock in response of item summary is correct', async function (actor: string) {
    const onHandCount = Number(this.getItemSummaryResponseBody.model.onHandCount);
    expect(onHandCount, `onHandCount should be greater than or equal 0`).toBeGreaterThanOrEqual(0);
    const expectedOnHandCount = this.getAllItemsResponseBody.filter((item: any) => item.onHand == 0 || item.onHand == null).length;
    expect(onHandCount, `onHandCount should be equal ${expectedOnHandCount}`).toEqual(expectedOnHandCount);
})

Then('{} checks number Items Out of Stock - Warehouse in response of item summary is correct', async function (actor: string) {
    const onHandThirdPartyCount = Number(this.getItemSummaryResponseBody.model.onHandThirdPartyCount);
    expect(onHandThirdPartyCount, `onHandThirdPartyCount should be greater than or equal 0`).toBeGreaterThanOrEqual(0);
    const expectedOnHandThirdPartyCount = this.getAllItemsResponseBody.filter((item: any) => item.onHandThirdParty == 0 || item.onHandThirdParty == null).length;
    expect(onHandThirdPartyCount, `onHandThirdPartyCount should be equal ${expectedOnHandThirdPartyCount}`).toEqual(expectedOnHandThirdPartyCount);
})

Then('{} checks number New Items last 30 days in response of item summary is correct', async function (actor: string) {
    const olderThan30DaysCount = Number(this.getItemSummaryResponseBody.model.olderThan30DaysCount);
    expect(olderThan30DaysCount, `olderThan30DaysCount should be greater than or equal 0`).toBeGreaterThanOrEqual(0);
    const last30Days = new Date(new Date().setDate(new Date().getDate() - 30));
    const expectedNewItemLast30Days = this.getAllItemsResponseBody.filter((item: any) => new Date(item.createdAt) >= new Date(last30Days)).length;
    expect(olderThan30DaysCount, `olderThan30DaysCount in response should be equal ${expectedNewItemLast30Days}`).toEqual(expectedNewItemLast30Days);
})

Then('{} checks number Items without Vendors Assigned in response of item summary is correct', async function (actor: string) {
    const missingVendorCount = Number(this.getItemSummaryResponseBody.model.missingVendorCount);
    expect(missingVendorCount, `missingVendorCount should be greater than or equal 0`).toBeGreaterThanOrEqual(0);
    const expectedmissingVendorCount = this.getAllItemsResponseBody.filter((item: any) => item.vendorKey == null).length;
    expect(missingVendorCount, `missingVendorCount should be equal ${expectedmissingVendorCount}`).toEqual(expectedmissingVendorCount);
})

Given('User picks a random imtem in above list items', async function () {
    this.responseBodyOfAItemObject = await this.getItemsResponseBody[Math.floor(Math.random() * this.getItemsResponseBody.length)];
    logger.log('info', `Random Item: ${JSON.stringify(this.responseBodyOfAItemObject, undefined, 4)}`);
    this.attach(`Random Item: ${JSON.stringify(this.responseBodyOfAItemObject, undefined, 4)}`);
});

Then(`{} saves the item key`, async function (actor: string) {
    this.itemKey = this.responseBodyOfAItemObject.key
    logger.log('info', `Item key to edit: ${this.itemKey}`);
    this.attach(`Item key to edit: ${this.itemKey}`)
});

Given('User sets PUT api endpoint to edit {} of the above item for company type {} with new value: {}', async function (editColumn: string, companyType: string, value: string) {
    // Prepare endpoint for request to edit item
    link = `${Links.API_ITEMS}/${this.itemKey}`

    switch (editColumn) {
        case 'itemName':
            if (value == 'random') {
                this.name = `${faker.random.alphaNumeric(10).toUpperCase()}-${faker.datatype.number(500)}-Auto`;
            }

            logger.log('info', `New ${editColumn}: ${this.name}`);
            this.attach(`New ${editColumn}: ${this.name}`);
            break;
        case 'asin':
            if (value == 'random') {
                this.asin = `${faker.random.alphaNumeric(10).toUpperCase()}`;
            }

            logger.log('info', `New ${editColumn}: ${this.asin}`);
            this.attach(`New ${editColumn}: ${this.asin}`);
            break;
        case 'fnsku':
            if (value == 'random') {
                this.fnsku = `${faker.random.alphaNumeric(10).toUpperCase()}`;
            }

            logger.log('info', `New ${editColumn}: ${this.fnsku}`);
            this.attach(`New ${editColumn}: ${this.fnsku}`);
            break;
        case 'description':
            if (value == 'random') {
                this.description = faker.lorem.words(3);
            }

            logger.log('info', `New ${editColumn}: ${this.description}`);
            this.attach(`New ${editColumn}: ${this.description}`);
            break;
        case 'supplierName':
            if (value == 'random') {
                const excludedSupplierKey = this.responseBodyOfAItemObject.vendorKey

                // Filter out the excluded supplier have excludedSupplierKey from the list suppliers
                const filteredArray = this.getSupplierResponseBody.filter((supplier: any) => supplier.key !== excludedSupplierKey);
                const randomSupplier = filteredArray[Math.floor(Math.random() * this.getSupplierResponseBody.length)];

                this.vendorKey = randomSupplier.key;
                this.vendorName = randomSupplier.name;
            }

            logger.log('info', `New ${editColumn}: ${this.vendorName}`);
            this.attach(`New ${editColumn}: ${this.vendorName}`);
            break;
        case 'supplierPrice':
            if (value == 'random') {
                this.vendorPrice = Number(faker.random.numeric());
            }

            logger.log('info', `New ${editColumn}: ${this.vendorPrice}`);
            this.attach(`New ${editColumn}: ${this.vendorPrice}`);
            break;
        case 'moq':
            if (value == 'random') {
                this.moq = Number(faker.random.numeric());
            }

            logger.log('info', `New ${editColumn}: ${this.moq}`);
            this.attach(`New ${editColumn}: ${this.moq}`);
            break;
        case 'leadTime':
            if (value == 'random') {
                this.leadTime = Number(faker.datatype.number({
                    'min': 1,
                    'max': 365
                }));
            }

            logger.log('info', `New ${editColumn}: ${this.leadTime}`);
            this.attach(`New ${editColumn}: ${this.leadTime}`);
            break;
        case 'orderInterval':
            if (value == 'random') {
                this.orderInterval = Number(faker.random.numeric());
            }

            logger.log('info', `New ${editColumn}: ${this.orderInterval}`);
            this.attach(`New ${editColumn}: ${this.orderInterval}`);
            break;
        case 'serviceLevel':
            if (value == 'random') {
                this.serviceLevel = Number(faker.random.numeric(2));
            }

            logger.log('info', `New ${editColumn}: ${this.serviceLevel}`);
            this.attach(`New ${editColumn}: ${this.serviceLevel}`);
            break;
        case 'onHanFBAQty':
            if (value == 'random') {
                this.onHand = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.onHand}`);
            this.attach(`New ${editColumn}: ${this.onHand}`);
            break;
        case 'onHanQty':
            if (value == 'random') {
                this.onHand = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.onHand}`);
            this.attach(`New ${editColumn}: ${this.onHand}`);
            break;
        case 'onHandQtyMin':
            if (value == 'random') {
                this.onHandMin = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.onHandMin}`);
            this.attach(`New ${editColumn}: ${this.onHandMin}`);
            break;
        case 'warehouseQty':
            if (value == 'random') {
                this.onHandThirdParty = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.onHandThirdParty}`);
            this.attach(`New ${editColumn}: ${this.onHandThirdParty}`);
            break;
        case 'warehouseQtyMin':
            if (value == 'random') {
                this.onHandThirdPartyMin = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.onHandThirdPartyMin}`);
            this.attach(`New ${editColumn}: ${this.onHandThirdPartyMin}`);
            break;
        case 'onHandFBMQty':
            if (value == 'random') {
                this.onHandFbm = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.onHandFbm}`);
            this.attach(`New ${editColumn}: ${this.onHandFbm}`);
            break;
        case 'skuNotes':
            if (value == 'random') {
                this.skuNotes = `SkuNotes ${faker.lorem.word(2)}`;
            }

            logger.log('info', `New ${editColumn}: ${this.skuNotes}`);
            this.attach(`New ${editColumn}: ${this.skuNotes}`);
            break;
        case 'prepNotes':
            if (value == 'random') {
                this.prepNotes = `PrepNotes ${faker.lorem.word(2)}`;
            }

            logger.log('info', `New ${editColumn}: ${this.prepNotes}`);
            this.attach(`New ${editColumn}: ${this.prepNotes}`);
            break;
        case 'supplierRebate':
            if (value == 'random') {
                this.supplierRebate = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.supplierRebate}`);
            this.attach(`New ${editColumn}: ${this.supplierRebate}`);
            break;
        case 'inboundShippingCost':
            if (value == 'random') {
                this.inboundShippingCost = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.supplierRebate}`);
            this.attach(`New ${editColumn}: ${this.supplierRebate}`);
            break;
        case 'reshippingCost':
            if (value == 'random') {
                this.reshippingCost = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.reshippingCost}`);
            this.attach(`New ${editColumn}: ${this.reshippingCost}`);
            break;
        case 'repackagingMaterialCost':
            if (value == 'random') {
                this.repackagingMaterialCost = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.repackagingMaterialCost}`);
            this.attach(`New ${editColumn}: ${this.repackagingMaterialCost}`);
            break;
        case 'repackingLaborCost':
            if (value == 'random') {
                this.repackingLaborCost = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.repackingLaborCost}`);
            this.attach(`New ${editColumn}: ${this.repackingLaborCost}`);
            break;
        case 'isHidden':
            if (value == 'random') {
                this.isHidden = !Boolean(this.responseBodyOfAItemObject.isHidden);
            }

            logger.log('info', `New ${editColumn}: ${this.isHidden}`);
            this.attach(`New ${editColumn}: ${this.isHidden}`);
            break;
        case 'useHistoryOverride':
            if (value == 'random') {
                this.useHistoryOverride = !(Boolean(this.responseBodyOfAItemObject.useHistoryOverride));
            }

            logger.log('info', `New ${editColumn}: ${this.useHistoryOverride}`);
            this.attach(`New ${editColumn}: ${this.useHistoryOverride}`);
            break;
        case 'casePackQty':
            if (value == 'random') {
                this.lotMultipleQty = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.lotMultipleQty}`);
            this.attach(`New ${editColumn}: ${this.lotMultipleQty}`);
            break;
        case 'inventorySourcePreference':
            if (value == 'random') {
                const inventorySources = ['FBA', 'FBM', 'FBA+FBM'];
                const excludedInvetorySource = this.responseBodyOfAItemObject.inventorySourcePreference;

                // Filter out the excluded inventory sourec value from the inventorySources array
                const filteredArray = inventorySources.filter((value) => value !== excludedInvetorySource);
                this.inventorySourcePreference = filteredArray[Math.floor(Math.random() * filteredArray.length)];
            }

            logger.log('info', `New ${editColumn}: ${this.inventorySourcePreference}`);
            this.attach(`New ${editColumn}: ${this.inventorySourcePreference}`);
            break;
        case 'purchaseAs':
            if (value == 'random') {
                const excludedItemKey = this.itemKey

                // Filter out the excluded item have excludedItemKey and purchase as is null from the list items
                const filteredArray = this.getItemsResponseBody.filter((item: any) => ((item.key !== excludedItemKey) && (item.lotMultipleItemKey === null)));
                const randomItem = filteredArray[Math.floor(Math.random() * filteredArray.length)];

                this.lotMultipleItemName = randomItem.name
                this.lotMultipleItemKey = randomItem.key
            }

            logger.log('info', `New ${editColumn}: ${this.lotMultipleItemName}`);
            this.attach(`New ${editColumn}: ${this.lotMultipleItemName}`);
            break;
        default:
            break;
    }

    // Prepare payload for request to edit item
    if (companyType === 'ASC') {
        this.payLoad = {
            companyType: `${this.responseBodyOfAItemObject.companyType}`,
            companyKey: `${this.responseBodyOfAItemObject.companyKey}`,
            key: `${this.responseBodyOfAItemObject.key}`,
            name: this.name === undefined ? this.responseBodyOfAItemObject.name : `${this.name}`,
            asin: this.asin === undefined ? this.responseBodyOfAItemObject.asin : `${this.asin}`,
            fnsku: this.fnsku === undefined ? this.responseBodyOfAItemObject.fnsku : `${this.fnsku}`,
            description: this.description === undefined ? this.responseBodyOfAItemObject.description : `${this.description}`,
            packageWeight: this.responseBodyOfAItemObject.packageWeight,
            vendorKey: this.vendorKey === undefined ? this.responseBodyOfAItemObject.vendorKey : `${this.vendorKey}`,
            vendorName: this.vendorName === undefined ? this.responseBodyOfAItemObject.vendorName : `${this.vendorName}`,
            vendorPrice: this.vendorPrice === undefined ? this.responseBodyOfAItemObject.vendorPrice : this.vendorPrice,
            moq: this.moq === undefined ? this.responseBodyOfAItemObject.moq : this.moq,
            leadTime: this.leadTime === undefined ? this.responseBodyOfAItemObject.leadTime : this.leadTime,
            orderInterval: this.orderInterval === undefined ? this.responseBodyOfAItemObject.orderInterval : this.orderInterval,
            serviceLevel: this.serviceLevel === undefined ? this.responseBodyOfAItemObject.serviceLevel : this.serviceLevel,
            onHand: this.onHand === undefined ? this.responseBodyOfAItemObject.onHand : this.onHand,
            onHandMin: this.onHandMin === undefined ? this.responseBodyOfAItemObject.onHandMin : this.onHandMin,
            onHandThirdParty: this.onHandThirdParty === undefined ? this.responseBodyOfAItemObject.onHandThirdParty : this.onHandThirdParty,
            onHandThirdPartyMin: this.onHandThirdPartyMin === undefined ? this.responseBodyOfAItemObject.onHandThirdPartyMin : this.onHandThirdPartyMin,
            onHandFbm: this.onHandFbm === undefined ? this.responseBodyOfAItemObject.onHandFbm : this.onHandFbm,
            skuNotes: this.skuNotes === undefined ? this.responseBodyOfAItemObject.skuNotes : `${this.skuNotes}`,
            prepGuide: this.responseBodyOfAItemObject.prepGuide,
            prepNotes: this.prepNotes === undefined ? this.responseBodyOfAItemObject.prepNotes : `${this.prepNotes}`,
            supplierRebate: this.supplierRebate === undefined ? this.responseBodyOfAItemObject.supplierRebate : this.supplierRebate,
            inboundShippingCost: this.inboundShippingCost === undefined ? this.responseBodyOfAItemObject.inboundShippingCost : this.inboundShippingCost,
            reshippingCost: this.reshippingCost === undefined ? this.responseBodyOfAItemObject.reshippingCost : this.reshippingCost,
            repackagingMaterialCost: this.repackagingMaterialCost === undefined ? this.responseBodyOfAItemObject.repackagingMaterialCost : this.repackagingMaterialCost,
            repackingLaborCost: this.repackingLaborCost === undefined ? this.responseBodyOfAItemObject.repackingLaborCost : this.repackingLaborCost,
            dimensionalWeight: this.responseBodyOfAItemObject.dimensionalWeight,
            hazmat: this.responseBodyOfAItemObject.hazmat,
            oversized: this.responseBodyOfAItemObject.oversized,
            category: this.responseBodyOfAItemObject.category,
            upc: `${this.responseBodyOfAItemObject.upc}`,
            ean: `${this.responseBodyOfAItemObject.ean}`,
            rank: this.responseBodyOfAItemObject.rank,
            growthTrend: this.responseBodyOfAItemObject.growthTrend,
            isHidden: this.isHidden === undefined ? this.responseBodyOfAItemObject.isHidden : this.isHidden,
            useHistoryOverride: this.useHistoryOverride === undefined ? this.responseBodyOfAItemObject.useHistoryOverride : this.useHistoryOverride,
            useLostSalesOverride: this.responseBodyOfAItemObject.useLostSalesOverride,
            lotMultipleQty: this.lotMultipleQty === undefined ? this.responseBodyOfAItemObject.lotMultipleQty : this.lotMultipleQty,
            lotMultipleItemKey: this.lotMultipleItemKey === undefined ? this.responseBodyOfAItemObject.lotMultipleItemKey : `${this.lotMultipleItemKey}`,
            lotMultipleItemName: this.lotMultipleItemName === undefined ? this.responseBodyOfAItemObject.lotMultipleItemName : `${this.lotMultipleItemName}`,
            forecastDirty: this.responseBodyOfAItemObject.forecastDirty,
            forecastTags: this.responseBodyOfAItemObject.forecastTags,
            tag: this.responseBodyOfAItemObject.tag,
            tags: this.responseBodyOfAItemObject.tags,
            useBackfill: this.responseBodyOfAItemObject.useBackfill,
            createdAt: `${this.responseBodyOfAItemObject.createdAt}`,
            inbound: this.responseBodyOfAItemObject.inbound,
            inboundPrice: this.responseBodyOfAItemObject.inboundPrice,
            inboundSalesLast30Days: this.responseBodyOfAItemObject.inboundSalesLast30Days,
            inboundAvailable: this.responseBodyOfAItemObject.inboundAvailable,
            inboundFcTransfer: this.responseBodyOfAItemObject.inboundFcTransfer,
            inboundFcProcessing: this.responseBodyOfAItemObject.inboundFcProcessing,
            inboundCustomerOrder: this.responseBodyOfAItemObject.inboundCustomerOrder,
            inboundUnfulfillable: this.responseBodyOfAItemObject.inboundUnfulfillable,
            inboundAlert: this.responseBodyOfAItemObject.inboundAlert,
            inboundWorking: this.responseBodyOfAItemObject.inboundWorking,
            mwsFulfillmentFee: this.responseBodyOfAItemObject.mwsFulfillmentFee,
            inventorySourcePreference: this.inventorySourcePreference === undefined ? this.responseBodyOfAItemObject.inventorySourcePreference : `${this.inventorySourcePreference}`,
            reserved: this.responseBodyOfAItemObject.reserved,
            imageUrl: this.responseBodyOfAItemObject.imageUrl,
            fba: this.responseBodyOfAItemObject.fba,
            lowestFba: this.responseBodyOfAItemObject.lowestFba,
            nonFba: this.responseBodyOfAItemObject.nonFba,
            lowestNonFba: this.responseBodyOfAItemObject.lowestNonFba,
            soldBy: this.responseBodyOfAItemObject.soldBy,
            fbaFee: this.responseBodyOfAItemObject.fbaFee,
            variableClosingFee: this.responseBodyOfAItemObject.variableClosingFee,
            newBuyBox: this.responseBodyOfAItemObject.newBuyBox,
            inboundShipped: this.responseBodyOfAItemObject.inboundShipped,
            inboundReceiving: this.responseBodyOfAItemObject.inboundReceiving,
            referralFee: this.responseBodyOfAItemObject.referralFee,
            listPrice: this.responseBodyOfAItemObject.listPrice,
            average7DayPrice: this.responseBodyOfAItemObject.average7DayPrice,
            condition: this.responseBodyOfAItemObject.condition,
            syncedFields: this.responseBodyOfAItemObject.syncedFields,
            isFbm: this.responseBodyOfAItemObject.isFbm,
            itemHistoryLength: this.responseBodyOfAItemObject.itemHistoryLength,
            warehouseQtyUpdatedDate: `${this.responseBodyOfAItemObject.warehouseQtyUpdatedDate}`,
            itemHistoryLengthInDay: this.responseBodyOfAItemObject.itemHistoryLengthInDay,
            created_at: `${this.responseBodyOfAItemObject.created_at}`,
            updated_at: `${this.responseBodyOfAItemObject.updated_at}`,
            s2d: this.responseBodyOfAItemObject.s2d,
            s7d: this.responseBodyOfAItemObject.s7d,
            s14d: this.responseBodyOfAItemObject.s14d,
            s30d: this.responseBodyOfAItemObject.s30d,
            s60d: this.responseBodyOfAItemObject.s60d,
            s90d: this.responseBodyOfAItemObject.s90d,
            s180d: this.responseBodyOfAItemObject.s180d,
            s365d: this.responseBodyOfAItemObject.s365d,
            outOfStock2d: this.responseBodyOfAItemObject.outOfStock2d,
            outOfStock7d: this.responseBodyOfAItemObject.outOfStock7d,
            outOfStock14d: this.responseBodyOfAItemObject.outOfStock14d,
            outOfStock30d: this.responseBodyOfAItemObject.outOfStock30d,
            outOfStock60d: this.responseBodyOfAItemObject.outOfStock60d,
            outOfStock90d: this.responseBodyOfAItemObject.outOfStock90d,
            outOfStock180d: this.responseBodyOfAItemObject.outOfStock180d,
            history: this.responseBodyOfAItemObject.history === undefined ? null : this.responseBodyOfAItemObject.history,
            links: this.responseBodyOfAItemObject.links === undefined ? null : this.responseBodyOfAItemObject.links
        }
    } else if (companyType === 'CSV' || companyType === 'QBFS') {
        this.payLoad = {
            companyType: `${this.responseBodyOfAItemObject.companyType}`,
            companyKey: `${this.responseBodyOfAItemObject.companyKey}`,
            key: `${this.responseBodyOfAItemObject.key}`,
            name: this.name === undefined ? this.responseBodyOfAItemObject.name : `${this.name}`,
            asin: this.asin === undefined ? this.responseBodyOfAItemObject.asin : `${this.asin}`,
            fnsku: this.fnsku === undefined ? this.responseBodyOfAItemObject.fnsku : `${this.fnsku}`,
            description: this.description === undefined ? this.responseBodyOfAItemObject.description : `${this.description}`,
            packageWeight: this.responseBodyOfAItemObject.packageWeight,
            vendorKey: this.vendorKey === undefined ? this.responseBodyOfAItemObject.vendorKey : `${this.vendorKey}`,
            vendorName: this.vendorName === undefined ? this.responseBodyOfAItemObject.vendorName : `${this.vendorName}`,
            vendorPrice: this.vendorPrice === undefined ? this.responseBodyOfAItemObject.vendorPrice : this.vendorPrice,
            moq: this.moq === undefined ? this.responseBodyOfAItemObject.moq : this.moq,
            leadTime: this.leadTime === undefined ? this.responseBodyOfAItemObject.leadTime : this.leadTime,
            orderInterval: this.orderInterval === undefined ? this.responseBodyOfAItemObject.orderInterval : this.orderInterval,
            serviceLevel: this.serviceLevel === undefined ? this.responseBodyOfAItemObject.serviceLevel : this.serviceLevel,
            onHand: this.onHand === undefined ? this.responseBodyOfAItemObject.onHand : this.onHand,
            onHandMin: this.onHandMin === undefined ? this.responseBodyOfAItemObject.onHandMin : this.onHandMin,
            onHandThirdParty: this.onHandThirdParty === undefined ? this.responseBodyOfAItemObject.onHandThirdParty : this.onHandThirdParty,
            onHandThirdPartyMin: this.onHandThirdPartyMin === undefined ? this.responseBodyOfAItemObject.onHandThirdPartyMin : this.onHandThirdPartyMin,
            onHandFbm: this.onHandFbm === undefined ? this.responseBodyOfAItemObject.onHandFbm : this.onHandFbm,
            skuNotes: this.skuNotes === undefined ? this.responseBodyOfAItemObject.skuNotes : `${this.skuNotes}`,
            prepGuide: this.responseBodyOfAItemObject.prepGuide,
            prepNotes: this.prepNotes === undefined ? this.responseBodyOfAItemObject.prepNotes : `${this.prepNotes}`,
            supplierRebate: this.supplierRebate === undefined ? this.responseBodyOfAItemObject.supplierRebate : this.supplierRebate,
            inboundShippingCost: this.inboundShippingCost === undefined ? this.responseBodyOfAItemObject.inboundShippingCost : this.inboundShippingCost,
            reshippingCost: this.reshippingCost === undefined ? this.responseBodyOfAItemObject.reshippingCost : this.reshippingCost,
            repackagingMaterialCost: this.repackagingMaterialCost === undefined ? this.responseBodyOfAItemObject.repackagingMaterialCost : this.repackagingMaterialCost,
            repackingLaborCost: this.repackingLaborCost === undefined ? this.responseBodyOfAItemObject.repackingLaborCost : this.repackingLaborCost,
            dimensionalWeight: this.responseBodyOfAItemObject.dimensionalWeight,
            hazmat: this.responseBodyOfAItemObject.hazmat,
            oversized: this.responseBodyOfAItemObject.oversized,
            category: this.responseBodyOfAItemObject.category,
            upc: `${this.responseBodyOfAItemObject.upc}`,
            ean: `${this.responseBodyOfAItemObject.ean}`,
            rank: this.responseBodyOfAItemObject.rank,
            growthTrend: this.responseBodyOfAItemObject.growthTrend,
            isHidden: this.isHidden === undefined ? this.responseBodyOfAItemObject.isHidden : this.isHidden,
            useHistoryOverride: this.useHistoryOverride === undefined ? this.responseBodyOfAItemObject.useHistoryOverride : this.useHistoryOverride,
            useLostSalesOverride: this.responseBodyOfAItemObject.useLostSalesOverride,
            lotMultipleQty: this.lotMultipleQty === undefined ? this.responseBodyOfAItemObject.lotMultipleQty : this.lotMultipleQty,
            lotMultipleItemKey: this.lotMultipleItemKey === undefined ? this.responseBodyOfAItemObject.lotMultipleItemKey : `${this.lotMultipleItemKey}`,
            lotMultipleItemName: this.lotMultipleItemName === undefined ? this.responseBodyOfAItemObject.lotMultipleItemName : `${this.lotMultipleItemName}`,
            forecastDirty: this.responseBodyOfAItemObject.forecastDirty,
            forecastTags: this.responseBodyOfAItemObject.forecastTags,
            tag: this.responseBodyOfAItemObject.tag,
            tags: this.responseBodyOfAItemObject.tags,
            useBackfill: this.responseBodyOfAItemObject.useBackfill,
            createdAt: `${this.responseBodyOfAItemObject.createdAt}`,
            inbound: this.responseBodyOfAItemObject.inbound,
            inboundPrice: this.responseBodyOfAItemObject.inboundPrice,
            inboundSalesLast30Days: this.responseBodyOfAItemObject.inboundSalesLast30Days,
            inboundAvailable: this.responseBodyOfAItemObject.inboundAvailable,
            inboundFcTransfer: this.responseBodyOfAItemObject.inboundFcTransfer,
            inboundFcProcessing: this.responseBodyOfAItemObject.inboundFcProcessing,
            inboundCustomerOrder: this.responseBodyOfAItemObject.inboundCustomerOrder,
            inboundUnfulfillable: this.responseBodyOfAItemObject.inboundUnfulfillable,
            inboundAlert: this.responseBodyOfAItemObject.inboundAlert,
            inboundWorking: this.responseBodyOfAItemObject.inboundWorking,
            mwsFulfillmentFee: this.responseBodyOfAItemObject.mwsFulfillmentFee,
            inventorySourcePreference: this.inventorySourcePreference === undefined ? this.responseBodyOfAItemObject.inventorySourcePreference : `${this.inventorySourcePreference}`,
            reserved: this.responseBodyOfAItemObject.reserved,
            imageUrl: this.responseBodyOfAItemObject.imageUrl,
            fba: this.responseBodyOfAItemObject.fba,
            lowestFba: this.responseBodyOfAItemObject.lowestFba,
            nonFba: this.responseBodyOfAItemObject.nonFba,
            lowestNonFba: this.responseBodyOfAItemObject.lowestNonFba,
            soldBy: this.responseBodyOfAItemObject.soldBy,
            fbaFee: this.responseBodyOfAItemObject.fbaFee,
            variableClosingFee: this.responseBodyOfAItemObject.variableClosingFee,
            newBuyBox: this.responseBodyOfAItemObject.newBuyBox,
            inboundShipped: this.responseBodyOfAItemObject.inboundShipped,
            inboundReceiving: this.responseBodyOfAItemObject.inboundReceiving,
            referralFee: this.responseBodyOfAItemObject.referralFee,
            listPrice: this.responseBodyOfAItemObject.listPrice,
            average7DayPrice: this.responseBodyOfAItemObject.average7DayPrice,
            condition: this.responseBodyOfAItemObject.condition,
            syncedFields: this.responseBodyOfAItemObject.syncedFields,
            isFbm: this.responseBodyOfAItemObject.isFbm,
            itemHistoryLength: this.responseBodyOfAItemObject.itemHistoryLength,
            warehouseQtyUpdatedDate: `${this.responseBodyOfAItemObject.warehouseQtyUpdatedDate}`,
            itemHistoryLengthInDay: this.responseBodyOfAItemObject.itemHistoryLengthInDay,
            created_at: `${this.responseBodyOfAItemObject.created_at}`,
            updated_at: `${this.responseBodyOfAItemObject.updated_at}`,
            s2d: this.responseBodyOfAItemObject.s2d,
            s7d: this.responseBodyOfAItemObject.s7d,
            s14d: this.responseBodyOfAItemObject.s14d,
            s30d: this.responseBodyOfAItemObject.s30d,
            s60d: this.responseBodyOfAItemObject.s60d,
            s90d: this.responseBodyOfAItemObject.s90d,
            s180d: this.responseBodyOfAItemObject.s180d,
            s365d: this.responseBodyOfAItemObject.s365d,
            outOfStock2d: this.responseBodyOfAItemObject.outOfStock2d,
            outOfStock7d: this.responseBodyOfAItemObject.outOfStock7d,
            outOfStock14d: this.responseBodyOfAItemObject.outOfStock14d,
            outOfStock30d: this.responseBodyOfAItemObject.outOfStock30d,
            outOfStock60d: this.responseBodyOfAItemObject.outOfStock60d,
            outOfStock90d: this.responseBodyOfAItemObject.outOfStock90d,
            outOfStock180d: this.responseBodyOfAItemObject.outOfStock180d,
            history: this.responseBodyOfAItemObject.history === undefined ? null : this.responseBodyOfAItemObject.history,
        }
    }

    logger.log('info', `Payload` + JSON.stringify(this.payLoad, undefined, 4));
    this.attach(`Payload` + JSON.stringify(this.payLoad, undefined, 4))
});

When('User sends a PUT request to edit the item', async function () {
    // Send PUT request
    this.response = await itemRequest.editItem(this.request, link, this.payLoad, this.headers)
    if (this.response.status() == 200) {
        this.editItemResponseBody = JSON.parse(await this.response.text())
        logger.log('info', `Edit Item Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()} and editItemResponse body ${JSON.stringify(this.editItemResponseBody, undefined, 4)}`)
        this.attach(`Edit Item Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()} and editItemResponse body ${JSON.stringify(this.editItemResponseBody, undefined, 4)}`)
    } else {
        logger.log('info', `Edit Item Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()}`)
        this.attach(`Edit Item Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()}`)
    }

});

Then('The new {} of item must be updated successfully', function (editColumn: string) {
    switch (editColumn) {
        case 'itemName':
            expect(this.name).toEqual(this.editItemResponseBody.name)
            break;
        case 'asin':
            expect(this.asin).toEqual(this.editItemResponseBody.asin)
            break;
        case 'fnsku':
            expect(this.fnsku).toEqual(this.editItemResponseBody.fnsku)
            break;
        case 'description':
            expect(this.description).toEqual(this.editItemResponseBody.description)
            break;
        case 'supplierName':
            expect(this.vendorKey).toEqual(this.editItemResponseBody.vendorKey)
            expect(this.vendorName).toEqual(this.editItemResponseBody.vendorName)
            break;
        case 'supplierPrice':
            expect(this.vendorPrice).toEqual(this.editItemResponseBody.vendorPrice)
            break;
        case 'moq':
            expect(this.moq).toEqual(this.editItemResponseBody.moq)
            break;
        case 'leadTime':
            expect(this.leadTime).toEqual(this.editItemResponseBody.leadTime)
            break;
        case 'orderInterval':
            expect(this.orderInterval).toEqual(this.editItemResponseBody.orderInterval)
            break;
        case 'serviceLevel':
            expect(this.serviceLevel).toEqual(this.editItemResponseBody.serviceLevel)
            break;
        case 'onHanFBAQty':
            expect(this.onHand).toEqual(this.editItemResponseBody.onHand)
            break;
        case 'onHandQtyMin':
            expect(this.onHandMin).toEqual(this.editItemResponseBody.onHandMin)
            break;
        case 'warehouseQty':
            expect(this.onHandThirdParty).toEqual(this.editItemResponseBody.onHandThirdParty)
            break;
        case 'warehouseQtyMin':
            expect(this.onHandThirdPartyMin).toEqual(this.editItemResponseBody.onHandThirdPartyMin)
            break;
        case 'onHandFBMQty':
            expect(this.onHandFbm).toEqual(this.editItemResponseBody.onHandFbm)
            break;
        case 'skuNotes':
            expect(this.skuNotes).toEqual(this.editItemResponseBody.skuNotes)
            break;
        case 'prepNotes':
            expect(this.prepNotes).toEqual(this.editItemResponseBody.prepNotes)
            break;
        case 'supplierRebate':
            expect(this.supplierRebate).toEqual(this.editItemResponseBody.supplierRebate)
            break;
        case 'inboundShippingCost':
            expect(this.inboundShippingCost).toEqual(this.editItemResponseBody.inboundShippingCost)
            break;
        case 'reshippingCost':
            expect(this.reshippingCost).toEqual(this.editItemResponseBody.reshippingCost)
            break;
        case 'repackagingMaterialCost':
            expect(this.repackagingMaterialCost).toEqual(this.editItemResponseBody.repackagingMaterialCost)
            break;
        case 'repackingLaborCost':
            expect(this.repackingLaborCost).toEqual(this.editItemResponseBody.repackingLaborCost)
            break;
        case 'isHidden':
            expect(this.isHidden).toEqual(this.editItemResponseBody.isHidden)
            break;
        case 'useHistoryOverride':
            expect(this.useHistoryOverride).toEqual(this.editItemResponseBody.useHistoryOverride)
            break;
        case 'casePackQty':
            expect(this.lotMultipleQty).toEqual(this.editItemResponseBody.lotMultipleQty)
            break;
        case 'inventorySourcePreference':
            expect(this.inventorySourcePreference).toEqual(this.editItemResponseBody.inventorySourcePreference)
            break;
        case 'purchaseAs':
            expect(this.lotMultipleItemName).toEqual(this.editItemResponseBody.lotMultipleItemName)
            expect(this.lotMultipleItemKey).toEqual(this.editItemResponseBody.lotMultipleItemKey)
            break;
        default:
            break;
    }

});