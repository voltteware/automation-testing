import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as forecastRequest from '../../../../src/api/request/forecast.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { faker } from '@faker-js/faker';
import _ from "lodash";
import { RunForecastResponseSchema } from '../assertion/general/runForecastAssertionSchema';

let linkPostForecast: string;

Then(`{} sets POST api to run forecast`, async function (actor: string) {
    linkPostForecast = Links.API_RUN_FORECAST;
});

Then('{} checks API contract of run forecast api', async function (actor: string) {
    RunForecastResponseSchema.parse(this.postForecastResponseBody);
});

Then('{} sends a POST request to run forecast', async function (actor: string) {
    this.postForecastResponse = this.response = await forecastRequest.postForecast(this.request, linkPostForecast, this.getCompanyInfoResponseBody, this.headers);
    const responseBodyText = await this.postForecastResponse.text();
    if (this.postForecastResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.postForecastResponseBody = JSON.parse(await this.postForecastResponse.text());
        logger.log('info', `Response POST ${linkPostForecast}` + JSON.stringify(this.postForecastResponseBody, undefined, 4));
        this.attach(`Response POST ${linkPostForecast} ` + JSON.stringify(this.postForecastResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${linkPostForecast} has status code ${this.postForecastResponse.status()} ${this.postForecastResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${linkPostForecast} has status code ${this.postForecastResponse.status()} ${this.postForecastResponse.statusText()} and response body ${actualResponseText}`)
    }
});