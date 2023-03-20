import { When, Then, Given, DataTable } from '@cucumber/cucumber';
import { expect, Page } from '@playwright/test';
import { HeaderComponent } from '../../../src/pages/components/header.component';
import { ToastComponent } from '../../../src/pages/components/toast.component';
import { LoginPage } from '../../../src/pages/login.page';
import { CreateCompanyPage } from '../../../src/pages/createCompany.page';
import { format } from 'date-fns'
import { faker } from '@faker-js/faker';
import logger from '../../../src/Logger/logger';
import '../../../src/hooks/setup-ui'

let loginPage: LoginPage;
let headerComponent: HeaderComponent;
let toastComponent: ToastComponent;
let createCompanyPage: CreateCompanyPage;

When('User logins with valid username and password', { timeout: 10 * 5000 }, async function (dataTable: DataTable) {
    var username: string = dataTable.hashes()[0].username
    var password: string = dataTable.hashes()[0].password
    await loginPage.enterEmail(username)
    await loginPage.enterPassword(password)
    await loginPage.clickButtonSignIn()
});


