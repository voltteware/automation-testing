import { Then, DataTable } from '@cucumber/cucumber';
import logger from '../../../../src/Logger/logger';
import reportType from '../../../../src/data/reportType.json'
import _ from "lodash";
import { getRegionByMarketplaceId } from '../../../../src/helpers/amazon-helper';
import * as exportRequest from '../../../../src/api/request/export.service';
import SellingPartnerAPI from 'amazon-sp-api';
import { expect } from '@playwright/test';

let totalItemFromExport: any;
let expected: any;
let expectedItem: any;

// Will research and change APIs to make it easily
Then(`{} sends a POST method to create report on Amazon`, async function (actor: string) {
    const clientConfig = {
        region: getRegionByMarketplaceId(this.marketplaceId),
        //All of info below are Fisher Finery company
        refresh_token: "Atzr|IwEBID_BwBV4w9Z5kP3DbCidA-GEa96fOk785pqNtJckf0JubWe-5hK2n_CfrtGUpg5z7sw-vWkuL_dwtVe0NoYugIb65ruGXc8Ohv07Uu4B6gud4l2Kloz08iVb238-iRzN9EF5QCPRlb6ySG5CotqDSPu3_6ZIFsC9gbx7LcpY_wjtIW181FWCCk6vwfQvxp1qo-TORNeZ5UKaXRSz0mIlU9qyb5re5l8xZXDvBMxHFsFmgwGxMZ4s_PbXFakcJo7wroAIa2Z8OWxrZyyoFp9izhty4tLer2wUDN5bEZf6sTqv3r1RLIhH-5a8lUHeZ-QPvDs",
        credentials: {
            SELLING_PARTNER_APP_CLIENT_ID: 'amzn1.application-oa2-client.d2863395cbb3490db7b5c3d980db6951',
            SELLING_PARTNER_APP_CLIENT_SECRET: '71d6e0c4ad5894aeae2d51908a3bbcdc23a5149613dabb99a2d870470c73f0f1',
            AWS_ACCESS_KEY_ID: 'AKIAQ6O4VP2SSKVRWQ5P',
            AWS_SECRET_ACCESS_KEY: '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',
            AWS_SELLING_PARTNER_ROLE: 'arn:aws:iam::065424162469:role/sellingpartnerapi_role'
        },
        endpoints_versions: {
            'reports': '2021-06-30'
        }
    };
    try {
        let sellingPartner = new SellingPartnerAPI(clientConfig);
        this.res = await sellingPartner.callAPI({
            operation: 'reports.createReport',
            body: {
                reportType: `${reportType.Demand}`,
                marketplaceIds: ["ATVPDKIKX0DER"],
                dataStartTime: `${this.lastMonthDateFormat}`,
                dataEndTime: `${this.currentDateFormat}`
            }
        });
        this.createDemandReportResponseBody = this.res;
        logger.log('info', "Response message: " + JSON.stringify(this.createDemandReportResponseBody, undefined, 4));
        this.attach("Response Create report Demand from Amazon" + JSON.stringify(this.createDemandReportResponseBody, undefined, 4));

        this.reportId = this.createDemandReportResponseBody.reportId;
    }
    catch (e) {
        logger.log('info', "Error message: " + e);
        this.attach("Error message: " + e);
    };
});

Then(`{} sends a GET method to get report document by reportDocumentID`, async function (actor: string) {
    const clientConfig = {
        region: getRegionByMarketplaceId(this.marketplaceId),
        //All of info below are Fisher Finery company
        refresh_token: "Atzr|IwEBID_BwBV4w9Z5kP3DbCidA-GEa96fOk785pqNtJckf0JubWe-5hK2n_CfrtGUpg5z7sw-vWkuL_dwtVe0NoYugIb65ruGXc8Ohv07Uu4B6gud4l2Kloz08iVb238-iRzN9EF5QCPRlb6ySG5CotqDSPu3_6ZIFsC9gbx7LcpY_wjtIW181FWCCk6vwfQvxp1qo-TORNeZ5UKaXRSz0mIlU9qyb5re5l8xZXDvBMxHFsFmgwGxMZ4s_PbXFakcJo7wroAIa2Z8OWxrZyyoFp9izhty4tLer2wUDN5bEZf6sTqv3r1RLIhH-5a8lUHeZ-QPvDs",
        credentials: {
            SELLING_PARTNER_APP_CLIENT_ID: 'amzn1.application-oa2-client.d2863395cbb3490db7b5c3d980db6951',
            SELLING_PARTNER_APP_CLIENT_SECRET: '71d6e0c4ad5894aeae2d51908a3bbcdc23a5149613dabb99a2d870470c73f0f1',
            AWS_ACCESS_KEY_ID: 'AKIAQ6O4VP2SSKVRWQ5P',
            AWS_SECRET_ACCESS_KEY: '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',
            AWS_SELLING_PARTNER_ROLE: 'arn:aws:iam::065424162469:role/sellingpartnerapi_role'
        },
        endpoints_versions: {
            'reports': '2021-06-30'
        }
    };
    try {
        let sellingPartner = new SellingPartnerAPI(clientConfig);
        this.res = await sellingPartner.callAPI({
            operation: 'reports.getReportDocument',
            path: {
                reportDocumentId: `${this.reportDocumentId}`
            }
        });
        this.getReportDocumentIdResponseBody = this.res;
        logger.log('info', "Response Get report Demand by Report Document Id from Amazon " + JSON.stringify(this.getReportDocumentIdResponseBody));
        this.attach("Response Get report Demand by Report Document Id from Amazon" + JSON.stringify(this.getReportDocumentIdResponseBody, undefined, 4));

        this.url = this.getReportDocumentIdResponseBody.url;
    }
    catch (e) {
        logger.log('info', "Error message: " + e);
        this.attach("Error message: " + e);
    };
});

// I set new timeout here, because when Amazon generates report, will take times to complete
Then(`{} sends a GET method to get report by reportID`, { timeout: 5500000 }, async function (actor: string) {
    const clientConfig = {
        region: getRegionByMarketplaceId(this.marketplaceId),
        //All of info below are Fisher Finery company
        refresh_token: "Atzr|IwEBID_BwBV4w9Z5kP3DbCidA-GEa96fOk785pqNtJckf0JubWe-5hK2n_CfrtGUpg5z7sw-vWkuL_dwtVe0NoYugIb65ruGXc8Ohv07Uu4B6gud4l2Kloz08iVb238-iRzN9EF5QCPRlb6ySG5CotqDSPu3_6ZIFsC9gbx7LcpY_wjtIW181FWCCk6vwfQvxp1qo-TORNeZ5UKaXRSz0mIlU9qyb5re5l8xZXDvBMxHFsFmgwGxMZ4s_PbXFakcJo7wroAIa2Z8OWxrZyyoFp9izhty4tLer2wUDN5bEZf6sTqv3r1RLIhH-5a8lUHeZ-QPvDs",
        credentials: {
            SELLING_PARTNER_APP_CLIENT_ID: 'amzn1.application-oa2-client.d2863395cbb3490db7b5c3d980db6951',
            SELLING_PARTNER_APP_CLIENT_SECRET: 'amzn1.oa2-cs.v1.d1f3214f89a53272943c3bfdd2a960eedddc92f1070844478714021b02e87f5a',
            AWS_ACCESS_KEY_ID: 'AKIAQ6O4VP2SSKVRWQ5P',
            AWS_SECRET_ACCESS_KEY: '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',
            AWS_SELLING_PARTNER_ROLE: 'arn:aws:iam::065424162469:role/sellingpartnerapi_role'
        },
        endpoints_versions: {
            'reports': '2021-06-30'
        }
    };
    try {
        let sellingPartner = new SellingPartnerAPI(clientConfig);
        // Set loop here, because I am not sure when Amazon completes report!
        while (true) {
            logger.log('info', 'Get report Demand by Report Id from Amazon')
            await new Promise((resolve) => setTimeout(() => resolve(null), 10000));
            this.res = await sellingPartner.callAPI({
                operation: 'reports.getReport',
                path: {
                    reportId: `${this.reportId}`
                }
            });
            this.getReportIdResponseBody = this.res;
            logger.log('info', "Response Get report Demand by Report Id from Amazon " + JSON.stringify(this.getReportIdResponseBody));
            this.attach("Response Get report Demand by Report Id from Amazon" + JSON.stringify(this.getReportIdResponseBody, undefined, 4));

            if (['DONE', 'CANCELLED', 'FATAL'].includes(this.getReportIdResponseBody?.processingStatus)) {
                break;
            }
        }

        this.reportDocumentId = this.getReportIdResponseBody.reportDocumentId;
    }
    catch (e) {
        logger.log('info', "Error message: " + e);
        this.attach("Error message: " + e);
    };
});

Then('{} checks total items in report file EQUALS total with section and item name', async function (actor: string, dataTable: DataTable) {
    var itemName: number = dataTable.hashes()[0].itemName;
    var section: string = dataTable.hashes()[0].section;
    var fileName: string = dataTable.hashes()[0].file;

    if (section == 'demand') {
        totalItemFromExport = await exportRequest.totalItemFromExportFile(`src/data/${fileName}.csv`);
        this.totalItemFromExportFiltered = totalItemFromExport.filter((filter: any) => filter.sku === `${itemName}` && !(filter[`item-status`] === 'Cancelled'));
    }
    else {
        this.totalItemFromExportFiltered = totalItemFromExport = await exportRequest.totalItemFromExportFile(`src/data/${fileName}.csv`);
    }
    logger.log('info', "this.totalItemFromExportFiltered: " + JSON.stringify(this.totalItemFromExportFiltered));
    this.attach("this.totalItemFromExportFiltered: " + JSON.stringify(this.totalItemFromExportFiltered));

    logger.log('info', `totalItemFromExportFiltered ${this.totalItemFromExportFiltered.length}`, `countItem ${this.countItem}`);
    this.attach(`totalItemFromExportFiltered ${this.totalItemFromExportFiltered.length}`, `countItem ${this.countItem}`);
    expect(this.totalItemFromExportFiltered.length).toEqual(Number(this.countItem));
});

Then('{} checks value on grid match with value in report file: {}', async function (actor, section: string) {
    if (section == 'demand') {
        expectedItem = this.totalItemFromExportFiltered.filter((ex: any) => ex[`amazon-order-id`] === `${this.orderKeyOfGrid}`);
        expected = expectedItem.length;
        expect(expected).toEqual(1);
    }
    else {
        expectedItem = this.totalItemFromExportFiltered.filter((ex: any) => ex[`Shipment name`] === `${this.shipmentName}`);
        logger.log('info', "expectedItemStatus: " + expectedItem[0].Status);
        this.attach("expectedItemStatus: " + expectedItem[0].Status);
        expect(this.status).toBe((expectedItem[0].Status).toUpperCase());
    }
    logger.log('info', "expectedItem: " + JSON.stringify(expectedItem));
    this.attach("expectedItem: " + JSON.stringify(expectedItem));
});