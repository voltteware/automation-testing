import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as subscriptionRequest from '../../../../src/api/request/subscriptions.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";
import { faker } from '@faker-js/faker';
import { gridViewPayLoadCustomItems } from '../../../../src/utils/gridViewPayLoad';

let getCurrentSubscriptionWithPaymentMethodLink: any;
let getCurrentPlanOfSubscriptionLink: any;
let getPlansLink: any;
let switchPlanLink: any;
let changePlanPayload: any;
var plansAfterFiltering = new Array();
var intervalPlans = new Array();
var monthlyPlanAfterFiltering = new Array();

Then('{} sets GET api endpoint to get current subscription with payment method', async function (actor) {
    getCurrentSubscriptionWithPaymentMethodLink = encodeURI(`${Links.API_SUBSCRIPTION}`);
});

Then('{} sets GET api endpoint to get current plan of subscription', async function (actor) {
    getCurrentPlanOfSubscriptionLink = encodeURI(`${Links.API_PAYMENT_METHOD}`);
});

Then('{} sets GET api endpoint to get all plans of system', async function (actor) {
    getPlansLink = encodeURI(`${Links.API_PLANS}`);
});

Then(`{} sets request body with payload to upgrade and downgrade`, async function (actor) {
    changePlanPayload = {
        "priceId": this.planPickedRandom.id,
        "subscriptionId": this.subscriptionId,
        "isRevert": false,  
    }
})

Then(`{} picks company that has status {} and has been added card`, async function(actor, status: string) {
    console.log("Get all company: ", this.getCompaniesResponseBody);
    for(let i = 0; i < this.getCompaniesResponseBody.length; i++) {
        if(this.getCompaniesResponseBody[i].subscriptionStatus === status) {
            this.getCompanyKey = this.getCompaniesResponseBody[i].companyKey;
            this.getCompanyType = this.getCompaniesResponseBody[i].companyType;
            this.attach(`Get company key will push into URL of api/billing/subscription: ` + this.getCompanyKey);
            console.log(`Get company key will push into URL of api/billing/subscription: `, this.getCompanyKey);

            this.currentSubscriptionResponse = await subscriptionRequest.getCurrentSubscription(this.request, getCurrentSubscriptionWithPaymentMethodLink, this.headers, this.getCompanyKey);
            this.currentSubscriptionResponseBody = JSON.parse(await this.currentSubscriptionResponse.text());
            console.log("currentSubscriptionResponseBody >>>>> ", this.currentSubscriptionResponseBody);
            this.defaultMethod = await this.currentSubscriptionResponseBody.default_payment_method;
            console.log("defaultMethod >>>>> ", this.defaultMethod);

            if(this.defaultMethod !== null) {
                this.currentPlan = this.currentSubscriptionResponseBody.id;
                this.priceOfCurrentPlan = this.currentSubscriptionResponseBody.plan.id;
                this.subscriptionId = this.currentSubscriptionResponseBody.id;
                this.customer = this.currentSubscriptionResponseBody.customer;
                this.companyKey = this.currentSubscriptionResponseBody.metadata.companyKey;
                this.companyType = this.currentSubscriptionResponseBody.metadata.companyType;
                console.log("subscriptionId >>>>> ", this.subscriptionId, "currentSubscriptionResponseBody.default_payment_method >>>>> ", this.currentSubscriptionResponseBody.default_payment_method);
                this.attach(`Current Subscription >>>>>> ` + this.currentSubscriptionResponseBody, `priceOfCurrentPlan of current plan >>>>> ` + this.priceOfCurrentPlan);
                console.log(`Current Subscription >>>>>> `, this.currentSubscriptionResponseBody, `priceOfCurrentPlan of current plan >>>>> `, this.priceOfCurrentPlan);
            }
        }
    }
});

Then(`{} picks company that has interval {}, status {} and has been added card`, async function(actor, interval: string, status: string) {
    console.log("Get all company: ", this.getCompaniesResponseBody);
    for(let i = 0; i < this.getCompaniesResponseBody.length; i++) {
        if(this.getCompaniesResponseBody[i].subscriptionStatus === status) {
            this.getCompanyKey = this.getCompaniesResponseBody[i].companyKey;
            this.attach(`Get company key will push into URL of api/billing/subscription: ` + this.getCompanyKey);
            console.log(`Get company key will push into URL of api/billing/subscription: `, this.getCompanyKey);

            this.currentSubscriptionResponse = await subscriptionRequest.getCurrentSubscription(this.request, getCurrentSubscriptionWithPaymentMethodLink, this.headers, this.getCompanyKey);
            this.currentSubscriptionResponseBody = JSON.parse(await this.currentSubscriptionResponse.text());
            console.log("currentSubscriptionResponseBody >>>>> ", this.currentSubscriptionResponseBody);
            this.intervalFromAPI = await this.currentSubscriptionResponseBody.plan.interval;
            console.log("intervalFromAPI >>>>> ", this.intervalFromAPI);

            if(this.intervalFromAPI === interval) {
                this.currentPlan = this.currentSubscriptionResponseBody.id;
                this.priceOfCurrentPlan = this.currentSubscriptionResponseBody.plan.id;
                this.subscriptionId = this.currentSubscriptionResponseBody.id;
                this.customer = this.currentSubscriptionResponseBody.customer;
                this.companyKey = this.currentSubscriptionResponseBody.metadata.companyKey;
                this.companyType = this.currentSubscriptionResponseBody.metadata.companyType;
                console.log("subscriptionId >>>>> ", this.subscriptionId, "currentSubscriptionResponseBody.default_payment_method >>>>> ", this.currentSubscriptionResponseBody.default_payment_method);
                this.attach(`Current Subscription >>>>>> ` + this.currentSubscriptionResponseBody, `priceOfCurrentPlan of current plan >>>>> ` + this.priceOfCurrentPlan);
                console.log(`Current Subscription >>>>>> `, this.currentSubscriptionResponseBody, `priceOfCurrentPlan of current plan >>>>> `, this.priceOfCurrentPlan);
            }
        }
    }
});

Then('{} sends GET api endpoint to get current plan of subscription', async function (actor) {
    this.currentPlanOfSubscriptionResponse = await subscriptionRequest.getCurrentPlanOfSubscription(this.request, getCurrentPlanOfSubscriptionLink, this.headers, this.customer);

    const responseBodyText = await this.currentPlanOfSubscriptionResponse.text();
    if (this.currentPlanOfSubscriptionResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.currentPlanOfSubscriptionResponseBody = JSON.parse(await this.currentPlanOfSubscriptionResponse.text());
        this.currentPlan = this.currentPlanOfSubscriptionResponseBody[0].id;
        console.log("Current Plan of Subscription >>>>> ", this.currentPlan);
        logger.log('info', `Response GET current plan ${getCurrentPlanOfSubscriptionLink}` + JSON.stringify(this.currentPlanOfSubscriptionResponseBody, undefined, 4));
        this.attach(`Response GET current plan ${getCurrentPlanOfSubscriptionLink}` + JSON.stringify(this.currentPlanOfSubscriptionResponseBody, undefined, 4))
    }
    else if (responseBodyText.includes('<!doctype html>')) {
        logger.log('info', `Response GET current plan ${getCurrentPlanOfSubscriptionLink} ${responseBodyText}`);
        this.attach(`Response GET current plan ${getCurrentPlanOfSubscriptionLink} returns html`)
    }
});

Then('{} sends GET api endpoint to get all plans of system', async function (actor) {
    this.getPlansResponse = await subscriptionRequest.getPlans(this.request, getPlansLink, this.headers);

    const responseBodyText = await this.getPlansResponse.text();
    if (this.getPlansResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getPlansResponseBody = JSON.parse(await this.getPlansResponse.text());
        this.getPlansListResponseBody = Object.values(this.getPlansResponseBody)[0];
        logger.log('info', `Response GET get plans ${getPlansLink}` + JSON.stringify(this.getPlansListResponseBody, undefined, 4));
        this.attach(`Response GET get plans ${getPlansLink}` + JSON.stringify(this.getPlansListResponseBody, undefined, 4))
    }
    else if (responseBodyText.includes('<!doctype html>')) {
        logger.log('info', `Response GET get plans ${getPlansLink} ${responseBodyText}`);
        this.attach(`Response GET get plans ${getPlansLink} returns html`)
    }
});

Then(`{} picks random plan except current plan to upgrade or downgrade`, async function (actor) {
    console.log(`priceOfCurrentPlan >>>>> `, this.priceOfCurrentPlan);
    for(let i = 0; i < this.getPlansListResponseBody.length; i++) {
        if (this.priceOfCurrentPlan.split('_', 1)[0] === "price" && this.getPlansListResponseBody[i].id !== this.priceOfCurrentPlan && this.getPlansListResponseBody[i].allowOrders !== null) {
            plansAfterFiltering.push(this.getPlansListResponseBody[i]);
            console.log(`New priceOfCurrentPlan >>>>> `, this.priceOfCurrentPlan);
            console.log("New this.getPlansListResponseBody[i].allowOrders >>>>> ", this.getPlansListResponseBody[i].allowOrders)
        }
        else if(this.priceOfCurrentPlan.split('_', 1)[0] !== "price" && this.getPlansListResponseBody[i].id !== this.priceOfCurrentPlan && this.getPlansListResponseBody[i].allowOrders === null) {
            plansAfterFiltering.push(this.getPlansListResponseBody[i]);
            console.log(`Old priceOfCurrentPlan >>>>> `, this.priceOfCurrentPlan);
            console.log("Old this.getPlansListResponseBody[i].allowOrders >>>>> ", this.getPlansListResponseBody[i].allowOrders)
        }
    }

    console.log("plans.toString() >>>>> ", plansAfterFiltering.length);
    this.planPickedRandom = await plansAfterFiltering[Math.floor(Math.random() * plansAfterFiltering.length)];
    console.log("Plan that have picked random >>>>> ", this.planPickedRandom);
    return this.planPickedRandom;
});

Then(`{} sets POST api endpoint to upgrade and downgrade`, async function (actor) {
    switchPlanLink = encodeURI(`${Links.API_SWITCH_PLAN}`);
});

Then(`{} sends POST api endpoint to upgrade and downgrade`, async function (actor) {
    console.log("Subscription id >>>>> ", this.subscriptionId, this.planPickedRandom.id);

    this.headers = {
        'Cookie': this.cookie,
        "COMPANY-KEY": this.companyKey,
        "COMPANY-TYPE": this.companyType
    }
    console.log("Headers >>>>> ", this.headers);

    this.switchPlanResponse = await subscriptionRequest.switchPlan(this.request, switchPlanLink, this.headers, changePlanPayload, this.planPickedRandom.id);

    const responseBodyText = await this.switchPlanResponse.text();
    if (this.switchPlanResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.switchPlanResponseBody = JSON.parse(await this.switchPlanResponse.text());
        this.messageActual = this.switchPlanResponseBody.message;
        this.messError = this.switchPlanResponseBody.err;
        console.log("messageActual >>>>> ", this.messageActual);
        logger.log('info', `Response GET current plan ${switchPlanLink}` + JSON.stringify(this.switchPlanResponseBody, undefined, 4));
        this.attach(`Response GET current plan ${switchPlanLink}` + JSON.stringify(this.switchPlanResponseBody, undefined, 4))
    }
    else if (responseBodyText.includes('<!doctype html>')) {
        logger.log('info', `Response GET current plan ${switchPlanLink} ${responseBodyText}`);
        this.attach(`Response GET current plan ${switchPlanLink} returns html`)
    }
});

Then(`{} filters {} plans from list above`, async function (actor, interval: string) {
    console.log(`priceOfCurrentPlan >>>>> `, this.priceOfCurrentPlan, "interval >>>>> ", interval);

    for(let i = 0; i < this.getPlansListResponseBody.length; i++) {
        // Filtering monthly/yearly plans from list above
        if(this.getPlansListResponseBody[i].interval === interval) {
            intervalPlans.push(this.getPlansListResponseBody[i]);
            console.log("intervalPlans >>>>> ", intervalPlans);
            console.log("intervalPlans >>>>> ", intervalPlans.length);
            console.log("this.priceOfCurrentPlan.split('_', 1)[0] >>>>> ", this.priceOfCurrentPlan.split('_', 1)[0]);
        }
    }
})

Then(`{} picks random {} plan except current plan to upgrade or downgrade`, async function (actor, interval: string) {
    console.log(`priceOfCurrentPlan >>>>> `, this.priceOfCurrentPlan, "intervalPlans >>>>> ", intervalPlans, intervalPlans.length);

    for(let i = 0; i < intervalPlans.length; i++) {
        console.log(`priceOfCurrentPlan: `, this.priceOfCurrentPlan, "intervalPlans: ", intervalPlans, intervalPlans.length);
        if (this.priceOfCurrentPlan.split('_', 1)[0] === "price" && intervalPlans[i].id !== this.priceOfCurrentPlan && intervalPlans[i].allowOrders !== null) {
            monthlyPlanAfterFiltering.push(intervalPlans[i]);
            console.log(`New priceOfCurrentPlan >>>>> `, this.priceOfCurrentPlan);
            console.log("New this.intervalPlans[i].allowOrders >>>>> ", intervalPlans[i].allowOrders)
        }
        else if(this.priceOfCurrentPlan.split('_', 1)[0] !== "price" && intervalPlans[i].id !== this.priceOfCurrentPlan && intervalPlans[i].allowOrders === null) {
            monthlyPlanAfterFiltering.push(intervalPlans[i]);
            console.log(`Old priceOfCurrentPlan >>>>> `, this.priceOfCurrentPlan);
            console.log("Old this.intervalPlans[i].allowOrders >>>>> ", intervalPlans[i].allowOrders)
        }
    }

    console.log("plans.toString() >>>>> ", monthlyPlanAfterFiltering.length);
    this.planPickedRandom = await monthlyPlanAfterFiltering[Math.floor(Math.random() * monthlyPlanAfterFiltering.length)];
    console.log("Plan that have picked random >>>>> ", this.planPickedRandom);
    return this.planPickedRandom;
})

Then('{} sends GET api endpoint to get current subscription with payment method', async function (actor) {
    this.headers = {
        'Cookie': this.cookie,
        "COMPANY-KEY": this.companyKey,
        "COMPANY-TYPE": this.companyType
    }
    console.log("Headers >>>>> ", this.headers);

    this.subscriptionAfterChangingResponse = await subscriptionRequest.getCurrentSubscription(this.request, getCurrentSubscriptionWithPaymentMethodLink, this.headers, this.companyKey)

    const responseBodyText = await this.subscriptionAfterChangingResponse.text();
    if (this.subscriptionAfterChangingResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.subscriptionAfterChangingResponseBody = JSON.parse(await this.subscriptionAfterChangingResponse.text());
        this.previousPlanId = this.subscriptionAfterChangingResponseBody.metadata.previousPlanId
        this.planAfterSwitching = this.subscriptionAfterChangingResponseBody.plan.id;
        console.log("Plan of Subscription after Changing >>>>> ", this.planAfterSwitching, "previousPlanId >>>>> ", this.previousPlanId);
        logger.log('info', `Response GET current plan ${getCurrentSubscriptionWithPaymentMethodLink}` + JSON.stringify(this.subscriptionAfterChangingResponseBody, undefined, 4));
        this.attach(`Response GET current plan ${getCurrentSubscriptionWithPaymentMethodLink}` + JSON.stringify(this.subscriptionAfterChangingResponseBody, undefined, 4))
    }
    else if (responseBodyText.includes('<!doctype html>')) {
        logger.log('info', `Response GET current plan after changing ${getCurrentSubscriptionWithPaymentMethodLink} ${responseBodyText}`);
        this.attach(`Response GET current plan after changing ${getCurrentSubscriptionWithPaymentMethodLink} returns html`)
    }
});

Then(`{} checks the system response message is {} after switching plans successfully`, async function (actor, message: string) {
    expect(this.messageActual || this.messError).toEqual(message);
});

Then(`{} checks current subscription is subscription that has been chosen to switch`, async function (actor) {
    // Expected: Plan after switching is equal to plan that has been picked random
    expect(this.planAfterSwitching).toEqual(this.planPickedRandom.id);

    // Expected: Plan previous switching is equal to old plan
    expect(this.previousPlanId).toEqual(this.priceOfCurrentPlan);
});

Then(`{} checks current subscription is still kept`, async function (actor) {
    // Expected: Plan after switching isn't equal to plan that has been picked random
    expect(this.planAfterSwitching).not.toEqual(this.planPickedRandom.id);
});
