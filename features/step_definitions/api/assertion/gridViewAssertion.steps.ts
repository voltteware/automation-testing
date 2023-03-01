import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import _ from "lodash";

Then('{} checks API contract essential types in grid view object are correct', async function (actor: string) {
    expect(typeof (this.responseBodyOfAGridViewObject.companyType), 'Type of companyType value should be string').toBe("string");
    expect(typeof (this.responseBodyOfAGridViewObject.companyKey), 'Type of companyKey value should be string').toBe("string");
    expect(typeof (this.responseBodyOfAGridViewObject.userId), 'Type of userId value should be string').toBe("string");
    expect(typeof (this.responseBodyOfAGridViewObject.name), 'Type of name value should be string').toBe("string");
    expect(typeof (this.responseBodyOfAGridViewObject.itemType), 'Type of itemType value should be string').toBe("string");
    if (this.responseBodyOfAGridViewObject.gridState.columns.length > 0) {
        expect(typeof (this.responseBodyOfAGridViewObject.gridState.columns), 'Type of columns value should be object').toBe("object");
        const randomColumns = this.responseBodyOfAGridViewObject.gridState.columns[Math.floor(Math.random() * this.responseBodyOfAGridViewObject.gridState.columns.length)];
        if(randomColumns.visible == undefined){
            expect(typeof (randomColumns.visible), 'Type of each visible value should be undefined').toBe("undefined");
        }else{
            expect(typeof (randomColumns.visible), 'Type of each visible value should be boolean').toBe("boolean");
        }
        if(randomColumns.width == undefined){
            expect(typeof (randomColumns.width), 'Type of each width value should be undefined').toBe("undefined");
        }else{
            expect(typeof (randomColumns.width), 'Type of each width value should be string').toBe("string");
        }
        if(randomColumns.name == undefined){
            expect(typeof (randomColumns.name), 'Type of each name value should be undefined').toBe("undefined");
        }else{
            expect(typeof (randomColumns.name), 'Type of each name value should be string').toBe("string");
        }
    }
    expect(typeof (this.responseBodyOfAGridViewObject.gridState.scrollFocus), 'Type of scrollFocus value should be object').toBe("object");
    expect(typeof (this.responseBodyOfAGridViewObject.gridState.selection), 'Type of selection value should be object').toBe("object");
    expect(typeof (this.responseBodyOfAGridViewObject.gridState.grouping), 'Type of grouping value should be object').toBe("object");
    expect(typeof (this.responseBodyOfAGridViewObject.gridState.treeView), 'Type of treeView value should be object').toBe("object");
    expect(typeof (this.responseBodyOfAGridViewObject.gridState.pagination.paginationCurrentPage), 'Type of paginationCurrentPage value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAGridViewObject.gridState.pagination.paginationPageSize), 'Type of paginationPageSize value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAGridViewObject.gridState.filter), 'Type of filter value should be object').toBe("object");
    expect(typeof (this.responseBodyOfAGridViewObject.gridState.sort), 'Type of sort value should be object').toBe("object");
    if (this.responseBodyOfAGridViewObject.gridState.sort.length > 1) {
        expect(typeof (this.responseBodyOfAGridViewObject.gridState.sort[0].dir), 'Type of dir value should be string').toBe("string");
        expect(typeof (this.responseBodyOfAGridViewObject.gridState.sort[0].field), 'Type of field value should be string').toBe("string");
    }
    expect(Date.parse(this.responseBodyOfAGridViewObject.created_at), 'created_at in response should be date').not.toBeNull();
    expect(Date.parse(this.responseBodyOfAGridViewObject.updated_at), 'updated_at in response should be date').not.toBeNull();
    expect(typeof (this.responseBodyOfAGridViewObject.key), 'Type of key value should be string').toBe("string");
})
    
