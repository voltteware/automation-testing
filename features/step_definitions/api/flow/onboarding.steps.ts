import { Then } from "@cucumber/cucumber";
import logger from "../../../../src/Logger/logger";
import * as companyRequest from '../../../../src/api/request/company.service';
import * as forecastRequest from '../../../../src/api/request/forecast.service';
import { Links } from "../../../../src/utils/links";
import { faker } from '@faker-js/faker';
import * as _ from "lodash";

let link: any;
let linkPostForecast: any;

Then('{} sets request body with payload as leadTime: {} and companyKey, companyType', async function (actor: string, leadTime: any) {
    if (leadTime == "random"){
        leadTime = Number(faker.datatype.number({
            'min': 1,
            'max': 365
        }));
    }
    else {
        leadTime = Number(leadTime);
    }
    this.payLoad = {
        leadTime: leadTime,
        companyKey: this.companyKey,
        companyType: this.companyType,
    }
    this.attach(`Payload: ${JSON.stringify(this.payLoad, undefined, 4)}`)
});

Then('{} sends a PUT method to set a scheduled time meeting', async function (actor: string) {
    this.payLoad = {
        companyType: this.companyType,
        companyKey: this.companyKey,
        companyName: this.companyName,
        companyPreferences: {
            config: {
                company: {
                    skipped: true,
                    completed: true
                },
                vendor: {
                    skipped: true,
                    completed: true,
                    uploaded: false
                },
                item: {
                    skipped: true,
                    completed: true,
                    uploaded: false
                },
                bom: {
                    skipped: true,
                    completed: true,
                    uploaded: false
                },
                demand: {
                    skipped: true,
                    completed: true,
                    uploaded: false
                },
                supply: {
                    skipped: true,
                    completed: true,
                    uploaded: false
                },
                forecast: {},
                hasScheduled: true
            }
        },
    }
    this.response = this.updateCompanyResponse = await companyRequest.updateCompany(this.request, Links.API_UPDATE_COMPANY, this.companyKey, this.payLoad, this.headers);
    const responseBodyText = await this.updateCompanyResponse.text();
    if (this.updateCompanyResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBodyOfACompanyObject = JSON.parse(responseBodyText)
        logger.log('info', `Response PUT ${Links.API_UPDATE_COMPANY}` + JSON.stringify(this.responseBodyOfACompanyObject, undefined, 4));
        this.attach(`Response PUT ${Links.API_UPDATE_COMPANY}` + JSON.stringify(this.responseBodyOfACompanyObject, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response PUT ${Links.API_UPDATE_COMPANY} has status code ${this.updateCompanyResponse.status()} ${this.updateCompanyResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response PUT ${Links.API_UPDATE_COMPANY} has status code ${this.updateCompanyResponse.status()} ${this.updateCompanyResponse.statusText()} and response body ${actualResponseText}`)
    }
});

Then(`{} sets GET api endpoint to get company information by company key`, async function (actor: string) {
    link = `${Links.API_GET_COMPANY}/${this.companyKey}`;
});

Then('{} sends a GET request to get all company', async function (actor: string){
    const options = {
        headers: this.headers
    }
    this.getListCompanyResponse = this.response = await companyRequest.getListCompanyInfo(this.request, `${Links.API_GET_COMPANY}`, options);
    const responseBodyText = await this.getListCompanyResponse.text();
    if (this.getListCompanyResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getListCompanyResponseBody = JSON.parse(await this.getListCompanyResponse.text());
        logger.log('info', `Response GET ${Links.API_GET_COMPANY}` + JSON.stringify(this.getListCompanyResponseBody, undefined, 4));
        this.attach(`Response GET ${Links.API_GET_COMPANY}` + JSON.stringify(this.getListCompanyResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${Links.API_GET_COMPANY} has status code ${this.getListCompanyResponse.status()} ${this.getListCompanyResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${Links.API_GET_COMPANY} has status code ${this.getListCompanyResponse.status()} ${this.getListCompanyResponse.statusText()} and response body ${actualResponseText}`)
    }
});

Then('{} sends a GET request to get company information by company key', async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getCompanyInfoResponse = this.response = await companyRequest.getCompanyInfo(this.request, link, options);
    const responseBodyText = await this.getCompanyInfoResponse.text();
    if (this.getCompanyInfoResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getCompanyInfoResponseBody = JSON.parse(await this.getCompanyInfoResponse.text());
        logger.log('info', `Response GET ${link}` + JSON.stringify(this.getCompanyInfoResponseBody, undefined, 4));
        this.attach(`Response GET ${link}` + JSON.stringify(this.getCompanyInfoResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${link} has status code ${this.getCompanyInfoResponse.status()} ${this.getCompanyInfoResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${link} has status code ${this.getCompanyInfoResponse.status()} ${this.getCompanyInfoResponse.statusText()} and response body ${actualResponseText}`)
    }
});

Then(`{} sets POST api to run forecast`, async function (actor: string) {
    linkPostForecast = Links.API_RUN_FORECAST;
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

//lastForecastDate is NULL => Onboarding company
Then('{} selects onboarding company with type {}', async function (actor, companyType: string){
    this.selectedCompany = await this.getListCompanyResponseBody.find((co: any) => co.companyType == companyType && co.lastForecastDate === null);
    this.companyKey = this.selectedCompany.companyKey;
    this.companyType = this.selectedCompany.companyType;
    logger.log('info', `Company which has type ${companyType}: ${JSON.stringify(this.selectedCompany, undefined, 4)}`);
    this.attach(`Company which has type ${companyType}: ${JSON.stringify(this.selectedCompany, undefined, 4)}`);
    logger.log('info', `companyKey: ${this.companyKey}`);
    this.attach(`COMPANY KEY: ${this.companyKey}`);
    logger.log('info', `companyType: ${this.companyType}`);
    this.attach(`COMPANY TYPE: ${this.companyType}`);
});