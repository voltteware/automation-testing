import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as exportRequest from '../../../../src/api/request/export.service';
import * as itemRequest from '../../../../src/api/request/item.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";
import fs from 'fs';

let link: any;

Given(`{} sets POST api endpoint to export {} with {}`, async function (actor: string, section: string, columns: string) {
    this.fields = columns;
    console.log("FIELDS: ", this.fields);
    if(section === "my-suggested" || section === "custom") {
        link = encodeURI(`${Links.API_EXPORT}summary/download`);
    }
    else {
        link = encodeURI(`${Links.API_EXPORT}${section}/download`);
    }
});

When('{} sets payload as name: {}', async function (actor: string, removedItemKeys: string) {
    this.exportItemPayload = {
        "removedItemKeys": []
    }
})

Then('{} picks {} random SKU in above list SKUs', async function (actor: string, quantity) {
    console.log("Here >>>> ", this.getSKUsInShipmentDetailsResponseBody);
    this.itemsPickedRandomArray =  itemRequest.getMultipleRandom(this.getSKUsInShipmentDetailsResponseBody, quantity);
    console.log("IteminItemListPickedRandomArray: ", this.itemsPickedRandomArray);
    return this.itemsPickedRandomArray;
});

When(`{} sends POST api endpoint to export {}`, async function (actor:string, section: string) {
    if(section === "restock-suggestion") {
        this.getExportItem = this.response = await exportRequest.exportSKUInItemList(this.request, link, this.headers, this.exportItemPayload, this.fields, this.params, this.supplierNameFilter);
    }
    if(section === "shipment-detail") {
        this.getExportItem = this.response = await exportRequest.exportSKUsInShipmentDetails(this.request, link, this.headers, this.exportItemPayload, this.fields, this.pickRandomShipment.key, this.pickRandomShipment.restockType);
    }
    if(section === "my-suggested") {
        this.attach(`Vendor key after radom: ${this.randomVendorKey}`)
        this.getExportItem = this.response = await exportRequest.exportItemsInPOByVendor(this.request, link, this.headers, this.exportItemPayload, this.fields, this.randomVendorKey);
    }
    else {
        this.getExportItem = this.response = await exportRequest.exportItem(this.request, link, this.headers, this.exportItemPayload, this.fields, this.params );
    }
    const responseBodyText = await this.getExportItem.text();
    console.log("responseBodyText: ", await this.getExportItem.headers()['content-type']);

    // Save data as CSV file
    fs.writeFile(`export_data/export-${section}.csv`, responseBodyText, function(err) {
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
});

When(`{} sends POST api endpoint to download {} with filter {} column and sort {}`, async function (actor: string, section: string, columnName: string, sort: string) {
    this.getExportItem = this.response = await exportRequest.exportItemWithFilter(this.request, link, this.headers, this.exportItemPayload, this.fields, columnName, sort );
    const responseBodyText = await this.getExportItem.text();
    console.log("responseBodyText: ", await this.getExportItem.headers()['content-type']);

    // Save data as CSV file
    fs.writeFile(`export_data/export-${section}.csv`, responseBodyText, function(err) {
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

When('{} checks total items in export file EQUALS total {}', async function (actor: string, section: string) {
    var expectTotalCount;
    var totalItemFromExport = await exportRequest.totalItemFromExportFile(`export_data/export-${section}.csv`)
    console.log("export_data/export-${section}.csv: ", `export_data/export-${section}.csv`)
    if(section == "item") {
        expectTotalCount = this.countItem + this.getCountItemsThatIsHiddenResponseBody;
        this.attach(`expectTotalCount of Items >> ${expectTotalCount}`)
        expect(totalItemFromExport.length).toEqual(Number(expectTotalCount));
    }
    else {
        this.attach(`expectTotalCount != Items >> ${this.countItem}`);
        expect(totalItemFromExport.length).toEqual(Number(this.countItem));
    }

    logger.log('info',`totalItemFromExportFile ${totalItemFromExport.length}`, `countItem ${expectTotalCount}`)
})

When('{} checks values of {} that just picked the same as export file', async function (actor: string, section: string) {
    this.attach(`section: >>>>> ${section} and companyType: >>>>> ${this.companyType}`);
    let columnNameInExportFile;
    for(let i = 0; i < this.itemsPickedRandomArray.length; i++) {
        switch(section) {
            case "bom":
                columnNameInExportFile = this.itemsPickedRandomArray[i].parentName;
                return columnNameInExportFile;
            case "restock-suggestion":
                columnNameInExportFile = this.itemsPickedRandomArray[i].sku;
                return columnNameInExportFile;
            case "shipment":
                columnNameInExportFile = this.itemsPickedRandomArray[i].key;
                return columnNameInExportFile;
            case "shipment-detail":
                columnNameInExportFile = this.itemsPickedRandomArray[i].fnsku;
                return columnNameInExportFile;
            case "custom":
                columnNameInExportFile = this.itemsPickedRandomArray[i].fnsku;
                return columnNameInExportFile;
            default: 
                columnNameInExportFile = this.itemsPickedRandomArray[i].name || this.itemsPickedRandomArray[i].itemName;
        }
        this.attach(`* Name of item that have picked in the grid: >>>>> ` + JSON.stringify(columnNameInExportFile));

        this.filterRowFromExportFile = await exportRequest.filterRowThatHasPicked(`export_data/export-${section}.csv`, columnNameInExportFile, section);
        console.log("* Pick row from export file that has name the same as name in the grid: >>>>> ", this.filterRowFromExportFile);

        this.itemsPickedRandom =  this.itemsPickedRandomArray[i];
        this.attach(`* Row that has picked random from the grid: >>>>> ` + JSON.stringify(this.itemsPickedRandom))

        const fieldsArray = await exportRequest.addFieldsIntoArray(this.fields);
        this.attach(`* Add field from param of export API into array: >>>>> ${fieldsArray}`);

        for(let y = 0; y < fieldsArray.length; y++) {
            const columnIndex = fieldsArray[y];
            this.attach(`* Column Name from field array: >>>>> ${columnIndex}`);
            this.columnName = await exportRequest.mapColumn(columnIndex, section, this.companyType);
            console.log("* Step - Column Name after mapping: >>>>>", this.columnName);
            this.valueOfColumnNameInExportFile = this.filterRowFromExportFile[String(this.columnName)];
            console.log("* Value of column in export file: >>>>> ", this.valueOfColumnNameInExportFile);
            this.valueOfColumnNameInGrid = String(this.itemsPickedRandom[columnIndex]);
            if(this.valueOfColumnNameInGrid === "null" || this.valueOfColumnNameInExportFile === "null") {
                this.valueOfColumnNameInGrid = "";
                this.valueOfColumnNameInExportFile = "";
            }
            this.attach(`* ValueOfColumnNameInExportFile: >>>>> ${this.valueOfColumnNameInExportFile}, valueOfColumnNameInGrid: >>>>> ${this.valueOfColumnNameInGrid}, Column Index: >>>>> ${columnIndex}`)
            logger.log(`Result: >>>>> ${await this.columnName}`, `|| The value of column in export file: >>>>> ${this.valueOfColumnNameInExportFile}`, `|| Column Index >>>>> ${columnIndex}`, `|| The value in the grid: >>>>> ${this.valueOfColumnNameInGrid}`);
            expect(this.valueOfColumnNameInGrid).toEqual(this.valueOfColumnNameInExportFile);
        }
    }
})