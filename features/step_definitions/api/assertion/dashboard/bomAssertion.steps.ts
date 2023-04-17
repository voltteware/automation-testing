import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import _ from "lodash";

Then('{} checks API contract essential types in bom object are correct', async function (actor: string) {
    expect(typeof (this.responseBodyOfABomObject.companyType), 'Type of companyType value should be string').toBe("string");
    expect(typeof (this.responseBodyOfABomObject.companyKey), 'Type of companyKey value should be string').toBe("string");
    expect(typeof (this.responseBodyOfABomObject.childKey), 'Type of childKey value should be string').toBe("string");
    expect(typeof (this.responseBodyOfABomObject.parentKey), 'Type of parentKey value should be string').toBe("string");
    expect(typeof (this.responseBodyOfABomObject.childName), 'Type of childName value should be string').toBe("string");
    expect(typeof (this.responseBodyOfABomObject.parentName), 'Type of parentName value should be string').toBe("string");
    expect(Date.parse(this.responseBodyOfABomObject.created_at), 'Type of created_at value should be date').not.toBeNull();
    expect(Date.parse(this.responseBodyOfABomObject.updated_at), 'Type of updated_at value should be date').not.toBeNull();
    expect(typeof (this.responseBodyOfABomObject.qty), 'Type of qty value should be number').toBe("number");
})


