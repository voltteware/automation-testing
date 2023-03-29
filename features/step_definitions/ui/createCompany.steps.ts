import { When, Then, Given, DataTable } from '@cucumber/cucumber';
import { HeaderComponent } from '../../../src/pages/components/header.component';
import { CreateCompanyPage } from '../../../src/pages/createCompany.page';
import '../../../src/hooks/setup-ui'

let headerComponent: HeaderComponent;
let createCompanyPage: CreateCompanyPage;

When('User creates a new company to test subscription with name {string}', async function (companyName: string) {
    headerComponent = new HeaderComponent(this.page);
    await headerComponent.clickOnAddCompany();
    createCompanyPage = new CreateCompanyPage(this.page);
    await createCompanyPage.createNewCompany(companyName);
});

When('User switchs to {} company that has Canceled subscription', async function (companyName: string) {
    headerComponent = new HeaderComponent(this.page);
    await headerComponent.switchToAnotherCompany(companyName);
});

