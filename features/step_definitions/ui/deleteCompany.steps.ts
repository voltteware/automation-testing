import { When, Then, Given, DataTable } from '@cucumber/cucumber';
import { expect, Page } from '@playwright/test';
import { HeaderComponent } from '../../../src/pages/components/header.component';
import { ToastComponent } from '../../../src/pages/components/toast.component';
import { LoginPage } from '../../../src/pages/login.page';
import { DeleteCompany } from '../../../src/pages/deleteCompany.page';
import { format } from 'date-fns'
import { faker } from '@faker-js/faker';
import logger from '../../../src/Logger/logger';
import '../../../src/hooks/setup-ui'

let deleteCompany: DeleteCompany;

Then('User deletes the company that has just created {string}', async function (companyName: string) {
    deleteCompany = new DeleteCompany(this.page);
    await deleteCompany.deleteCompanyThatJustCreated(companyName);
});
