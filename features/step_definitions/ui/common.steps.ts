import { When, Then, Given, DataTable } from '@cucumber/cucumber';
import { expect, Page } from '@playwright/test';
import { HeaderComponent } from '../../../src/pages/components/header.component';
import { format } from 'date-fns'
import { faker } from '@faker-js/faker';
import logger from '../../../src/Logger/logger';
import '../../../src/hooks/setup-ui'

let headerComponent: HeaderComponent;

When('User logouts', async function () {
    headerComponent = new HeaderComponent(this.page);
    await headerComponent.clickUserNameOnTheTopRightCorner();
    await headerComponent.clickLogOut();
    await expect(this.page).toHaveURL(/.*signin/);
});