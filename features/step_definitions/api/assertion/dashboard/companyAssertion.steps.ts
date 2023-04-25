import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as companiesRequest from '../../../../../src/api/request/administration.service';
import logger from '../../../../../src/Logger/logger';
import { Links } from '../../../../../src/utils/links';
import _ from "lodash";
import { companyResponseSchema } from './companyAssertionSchema';

Then('{} checks API contract essential types in company object are correct', async function (actor: string) {
    companyResponseSchema.parse(this.responseBodyOfACompanyObject);
})

Then('{} checks data type of tokens in response of get all companies are correct', async function (actor: string) {
    if (this.responseBodyOfACompanyObject.accessToken !== null) {
        expect(typeof (this.responseBodyOfACompanyObject.accessToken), 'Type of accessToken value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfACompanyObject.accessToken, 'accessToken value should be null').toBeNull();
    }
    if (this.responseBodyOfACompanyObject.refreshToken !== null) {
        expect(typeof (this.responseBodyOfACompanyObject.refreshToken), 'Type of refreshToken value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfACompanyObject.refreshToken, 'refreshToken value should be null').toBeNull();
    }
    if (this.responseBodyOfACompanyObject.companyPreferences.length == 0) {
        expect(typeof (this.responseBodyOfACompanyObject.companyPreferences), 'Type of companyPreferences value should be object').toBe("object");
    }
})

Then('{} checks data type of isAuthorized in response of get company by key are correct', async function (actor: string) {
    if (this.responseBodyOfACompanyObject.isAuthorized !== null) {
        expect(typeof (this.responseBodyOfACompanyObject.isAuthorized), 'Type of isAuthorized value should be boolean').toBe("boolean");
    }
    else {
        expect(this.responseBodyOfACompanyObject.isAuthorized, 'isAuthorized value should be null').toBeNull();
    }
})

Then('{} checks values in response of company are correct', async function (actor: string) {
    const companyType = ['ASC', 'CSV', 'QBFS', 'QBO'];
    expect(companyType, `Company Type should be one of ${companyType}`).toContain(this.responseBodyOfACompanyObject.companyType);
    expect(this.responseBodyOfACompanyObject.companyKey).not.toBeNull();
    expect(this.responseBodyOfACompanyObject.companyName).not.toBeNull();
    if (this.selectedCompany != null) {
        expect(this.responseBodyOfACompanyObject.companyKey).toBe(this.selectedCompany.companyKey);
        expect(this.responseBodyOfACompanyObject.companyType).toBe(this.selectedCompany.companyType);
        expect(this.responseBodyOfACompanyObject.companyName).toBe(this.selectedCompany.companyName);
    }
})



