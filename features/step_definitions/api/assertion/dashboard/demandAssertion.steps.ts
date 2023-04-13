import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import _ from "lodash";

Then('{} checks API contract essential types in demand object are correct', async function (actor: string) {
    expect(typeof (this.responseBodyOfADemandObject.asin), 'Type of ASIN value should be string').toBe("string");
    expect(typeof (this.responseBodyOfADemandObject.companyType), 'Type of companyType value should be string').toBe("string");
    expect(typeof (this.responseBodyOfADemandObject.companyKey), 'Type of companyKey value should be string').toBe("string");
    expect(Date.parse(this.responseBodyOfADemandObject.dueDate), 'Type of dueDate value should be date').not.toBeNull();
    expect(typeof (this.responseBodyOfADemandObject.fnsku), 'Type of FNSKU value should be string').toBe("string");
    expect(typeof (this.responseBodyOfADemandObject.imageUrl), 'Type of imageUrl value should be url').not.toBeNull();
    expect(typeof (this.responseBodyOfADemandObject.itemKey), 'Type of itemKey value should be string').toBe("string");
    expect(typeof (this.responseBodyOfADemandObject.itemName), 'Type of itemName value should be string').toBe("string");
    expect(typeof (this.responseBodyOfADemandObject.openQty), 'Type of openQty value should be number').toBe("number");
    expect(typeof (this.responseBodyOfADemandObject.orderKey), 'Type of orderKey value should be string').toBe("string");
    expect(typeof (this.responseBodyOfADemandObject.orderQty), 'Type of orderQty value should be number').toBe("number");
    expect(typeof (this.responseBodyOfADemandObject.orderStatus), 'Type of orderStatus value should be string').toBe("string");
    expect(typeof (this.responseBodyOfADemandObject.rowKey), 'Type of rowKey value should be string').toBe("string");
})

Then('{} checks API contract essential types in create demand object are correct', async function (actor: string) {
    expect(typeof (this.responseBodyOfADemandObject.asin), 'Type of ASIN value should be string').toBe("string");
    expect(typeof (this.responseBodyOfADemandObject.companyType), 'Type of companyType value should be string').toBe("string");
    expect(typeof (this.responseBodyOfADemandObject.companyKey), 'Type of companyKey value should be string').toBe("string");
    expect(Date.parse(this.responseBodyOfADemandObject.dueDate), 'Type of dueDate value should be date').not.toBeNull();    
    expect(typeof (this.responseBodyOfADemandObject.itemKey), 'Type of itemKey value should be string').toBe("string");
    expect(typeof (this.responseBodyOfADemandObject.itemName), 'Type of itemName value should be string').toBe("string");
    expect(typeof (this.responseBodyOfADemandObject.openQty), 'Type of openQty value should be number').toBe("number");
    expect(typeof (this.responseBodyOfADemandObject.orderKey), 'Type of orderKey value should be string').toBe("string");
    expect(typeof (this.responseBodyOfADemandObject.orderQty), 'Type of orderQty value should be number').toBe("number");
    expect(typeof (this.responseBodyOfADemandObject.orderStatus), 'Type of orderStatus value should be string').toBe("string");
    expect(typeof (this.responseBodyOfADemandObject.rowKey), 'Type of rowKey value should be string').toBe("string");
})