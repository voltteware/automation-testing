import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import _ from "lodash";

Then('{} checks API contract essential types in grid view object are correct', async function (actor: string) {
    expect(typeof (this.responseBodyOfAGridViewSupplierObject.companyType), 'Type of companyType value should be string').toBe("string");
    expect(typeof (this.responseBodyOfAGridViewSupplierObject.companyKey), 'Type of companyKey value should be string').toBe("string");
    expect(typeof (this.responseBodyOfAGridViewSupplierObject.userId), 'Type of userId value should be string').toBe("string");
    expect(typeof (this.responseBodyOfAGridViewSupplierObject.name), 'Type of name value should be string').toBe("string");
    expect(typeof (this.responseBodyOfAGridViewSupplierObject.itemType), 'Type of itemType value should be string').toBe("string");
    if (this.responseBodyOfAGridViewSupplierObject.gridState.columns.length > 0) {
        expect(typeof (this.responseBodyOfAGridViewSupplierObject.gridState.columns), 'Type of columns value should be object').toBe("object");
        const randomColumns = this.responseBodyOfAGridViewSupplierObject.gridState.columns[Math.floor(Math.random() * this.responseBodyOfAGridViewSupplierObject.gridState.columns.length)];
        expect(typeof (randomColumns.visible), 'Type of each visible value should be boolean').toBe("boolean");
        expect(typeof (randomColumns.width), 'Type of each width value should be string').toBe("string");
        expect(typeof (randomColumns.name), 'Type of each name value should be string').toBe("string");
    }
    expect(typeof (this.responseBodyOfAGridViewSupplierObject.gridState.scrollFocus), 'Type of scrollFocus value should be object').toBe("object");
    expect(typeof (this.responseBodyOfAGridViewSupplierObject.gridState.selection), 'Type of selection value should be object').toBe("object");
    expect(typeof (this.responseBodyOfAGridViewSupplierObject.gridState.grouping), 'Type of grouping value should be object').toBe("object");
    expect(typeof (this.responseBodyOfAGridViewSupplierObject.gridState.treeView), 'Type of treeView value should be object').toBe("object");
    expect(typeof (this.responseBodyOfAGridViewSupplierObject.gridState.pagination.paginationCurrentPage), 'Type of paginationCurrentPage value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAGridViewSupplierObject.gridState.pagination.paginationPageSize), 'Type of paginationPageSize value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAGridViewSupplierObject.gridState.filter), 'Type of filter value should be object').toBe("object");
    expect(typeof (this.responseBodyOfAGridViewSupplierObject.gridState.sort), 'Type of sort value should be object').toBe("object");
    expect(Date.parse(this.responseBodyOfAGridViewSupplierObject.created_at), 'created_at in response should be date').not.toBeNull();
    expect(Date.parse(this.responseBodyOfAGridViewSupplierObject.updated_at), 'updated_at in response should be date').not.toBeNull();
    expect(typeof (this.responseBodyOfAGridViewSupplierObject.key), 'Type of key value should be string').toBe("string");
})
    
