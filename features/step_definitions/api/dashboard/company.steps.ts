import { When, Then, Given, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as companyRequest from '../../../../src/api/request/company.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { faker } from '@faker-js/faker';
import _ from "lodash";
import exp from 'constants';

let companyType: any;
let companyKey: any;
let link: any;
let linkGetCompanies: any;

Then(`{} sets GET api endpoint to get company keys`, async function (actor: string) {
    link = Links.API_REALM;
});

Then(`{} sets GET api endpoint to get companies information of current user`, async function (actor: string) {
    linkGetCompanies = Links.API_GET_COMPANY;
});

Then('{} sends a GET request to get company keys', async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getRealmResponse = this.response = await companyRequest.getRealm(this.request, link, options);
    const responseBodyText = await this.getRealmResponse.text();
    if (this.getRealmResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getRealmResponseBody = JSON.parse(await this.getRealmResponse.text());
        // logger.log('info', `Response GET ${Links.API_REALM}` + JSON.stringify(this.getRealmResponseBody, undefined, 4));
        // this.attach(`Response GET ${Links.API_REALM}` + JSON.stringify(this.getRealmResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${link} has status code ${this.getRealmResponse.status()} ${this.getRealmResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${link} has status code ${this.getRealmResponse.status()} ${this.getRealmResponse.statusText()} and response body ${actualResponseText}`)
    }
})

Then('{} sends a GET request to get companies', async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getCompaniesResponse = this.response = await companyRequest.getCompanies(this.request, linkGetCompanies, options);
    const responseBodyText = await this.getCompaniesResponse.text();
    if (this.getCompaniesResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getCompaniesResponseBody = JSON.parse(await this.getCompaniesResponse.text());
        // logger.log('info', `Response GET ${Links.API_REALM}` + JSON.stringify(this.getCompaniesResponseBody, undefined, 4));
        // this.attach(`Response GET ${Links.API_REALM}` + JSON.stringify(this.getCompaniesResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${link} has status code ${this.getCompaniesResponse.status()} ${this.getCompaniesResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${link} has status code ${this.getCompaniesResponse.status()} ${this.getCompaniesResponse.statusText()} and response body ${actualResponseText}`)
    }
})

Then('{} picks random company from response of get company keys API', async function (actor: string) {
    this.randomCompany = await this.getRealmResponseBody[Math.floor(Math.random() * this.getRealmResponseBody.length)];
    logger.log('info', `Random company: ${JSON.stringify(this.randomCompany, undefined, 4)}`);
    this.attach(`Random company: ${JSON.stringify(this.randomCompany, undefined, 4)}`);
    this.companyKey = this.randomCompany.companyKey;
    this.companyType = this.randomCompany.companyType;
    logger.log('info', `companyKey: ${this.companyKey}`);
    this.attach(`COMPANY KEY: ${this.companyKey}`);
    logger.log('info', `companyType: ${this.companyType}`);
    this.attach(`COMPANY TYPE: ${this.companyType}`);
})

Then('{} picks random company which has onboarded in above response', async function (actor: string) {
    this.randomCompany = await this.getCompaniesResponseBody[Math.floor(Math.random() * this.getCompaniesResponseBody.length)];
    logger.log('info', `Random company: ${JSON.stringify(this.randomCompany, undefined, 4)}`);
    this.attach(`Random company: ${JSON.stringify(this.randomCompany, undefined, 4)}`);
    this.companyKey = this.randomCompany.companyKey;
    this.companyType = this.randomCompany.companyType;
    logger.log('info', `companyKey: ${this.companyKey}`);
    this.attach(`COMPANY KEY: ${this.companyKey}`);
    logger.log('info', `companyType: ${this.companyType}`);
    this.attach(`COMPANY TYPE: ${this.companyType}`);
})

Then('{} picks company which has onboarded before with type {} in above response', async function (actor, companyType: string) {
    // Onboarded company should have forecast date information
    this.selectedCompany = await this.getCompaniesResponseBody.find((co: any) => co.companyType == companyType && co.lastForecastDate != null)
    this.randomCompany = this.selectedCompany
    this.attach(`Company which has type ${companyType}: ${JSON.stringify(this.selectedCompany, undefined, 4)}`);;
    logger.log('info', `Company which has type ${companyType}: ${JSON.stringify(this.selectedCompany, undefined, 4)}`);
    // this.attach(`Companies >>>> : ${JSON.stringify(await this.getCompaniesResponseBody, undefined, 4)}`);
    // logger.log('info', `Companies >>>> : ${JSON.stringify(await this.getCompaniesResponseBody, undefined, 4)}`);
    this.companyKey = this.selectedCompany.companyKey;
    this.companyType = this.selectedCompany.companyType;
    logger.log('info', `companyKey: ${this.companyKey}`);
    this.attach(`COMPANY KEY: ${this.companyKey}`);
    logger.log('info', `companyType: ${this.companyType}`);
    this.attach(`COMPANY TYPE: ${this.companyType}`);
})

Then('{} picks a company with type {} and name {} in above response', async function (actor, companyType: string, companyName: string) {
    this.selectedCompany = await this.getCompaniesResponseBody.find((co: any) => ((co.companyType == companyType) && (co.companyName == companyName)))
    this.randomCompany = this.selectedCompany
    logger.log('info', `Company which has type ${companyType}: ${JSON.stringify(this.selectedCompany, undefined, 4)}`);
    this.attach(`Company which has type ${companyType}: ${JSON.stringify(this.selectedCompany, undefined, 4)}`);
    this.companyKey = this.selectedCompany.companyKey;
    this.companyType = this.selectedCompany.companyType;
    logger.log('info', `companyKey: ${this.companyKey}`);
    this.attach(`COMPANY KEY: ${this.companyKey}`);
    logger.log('info', `companyType: ${this.companyType}`);
    this.attach(`COMPANY TYPE: ${this.companyType}`);
})

Then('{} checks API contract types in random company object are correct', async function (actor: string) {
    // Check companyType
    expect(typeof (this.randomCompany.companyType), 'Type of companyType value should be string').toBe("string");
    // Check companyKey is string 
    expect(typeof (this.randomCompany.companyKey), 'Type of companyKey value should be string').toBe("string");
    // Check userId.
    expect(typeof (this.randomCompany.userId), 'Type of userId value should be string').toBe("string");
    // Check companyName
    expect(typeof (this.randomCompany.companyName), 'Type of companyName value should be string').toBe("string");
    // Check created_at
    expect(Date.parse(this.randomCompany.created_at), 'Created_at in response should be date').not.toBeNull();
    // Check updated_at
    expect(Date.parse(this.randomCompany.updated_at), 'updated_at in response should be date').not.toBeNull();
})

Then('{} checks {} and other values in response of random company are correct', async function (actor, userId: string) {
    const companyType = ['ASC', 'CSV', 'QBFS', 'QBO'];
    expect(companyType, `Company Type should be one of ${companyType}`).toContain(this.randomCompany.companyType);
    expect(this.randomCompany.companyKey).not.toBeNull();
    expect(this.randomCompany.userId).toBe(userId);
    expect(this.randomCompany.companyName).not.toBeNull();
})

Then(`{} sets GET api endpoint to get information of a company belongs to {} using company key {}`, async function (actor, email, company: string) {
    if (company == 'random') {
        this.selectedCompany = this.randomCompany;
    }
    else {
        this.selectedCompany = this.getRealmResponseBody.find((co: any) => co.companyKey == company);
    }

    logger.log('info', `Selected company of account ${email}: ${JSON.stringify(this.selectedCompany, undefined, 4)}`);
    this.attach(`Selected company of account ${email}: ${JSON.stringify(this.selectedCompany, undefined, 4)}`);

    this.companyKey = this.selectedCompany.companyKey;
    this.companyType = this.selectedCompany.companyType;
    logger.log('info', `companyKey: ${this.companyKey}`);
    this.attach(`COMPANY KEY: ${this.companyKey}`);
    logger.log('info', `companyType: ${this.companyType}`);
    this.attach(`COMPANY TYPE: ${this.companyType}`);
    link = `${Links.API_UPDATE_COMPANY}${this.companyKey}`;
});

When(`{} sends a GET request to get company information of {} by company key`, async function (actor, email: string) {
    const options = {
        headers: this.headers
    }

    this.getCompanyInfoResponse = this.response = await companyRequest.getCompanyInfo(this.request, link, options);
    const responseBodyText = await this.getCompanyInfoResponse.text();
    if (this.getCompanyInfoResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBodyOfACompanyObject = JSON.parse(await this.getCompanyInfoResponse.text());
        logger.log('info', `Response GET ${link}` + JSON.stringify(this.responseBodyOfACompanyObject, undefined, 4));
        this.attach(`Response GET ${link}` + JSON.stringify(this.responseBodyOfACompanyObject, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${link} has status code ${this.getCompanyInfoResponse.status()} ${this.getCompanyInfoResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${link} has status code ${this.getCompanyInfoResponse.status()} ${this.getCompanyInfoResponse.statusText()} and response body ${actualResponseText}`)
    }
})

Then('{} checks that the lastForecastDate field was updated and jobInitiator is null in company detail information after running forecast', { timeout: 10 * 60 * 1000 }, async function (actor: string) {
    const linkGetCompanyInfo = `${Links.API_GET_COMPANY}/${this.companyKey}`;
    const options = {
        headers: this.headers
    }
    const beforeForecastDate = Date.parse(this.lastForecastDate);
    logger.log('info', `Before Last Forecast Date: >>>>>>` + beforeForecastDate);
    this.attach(`Before Last Forecast Date: >>>>>>` + beforeForecastDate);

    await expect.poll(async () => {
        const getCompanyInfoResponse = await companyRequest.getCompanyInfo(this.request, linkGetCompanyInfo, options);
        const getCompanyInfoResponseBody = JSON.parse(await getCompanyInfoResponse.text());
        const lastForecastDateAfterRunningForecast = Date.parse(getCompanyInfoResponseBody.lastForecastDate);
        console.log(`last Forecast Date After Running Forecast is: >>>>>>`, lastForecastDateAfterRunningForecast);
        logger.log('info', `last Forecast Date After Running Forecast is is: >>>>>>` + lastForecastDateAfterRunningForecast);
        this.attach(`last Forecast Date After Running Forecast is: >>>>>>` + lastForecastDateAfterRunningForecast);
        return lastForecastDateAfterRunningForecast;
    }, {
        // Custom error message, optional.
        message: `make sure Last Forecast Date is after the moment user clicks Run Forecast`, // custom error message
        // Probe, wait 1s, probe, wait 5s, probe, wait 10s, probe, wait 10s, probe, .... Defaults to [100, 250, 500, 1000].
        intervals: [1_000, 5_000, 10_000],
        timeout: 2 * 60 * 1000,
    }).toBeGreaterThan(beforeForecastDate);

    // jobInitiator is a value to check completing forecast
    await expect.poll(async () => {
        const getCompanyInfoResponse = await companyRequest.getCompanyInfo(this.request, linkGetCompanyInfo, options);
        const getCompanyInfoResponseBody = JSON.parse(await getCompanyInfoResponse.text());
        const jobInitiator = getCompanyInfoResponseBody.jobInitiator;
        console.log(`jobInitiator is: >>>>>> `, jobInitiator);
        logger.log('info', `jobInitiator is: >>>>>> ` + jobInitiator);
        this.attach(`jobInitiator is: >>>>>> ` + jobInitiator);
        return jobInitiator;
    }, {
        // Custom error message, optional.
        message: `make sure Last Forecast Date is after the moment user clicks Run Forecast`, // custom error message
        // Probe, wait 1s, probe, wait 5s, probe, wait 10s, probe, wait 10s, probe, .... Defaults to [100, 250, 500, 1000].
        intervals: [1_000, 2_000, 5_000],
        timeout: 8 * 60 * 1000,
    }).toBeNull();
    const sleep = (milliseconds: number) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    await sleep(5000);
    // await expect.poll(async () => {
    //     const getCompanyInfoResponse = await companyRequest.getCompanyInfo(this.request, linkGetCompanyInfo, options);
    //     const getCompanyInfoResponseBody = JSON.parse(await getCompanyInfoResponse.text());
    //     const jobProcessing = getCompanyInfoResponseBody.jobProcessing;
    //     console.log(`jobProcessing is: >>>>>>`, jobProcessing);
    //     logger.log('info', `jobProcessing is: >>>>>>` + jobProcessing);
    //     this.attach(`jobProcessing is: >>>>>>` + jobProcessing);
    //     return jobProcessing;
    // }, {
    //     // Custom error message, optional.
    //     message: `make sure Last Forecast Date is after the moment user clicks Run Forecast`, // custom error message
    //     // Probe, wait 1s, probe, wait 5s, probe, wait 10s, probe, wait 10s, probe, .... Defaults to [100, 250, 500, 1000].
    //     intervals: [1_000, 2_000, 5_000],
    //     timeout: 15 * 60 * 1000,
    // }).toBeFalsy();
})

Given('User sets GET api to get information of {string} company', function (companyType) {
    this.linkApiAdminGetInfomationCompany = `${Links.API_ADMIN_GET_COMPANIES}/${this.companyKey}/${companyType}`
});

Given('User sends GET request to get information of company', async function () {
    const options = {
        headers: this.headers
    }

    this.getInformationCompanyResponse = this.response = await companyRequest.getCompanyInfo(this.request, this.linkApiAdminGetInfomationCompany, options);
    const responseBodyText = await this.getInformationCompanyResponse.text();
    if (this.getInformationCompanyResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getInformationCompanyResponseBody = JSON.parse(await this.getInformationCompanyResponse.text());
        logger.log('info', `Response GET ${link}` + JSON.stringify(this.getInformationCompanyResponseBody, undefined, 4));
        this.attach(`Response GET ${link}` + JSON.stringify(this.getInformationCompanyResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${this.linkApiAdminGetInfomationCompany} has status code ${this.getInformationCompanyResponse.status()} ${this.getInformationCompanyResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${this.linkApiAdminGetInfomationCompany} has status code ${this.getInformationCompanyResponse.status()} ${this.getInformationCompanyResponse.statusText()} and response body ${actualResponseText}`)
    }
});

Given('User sets PUT api to change information of {string} company', function (companyType: string, dataTable: DataTable) {
    this.linkApiChangeInformationCompany = `${Links.API_UPDATE_COMPANY}${this.companyKey}`

    const rows = dataTable.hashes();
    const {companyName, leadTime, orderInterval, serviceLevel, isNotifyingAfterForecast, isNotifyingAfterSync, isLostSaleTracking, displayRestockAMZ, lastSyncDate, phone} = rows[0]
    this.changeInformationCompanyPayload = this.getInformationCompanyResponseBody
    switch (companyType) {
        case "ASC":
            // const {companyName, leadTime, orderInterval, serviceLevel, isNotifyingAfterForecast, isNotifyingAfterSync, isLostSaleTracking, displayRestockAMZ, lastSyncDate} = rows[0]
            companyName === "random" ? this.changeInformationCompanyPayload.companyName = `${faker.company.name()}-AutoTest` : this.changeInformationCompanyPayload.companyName = companyName
            leadTime === "random" ? this.changeInformationCompanyPayload.leadTime = Number(faker.datatype.number({'min': 1,'max': 365})) : this.changeInformationCompanyPayload.leadTime = leadTime
            orderInterval === "random" ? this.changeInformationCompanyPayload.orderInterval = Number(faker.datatype.number({'min': 1,'max': 365})) : this.changeInformationCompanyPayload.orderInterval = orderInterval
            serviceLevel === "random" ? this.changeInformationCompanyPayload.serviceLevel = Number(faker.datatype.number({'min': 1,'max': 99})) : this.changeInformationCompanyPayload.serviceLevel = serviceLevel
            isNotifyingAfterForecast === "random" ? this.changeInformationCompanyPayload.isNotifyingAfterForecast = !Boolean(this.changeInformationCompanyPayload.isNotifyingAfterForecast) : this.changeInformationCompanyPayload.isNotifyingAfterForecast = isNotifyingAfterForecast
            isNotifyingAfterSync === "random" ? this.changeInformationCompanyPayload.isNotifyingAfterSync = !Boolean(this.changeInformationCompanyPayload.isNotifyingAfterSync) : this.changeInformationCompanyPayload.isNotifyingAfterSync = isNotifyingAfterSync
            isLostSaleTracking === "random" ? this.changeInformationCompanyPayload.isLostSaleTracking = !Boolean(this.changeInformationCompanyPayload.isLostSaleTracking) : this.changeInformationCompanyPayload.isLostSaleTracking = isLostSaleTracking
            displayRestockAMZ === "random" ? this.changeInformationCompanyPayload.displayRestockAMZ = !Boolean(this.changeInformationCompanyPayload.displayRestockAMZ) : this.changeInformationCompanyPayload.displayRestockAMZ = displayRestockAMZ
            if (lastSyncDate === "random"){
                // Generate a random between 1 year ago and today
                const today = new Date();
                const oneYearAgo = new Date(today.getTime() - (365 * 24 * 60 * 60 * 100))                
                const randomTime = oneYearAgo.getTime() + Math.random() * (today.getTime() - oneYearAgo.getTime())
                const randomDate = new Date(randomTime)

                this.changeInformationCompanyPayload.lastSyncDate = randomDate.toISOString()                                
            } else {
                this.changeInformationCompanyPayload.lastSyncDate = lastSyncDate
            }
            break;
        case "CSV":
            // const {companyName, leadTime, orderInterval, serviceLevel, isNotifyingAfterForecast, isNotifyingAfterSync, isLostSaleTracking} = rows[0]
            companyName === "random" ? this.changeInformationCompanyPayload.companyName = `${faker.company.name()}-AutoTest` : this.changeInformationCompanyPayload.companyName = companyName
            leadTime === "random" ? this.changeInformationCompanyPayload.leadTime = Number(faker.datatype.number({'min': 1,'max': 365})) : this.changeInformationCompanyPayload.leadTime = leadTime
            orderInterval === "random" ? this.changeInformationCompanyPayload.orderInterval = Number(faker.datatype.number({'min': 1,'max': 365})) : this.changeInformationCompanyPayload.orderInterval = orderInterval
            serviceLevel === "random" ? this.changeInformationCompanyPayload.serviceLevel = Number(faker.datatype.number({'min': 1,'max': 99})) : this.changeInformationCompanyPayload.serviceLevel = serviceLevel
            isNotifyingAfterForecast === "random" ? this.changeInformationCompanyPayload.isNotifyingAfterForecast = !Boolean(this.changeInformationCompanyPayload.isNotifyingAfterForecast) : this.changeInformationCompanyPayload.isNotifyingAfterForecast = isNotifyingAfterForecast
            isNotifyingAfterSync === "random" ? this.changeInformationCompanyPayload.isNotifyingAfterSync = !Boolean(this.changeInformationCompanyPayload.isNotifyingAfterSync) : this.changeInformationCompanyPayload.isNotifyingAfterSync = isNotifyingAfterSync
            isLostSaleTracking === "random" ? this.changeInformationCompanyPayload.isLostSaleTracking = !Boolean(this.changeInformationCompanyPayload.isLostSaleTracking) : this.changeInformationCompanyPayload.isLostSaleTracking = isLostSaleTracking
            break;
        case "QBFS":
            phone === "random" ? this.changeInformationCompanyPayload.phone = `${faker.phone.phoneNumber('091#######')}` : this.changeInformationCompanyPayload.phone = phone
            leadTime === "random" ? this.changeInformationCompanyPayload.leadTime = Number(faker.datatype.number({'min': 1,'max': 365})) : this.changeInformationCompanyPayload.leadTime = leadTime
            orderInterval === "random" ? this.changeInformationCompanyPayload.orderInterval = Number(faker.datatype.number({'min': 1,'max': 365})) : this.changeInformationCompanyPayload.orderInterval = orderInterval
            serviceLevel === "random" ? this.changeInformationCompanyPayload.serviceLevel = Number(faker.datatype.number({'min': 1,'max': 99})) : this.changeInformationCompanyPayload.serviceLevel = serviceLevel
            isNotifyingAfterForecast === "random" ? this.changeInformationCompanyPayload.isNotifyingAfterForecast = !Boolean(this.changeInformationCompanyPayload.isNotifyingAfterForecast) : this.changeInformationCompanyPayload.isNotifyingAfterForecast = isNotifyingAfterForecast
            isNotifyingAfterSync === "random" ? this.changeInformationCompanyPayload.isNotifyingAfterSync = !Boolean(this.changeInformationCompanyPayload.isNotifyingAfterSync) : this.changeInformationCompanyPayload.isNotifyingAfterSync = isNotifyingAfterSync
            isLostSaleTracking === "random" ? this.changeInformationCompanyPayload.isLostSaleTracking = !Boolean(this.changeInformationCompanyPayload.isLostSaleTracking) : this.changeInformationCompanyPayload.isLostSaleTracking = isLostSaleTracking
            break;
        default:
            break;
    }    

    logger.log('info', `Change information company Payload >>>>>>>` + JSON.stringify(this.changeInformationCompanyPayload, undefined, 4));
        this.attach(`Change information company Payload >>>>>>>` + JSON.stringify(this.changeInformationCompanyPayload, undefined, 4))
});

Given('User sends PUT request to change information of company', async function (){
    this.response = this.changeInformationCompanyResponse = await companyRequest.updateCompany(this.request, this.linkApiChangeInformationCompany, this.companyKey, this.changeInformationCompanyPayload, this.headers);
    const responseBodyText = await this.changeInformationCompanyResponse.text();
    if (this.changeInformationCompanyResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.changeInformationCompanyResponseBody = JSON.parse(responseBodyText)
        logger.log('info', `Response PUT ${this.linkApiChangeInformationCompany}` + JSON.stringify(this.changeInformationCompanyResponseBody, undefined, 4));
        this.attach(`Response PUT ${this.linkApiChangeInformationCompany}` + JSON.stringify(this.changeInformationCompanyResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response PUT ${this.linkApiChangeInformationCompany} has status code ${this.changeInformationCompanyResponse.status()} ${this.changeInformationCompanyResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response PUT ${this.linkApiChangeInformationCompany} has status code ${this.changeInformationCompanyResponse.status()} ${this.changeInformationCompanyResponse.statusText()} and response body ${actualResponseText}`)
    }
});

Given('Information of company must be change successfully', async function(){
    expect(this.changeInformationCompanyResponseBody.companyName).toBe(this.changeInformationCompanyPayload.companyName)
    expect(this.changeInformationCompanyResponseBody.leadTime).toBe(this.changeInformationCompanyPayload.leadTime)
    expect(this.changeInformationCompanyResponseBody.orderInterval).toBe(this.changeInformationCompanyPayload.orderInterval)
    expect(this.changeInformationCompanyResponseBody.serviceLevel).toBe(this.changeInformationCompanyPayload.serviceLevel)
    expect(this.changeInformationCompanyResponseBody.isNotifyingAfterForecast).toBe(this.changeInformationCompanyPayload.isNotifyingAfterForecast)
    expect(this.changeInformationCompanyResponseBody.isNotifyingAfterSync).toBe(this.changeInformationCompanyPayload.isNotifyingAfterSync)
    expect(this.changeInformationCompanyResponseBody.isLostSaleTracking).toBe(this.changeInformationCompanyPayload.isLostSaleTracking)
    expect(this.changeInformationCompanyResponseBody.displayRestockAMZ).toBe(this.changeInformationCompanyPayload.displayRestockAMZ)
});

Then('User sets GET api to get associated users of company', function () {
    this.linkApiGetAssociatedUser = encodeURI(`${Links.API_GET_COMPANY}/${this.companyKey}/users?type=${this.companyType}`)
});

Then('User sends a GET request to get associated user of company', async function () {
    const options = {
        headers: this.headers
    } 

    this.getAssociatedUsersResponse = this.response = await companyRequest.getAssociatedUsers(this.request, this.linkApiGetAssociatedUser, options);
    const responseBodyText = await this.getAssociatedUsersResponse.text();
    if (this.getAssociatedUsersResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getAssociatedUsersResponseBody = JSON.parse(await this.getAssociatedUsersResponse.text());
        logger.log('info', `Response GET ${this.linkApiGetAssociatedUser}` + JSON.stringify(this.getAssociatedUsersResponseBody, undefined, 4));
        this.attach(`Response GET ${this.linkApiGetAssociatedUser}` + JSON.stringify(this.getAssociatedUsersResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${this.linkApiGetAssociatedUser} has status code ${this.getAssociatedUsersResponse.status()} ${this.getAssociatedUsersResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${this.linkApiGetAssociatedUser} has status code ${this.getAssociatedUsersResponse.status()} ${this.getAssociatedUsersResponse.statusText()} and response body ${actualResponseText}`)
    }
}); 

Given('User selects a user in associated users list', function () {
    const associatedUsers = this.getAssociatedUsersResponseBody
    const randomIndex = Math.floor(Math.random() * associatedUsers.length)
    const anAssociatedUser = associatedUsers[randomIndex]

    this.userId = anAssociatedUser.userId
});

Then('User verify that the user successfully added', function () {
    const associatedUsers = this.getAssociatedUsersResponseBody
    const hasUserWithUserId = associatedUsers.some( (user: any) => user.userId === this.userId)

    expect(hasUserWithUserId, "User just created must be display in associated users").toBeTruthy()
});