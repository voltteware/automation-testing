import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as exportRequest from '../../../../src/api/request/export.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";
import fs from 'fs';

let link: any;

Given(`{} sets POST api endpoint to export {}`, async function (actor: string, section: string) {
    link = encodeURI(`${Links.API_EXPORT_ITEM}fields=name,vendorName,vendorPrice,moq,serviceLevel,onHand,onHandThirdParty`);
});

When('{} sets payload as name: {}', async function (actor: string, removedItemKeys: string) {
    this.exportItemPayload = {
        "removedItemKeys": []
    }
})

When(`{} sends POST api endpoint to export {}`, async function (actor:string, section: string) {
    this.getExportItem = this.response = await exportRequest.exportItem(this.request, link, this.headers, this.exportItemPayload, this.params);
    const responseBodyText = await this.getExportItem.text();
    console.log("responseBodyText: ", await this.getExportItem.headers()['content-type']);

    // Save data as CSV file
    fs.writeFile("export_data/export-item.csv", responseBodyText, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 


    if (this.getExportItem.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        logger.log('info', `Response POST ${link}` + responseBodyText);
        this.attach(`Response POST ${link}` + responseBodyText)
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${link} has status code ${this.getExportItem.status()} ${this.getExportItem.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${link} has status code ${this.getExportItem.status()} ${this.getExportItem.statusText()} and response body ${actualResponseText}`)
    }

    expect(await this.getExportItem.headers()['content-type']).toEqual("text/csv;; charset=utf-8");
})

When('{} checks total items in export file EQUALS total items', async function (actor: string) {
    var totalItemFromExport = await exportRequest.totalItemFromExportFile('export_data/export-item.csv')
    var expectTotalCount = this.countItem + this.getCountItemsThatIsHiddenResponseBody;
    logger.log('info',`totalItemFromExportFile ${totalItemFromExport.length}`, `countItem ${expectTotalCount}`)
    expect(totalItemFromExport.length).toEqual(Number(expectTotalCount));
})

When('{} checks values of {} that just picked the same as export file', async function (actor: string, itemNameThatJustPicked: string) {
    itemNameThatJustPicked = await this.responseBodyOfAItemObject.name;

    const filterItemFromExportFile = await exportRequest.filterItemThatHasPicked('export_data/export-item.csv', itemNameThatJustPicked);
    console.log("filterItemFromExportFile: ", filterItemFromExportFile);
    logger.log('info', `Random Item in Export Item ${itemNameThatJustPicked}`, `Filter Item From Export File ${filterItemFromExportFile}`);

    expect(this.responseBodyOfAItemObject.key).toEqual(filterItemFromExportFile["Item Key"] || filterItemFromExportFile["ASIN-SKU"]);
    expect(this.responseBodyOfAItemObject.name).toEqual(filterItemFromExportFile["Item Name"]);
    expect(this.responseBodyOfAItemObject.vendorKey || '').toEqual(filterItemFromExportFile["Supplier Key"]);
    expect(this.responseBodyOfAItemObject.vendorName || '').toEqual(filterItemFromExportFile["Supplier Name"]);
    expect(this.responseBodyOfAItemObject.vendorPrice).toEqual(Number(filterItemFromExportFile["Supplier Price"]));
    expect(this.responseBodyOfAItemObject.moq).toEqual(Number(filterItemFromExportFile.MOQ));
    expect(this.responseBodyOfAItemObject.serviceLevel).toEqual(Number(filterItemFromExportFile["Service Level"]));
    expect(this.responseBodyOfAItemObject.onHand).toEqual(Number(filterItemFromExportFile["On Hand Qty"] || filterItemFromExportFile["On Hand FBA Qty"]));
    expect(this.responseBodyOfAItemObject.onHandThirdParty).toEqual(Number(filterItemFromExportFile["Warehouse Qty"]));
})

