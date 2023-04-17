import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as companiesRequest from '../../../../../src/api/request/administration.service';
import logger from '../../../../../src/Logger/logger';
import { Links } from '../../../../../src/utils/links';
import _ from "lodash";

Then('{} checks API contract essential types in supplier object are correct', async function (actor: string) {
    expect(typeof (this.responseBodyOfASupplierObject.companyType), 'Type of companyType value should be string').toBe("string");
    expect(typeof (this.responseBodyOfASupplierObject.companyKey), 'Type of companyKey value should be string').toBe("string");
    expect(typeof (this.responseBodyOfASupplierObject.key), 'Type of key value should be string').toBe("string");
    expect(typeof (this.responseBodyOfASupplierObject.name), 'Type of name value should be string').toBe("string");
    if (this.responseBodyOfASupplierObject.description !== null) {
        expect(typeof (this.responseBodyOfASupplierObject.description), 'Type of description value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfASupplierObject.description, 'description value should be null').toBeNull();
    }
    expect(typeof (this.responseBodyOfASupplierObject.isHidden), 'Type of name value should be boolean').toBe("boolean");
    if (this.responseBodyOfASupplierObject.shipVia !== null) {
        expect(typeof (this.responseBodyOfASupplierObject.shipVia), 'Type of shipVia value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfASupplierObject.shipVia, 'shipVia value should be null').toBeNull();
    }
    if (this.responseBodyOfASupplierObject.email !== null) {
        expect(typeof (this.responseBodyOfASupplierObject.email), 'Type of email value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfASupplierObject.email, 'email value should be null').toBeNull();
    }
    if (this.responseBodyOfASupplierObject.moq !== null) {
        expect(typeof (this.responseBodyOfASupplierObject.moq), 'Type of moq value should be number').toBe("number");
    }
    else {
        expect(this.responseBodyOfASupplierObject.moq, 'moq value should be null').toBeNull();
    }
    if (this.responseBodyOfASupplierObject.leadTime !== null) {
        expect(typeof (this.responseBodyOfASupplierObject.leadTime), 'Type of leadTime value should be number').toBe("number");
    }
    else {
        expect(this.responseBodyOfASupplierObject.leadTime, 'leadTime value should be null').toBeNull();
    }
    if (this.responseBodyOfASupplierObject.orderInterval !== null) {
        expect(typeof (this.responseBodyOfASupplierObject.orderInterval), 'Type of orderInterval value should be number').toBe("number");
    }
    else {
        expect(this.responseBodyOfASupplierObject.orderInterval, 'orderInterval value should be null').toBeNull();
    }
    if (this.responseBodyOfASupplierObject.serviceLevel !== null) {
        expect(typeof (this.responseBodyOfASupplierObject.serviceLevel), 'Type of serviceLevel value should be number').toBe("number");
    }
    else {
        expect(this.responseBodyOfASupplierObject.serviceLevel, 'serviceLevel value should be null').toBeNull();
    }
    
    expect(typeof (this.responseBodyOfASupplierObject.forecastTags), 'Type of forecastTags value should be object').toBe("object");
    if (this.responseBodyOfASupplierObject.phone !== null) {
        expect(typeof (this.responseBodyOfASupplierObject.phone), 'Type of phone value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfASupplierObject.phone, 'phone value should be null').toBeNull();
    }
    if (this.responseBodyOfASupplierObject.fax !== null) {
        expect(typeof (this.responseBodyOfASupplierObject.fax), 'Type of fax value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfASupplierObject.fax, 'fax value should be null').toBeNull();
    }
    if (this.responseBodyOfASupplierObject.website !== null) {
        expect(typeof (this.responseBodyOfASupplierObject.website), 'Type of website value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfASupplierObject.website, 'website value should be null').toBeNull();
    }
    if (this.responseBodyOfASupplierObject.addressShippingUuid !== null) {
        expect(typeof (this.responseBodyOfASupplierObject.addressShippingUuid), 'addressShippingUuid value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfASupplierObject.addressShippingUuid, 'addressShippingUuid value should be null').toBeNull();
    }
    if (this.responseBodyOfASupplierObject.addressBillingUuid !== null) {
        expect(typeof (this.responseBodyOfASupplierObject.addressBillingUuid), 'addressBillingUuid value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfASupplierObject.addressBillingUuid, 'addressBillingUuid value should be null').toBeNull();
    }
    if (this.responseBodyOfASupplierObject.targetOrderValue !== null) {
        expect(typeof (this.responseBodyOfASupplierObject.targetOrderValue), 'Type of targetOrderValue value should be number').toBe("number");
    }
    else {
        expect(this.responseBodyOfASupplierObject.targetOrderValue, 'targetOrderValue value should be null').toBeNull();
    }
    
    if (this.responseBodyOfASupplierObject.freeFreightMinimum !== null) {
        expect(typeof (this.responseBodyOfASupplierObject.freeFreightMinimum), 'Type of freeFreightMinimum value should be number').toBe("number");
    }
    else {
        expect(this.responseBodyOfASupplierObject.freeFreightMinimum, 'freeFreightMinimum value should be null').toBeNull();
    }
    expect(typeof (this.responseBodyOfASupplierObject.restockModel), 'Type of restockModel value should be string').toBe("string");
    expect(typeof (this.responseBodyOfASupplierObject.averageHistoryLength), 'Type of averageHistoryLength value should be number').toBe("number");
    expect(Date.parse(this.responseBodyOfASupplierObject.created_at), 'created_at in response should be date').not.toBeNull();
    expect(Date.parse(this.responseBodyOfASupplierObject.updated_at), 'updated_at in response should be date').not.toBeNull();
})


