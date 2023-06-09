import * as authenticateRequest from '../../../../src/api/request/authentication.service';
import { DataTable, Then } from '@cucumber/cucumber';
import * as s3Request from '../../../../src/api/request/s3.service';
import * as syncRequest from '../../../../src/api/request/sync.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";
import path from 'path';
import fs from 'fs';
import * as fileHelper from "../../../../src/helpers/file-helper";
import { expect } from '@playwright/test';

Then(`User prepares the {} file contains the list {} as following data:`, async function (fileName: string, section: string, dataTable: DataTable) {
    // Write data in table to csv file
    this.fileName = fileName;
    this.section = section
    const result = fileHelper.convertDataTableToCSVFile(dataTable, section, this.fileName);
    this.expectedData = result
    logger.log('info', `Content of file: ` + this.expectedData);
    this.attach(`Content of file: ` + this.expectedData);
})

Then(`User sets GET api to get signed request`, function () {
    this.linkGetSignedRequest = `${Links.API_FILE}/auth/${this.companyKey}?fileName=${this.fileName}&os=mac`
})

Then(`User sends a GET request to get signed request`, async function () {
    const options = {
        headers: this.headers
    }

    this.getSignedRequestResponse = this.response = await authenticateRequest.getSignedRequest(this.request, this.linkGetSignedRequest, options);
    const responseBodyText = await this.getSignedRequestResponse.text();
    if (this.getSignedRequestResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getSignedRequestResponseBody = JSON.parse(await this.getSignedRequestResponse.text());
        logger.log('info', `Response GET ${this.linkGetSignedRequest}: ` + JSON.stringify(this.getSignedRequestResponseBody, undefined, 4));
        this.attach(`Response GET ${this.linkGetSignedRequest}: ` + JSON.stringify(this.getSignedRequestResponseBody, undefined, 4));
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${this.linkGetSignedRequest} has status code ${this.getSignedRequestResponse.status()} ${this.getSignedRequestResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${this.linkGetSignedRequest} has status code ${this.getSignedRequestResponse.status()} ${this.getSignedRequestResponse.statusText()} and response body ${actualResponseText}`);
    }
})

Then(`User sets PUT api to upload file {} to the Amazon S3`, async function (fileName: string) {
    this.linkUpFileToS3 = this.getSignedRequestResponseBody.signedRequest
    const file = path.resolve("./src/data/", `${fileName}`)
    const csv_buffer = fs.readFileSync(file)
    this.payloadUpFileToS3 = csv_buffer
})

Then(`User sends a PUT request to upload file to the Amazon S3`, async function () {
    this.uploadFileToS3Response = this.response = await s3Request.uploadFileToS3(this.linkUpFileToS3, this.companyKey, this.companyType, this.payloadUpFileToS3);
    expect(this.uploadFileToS3Response.status()).toBe(200)
})

Then(`User sets POST api to sync file {} from Amazon S3 with option isCreateNew: {}`, async function (fileName: string, isCreateNew: string) {
    this.linkSyncFile = `${Links.API_SYNC}/${this.section}`;
    this.payloadSyncFile = {
        "fileName": `${fileName}`,
        "fileType": `${this.section}`,
        "append": false,
        "zero": false,
        "userId": "",
        "isCreateNew": Boolean(isCreateNew),
        "isInitialUpload": false
    }
})

Then(`User sends a POST request to sync file from Amazon S3`, async function () {
    this.runSyncResponse = this.response = await syncRequest.postSync(this.request, this.linkSyncFile, this.payloadSyncFile, this.headers);
    const responseBodyText = await this.runSyncResponse.text();
    if (this.runSyncResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        // this.runSyncResponseBody = JSON.parse(await this.runSyncResponse.text());
        logger.log('info', `Response POST ${this.linkSyncFile}` + JSON.stringify(this.runSyncResponse, undefined, 4));
        this.attach(`Response POST ${this.linkSyncFile} ` + JSON.stringify(this.runSyncResponse, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${this.linkSyncFile} has status code ${this.runSyncResponse.status()} ${this.runSyncResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${this.linkSyncFile} has status code ${this.runSyncResponse.status()} ${this.runSyncResponse.statusText()} and response body ${actualResponseText}`)
    }
    const sleep = (milliseconds: number) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    await sleep(6000);
})