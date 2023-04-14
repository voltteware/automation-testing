import { Then, Given, DataTable } from '@cucumber/cucumber';
import { APIRequestContext, expect } from '@playwright/test';
import * as vendorRequest from '../../../../src/api/request/vendor.service';
import * as itemRequest from '../../../../src/api/request/item.service';
import * as purchasingRequest from '../../../../src/api/request/purchasing.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { faker } from '@faker-js/faker';
import _ from "lodash";

let linkGetItemOnEditItemHistory: any;
let linkGetItemInPurchasingCustom: any;
let linkCountSummary: string, linkSummaryVendor: string, linkSummaryVendorWithTotalQtyAndTotalPrice: string, linkCountItemsInPO: string, linkItemsInPO: string;
let linkCountItemsInPurchasingCustom: string, linkGetItemsInPurchasingCustom: string;
let salesVelocitySettingData: any[] = [];
let linkGetRestockSuggestionPurchasing: string[] = [];
let linkGetPercentDefaultOfAverages: string[] = [];
let linkGetLimitFiveItemInMySuggested: any;
let linkGetLimitFiveItemInCustom: any;

// Get Items
Then(`{} sets GET api endpoint to get count item in Edit Item History`, async function (actor: string) {
    linkGetItemOnEditItemHistory = this.linkCountItems = encodeURI(`${Links.API_ITEM_COUNT}?where={"logic":"and","filters":[{"logic":"and","filters":[{"field":"isHidden","operator":"eq","value":false}]}]}`);
});