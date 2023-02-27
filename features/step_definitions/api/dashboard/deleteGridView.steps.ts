import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as gridviewRequest from '../../../../src/api/request/gridView.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";

let link: any;
Then(`{} sets DELETE api endpoint to delete gridview by key`, async function (actor: string) {
    link = Links.API_DELETE_GRID_VIEW;
});

Then('{} sends a DELETE method to delete grid view with key {}', async function (actor,key: string) {
    const options = {
        headers: this.headers
    }
    if(key == 'random'){
        this.randomKey = this.responseBodyOfAGridViewSupplierObject.key;
    }else{
        this.randomKey = key;
    }
    this.response = this.responseDeleteGridview = await gridviewRequest.deleteGridView(this.request, link, this.randomKey, options);
    logger.log('info', `Response DELETE ${link} has status code ${this.responseDeleteGridview.status()} ${this.responseDeleteGridview.statusText()}`);
    this.attach(`Response DELETE ${link} has status code ${this.responseDeleteGridview.status()} ${this.responseDeleteGridview.statusText()}`)
})