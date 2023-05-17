import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as exportRequest from '../../../../src/api/request/export.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";
import fs from 'fs';

let link: any;

Given(`{} sets POST api endpoint to export {} with {}`, async function (actor: string, section: string, columns: string) {
    this.fields = columns;
    console.log("FIELDS: ", this.fields);
    link = encodeURI(`${Links.API_EXPORT}${section}/download`);
});

When('{} sets payload as name: {}', async function (actor: string, removedItemKeys: string) {
    this.exportItemPayload = {
        "removedItemKeys": []
    }
})

When(`{} sends POST api endpoint to export {}`, async function (actor:string, section: string) {
    this.getExportItem = this.response = await exportRequest.exportItem(this.request, link, this.headers, this.exportItemPayload, this.fields, this.params );
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
        logger.log(`info`, `expectTotalCount of Items >> ${expectTotalCount}`)
    }
    else {
        expectTotalCount = this.countItem;
        logger.log(`info`, `expectTotalCount != Items >> ${expectTotalCount}`)
    }

    logger.log('info',`totalItemFromExportFile ${totalItemFromExport.length}`, `countItem ${expectTotalCount}`)
    expect(totalItemFromExport.length).toEqual(Number(expectTotalCount));
})

When('{} checks values of {} that just picked the same as export file', async function (actor: string, section: string) {
    for(let i = 0; i < this.itemsPickedRandomArray.length; i++) {
        if(section === "bom") {
            this.filterItemFromExportFile = await exportRequest.filterItemThatHasPicked(`export_data/export-${section}.csv`, this.itemsPickedRandomArray[i].parentName);
            console.log("filterItemFromExportFileFirst: ", this.filterItemFromExportFile);
        }
        else {
            this.filterItemFromExportFile = await exportRequest.filterItemThatHasPicked(`export_data/export-${section}.csv`, this.itemsPickedRandomArray[i].name || this.itemsPickedRandomArray[i].itemName);
        }
        this.itemsPickedRandom =  this.itemsPickedRandomArray[i];
        console.log("this.filterItemFromExportFile: ", this.filterItemFromExportFile, "itemsPickedRandom: ", this.itemsPickedRandom);
        logger.log('info', `Random Item in Export Item ${this.itemsPickedRandomArray[i].name || this.itemsPickedRandomArray[i].itemName || this.itemsPickedRandomArray[i].parentName}`, `Filter Item From Export File ${this.filterItemFromExportFile}`);

        const fieldsArray = await exportRequest.addFieldsIntoArray(this.fields);
        console.log("addFieldsIntoArray: ", fieldsArray);
        for(let y = 0; y < fieldsArray.length; y++) {
            const columnIndex = fieldsArray[y];
            console.log("columnIndex: ", columnIndex);
            this.columnName = exportRequest.mapColumn(columnIndex, section, this.companyKey);
            this.valueOfColumnNameInExportFile = this.filterItemFromExportFile[String(await this.columnName)];
            this.valueOfColumnNameInGrid = String(this.itemsPickedRandom[columnIndex]);
            if(this.valueOfColumnNameInGrid === "null" || this.valueOfColumnNameInExportFile === "null") {
                this.valueOfColumnNameInGrid = "";
                this.valueOfColumnNameInExportFile = "";
            }
            this.attach(`valueOfColumnNameInExportFile: ${this.valueOfColumnNameInExportFile}, valueOfColumnNameInGrid: ${this.valueOfColumnNameInGrid}, Column Index: ${columnIndex}`)
            logger.log(`result: ${await this.columnName}`, `|| The value of column in export file: , ${this.valueOfColumnNameInExportFile}`, `|| Column Index >>> ${columnIndex}`, `|| The value in the grid: ${this.valueOfColumnNameInGrid}`);
            expect(this.valueOfColumnNameInGrid).toEqual(this.valueOfColumnNameInExportFile);
        }
    }
})

