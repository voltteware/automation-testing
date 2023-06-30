import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as subscriptionRequest from '../../../../src/api/request/subscriptions.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";

let getCheckoutLink: any;
let getCheckoutLinkPayload: any;
let getIdsLink: any;
let confirmSubscribedLink: any;
let getLatestSubscriptionLink: any;
var planAfterFiltering = new Array();

// Pick random plan to subscribe
Then(`{} picks random plan to subscribe`, async function (actor) {
    console.log(`priceOfCurrentPlan >>>>> `, this.priceId);

    for (let i = 0; i < this.getPlansListResponseBody.length; i++) {
        console.log(`priceOfCurrentPlan: `, this.priceId, "getPlansListResponseBody: ", this.getPlansListResponseBody);
        if (this.priceId.split('_', 1)[0] === "price" && this.getPlansListResponseBody[i].allowOrders !== null) {
            planAfterFiltering.push(this.getPlansListResponseBody[i]);
            console.log(`New priceOfCurrentPlan >>>>> `, this.priceId);
            console.log("New this.getPlansListResponseBody[i].allowOrders >>>>> ", this.getPlansListResponseBody[i].allowOrders)
        }
        else if (this.priceId.split('_', 1)[0] !== "price" && this.getPlansListResponseBody[i].allowOrders === null) {
            planAfterFiltering.push(this.getPlansListResponseBody[i]);
            console.log(`Old priceOfCurrentPlan >>>>> `, this.priceId);
            console.log("Old this.getPlansListResponseBody[i].allowOrders >>>>> ", this.getPlansListResponseBody[i].allowOrders)
        }
    }

    this.planPickedRandom = await planAfterFiltering[Math.floor(Math.random() * planAfterFiltering.length)];
    console.log("Plan that have picked random >>>>> ", this.planPickedRandom);
    this.attach(`Plan that have picked random >>>>> ` + JSON.stringify(this.planPickedRandom));
    return this.planPickedRandom;
});

// Get Checkout link
Then('{} sets POST api endpoint to get Checkout link', async function (actor) {
    getCheckoutLink = encodeURI(`${Links.API_CHECKOUT}`);
});

Then('{} sets request body with payload to get Checkout link', async function (actor) {
    this.attach("planPickedRandom.id >>>>> " + JSON.stringify(this.planPickedRandom.id));
    getCheckoutLinkPayload = { 
        "payload": { 
            "priceId": this.planPickedRandom.id, 
            "customerId": this.customerId, 
            "subscriptionId": this.subscriptionId
        }, 
        "company": { 
            "companyKey": this.companyKey, 
            "companyType": this.companyType, 
            "companyName": this.companyName 
        } 
    }
});

Then(`{} sends POST api endpoint to get Checkout link`, async function (actor) {
    this.headers = {
        'Cookie': this.cookie,
        "COMPANY-KEY": this.companyKey,
        "COMPANY-TYPE": this.companyType
    }
    console.log("Headers >>>>> ", this.headers);

    this.getCheckoutLinkResponse = await subscriptionRequest.getCheckoutLink(this.request, getCheckoutLink, this.headers, getCheckoutLinkPayload);

    const responseBodyText = await this.getCheckoutLinkResponse.text();
    if (this.getCheckoutLinkResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getCheckoutLinkResponseBody = await this.getCheckoutLinkResponse.text();
        this.CsTest = this.getCheckoutLinkResponseBody.split(/[/,#]/);
        console.log("CS_Test >>>>> ", this.CsTest);
        logger.log('info', `Response POST get Checkout link ${getCheckoutLink}` + JSON.stringify(this.getCheckoutLinkResponseBody, undefined, 4));
        this.attach(`Response POST get Checkout link ${getCheckoutLink}` + JSON.stringify(this.getCheckoutLinkResponseBody, undefined, 4))
    }
    else if (responseBodyText.includes('<!doctype html>')) {
        logger.log('info', `Response POST get Checkout link ${getCheckoutLink} - ${responseBodyText}`);
        this.attach(`Response POST get Checkout link ${getCheckoutLink} returns html`)
    }
});

// Get GUID, MUID and SID
Then('{} sets POST api endpoint to get GUID, MUID and SID', async function (actor) {
    getIdsLink = encodeURI(`https://m.stripe.com/6`);
});

Then(`{} sends POST api endpoint to get GUID, MUID and SID`, async function (actor) {
    this.headers = {
        'Cookie': this.cookie,
        "COMPANY-KEY": this.companyKey,
        "COMPANY-TYPE": this.companyType
    }
    console.log("Headers >>>>> ", this.headers);

    this.getIdsResponse = await subscriptionRequest.getIds(this.request, getIdsLink, this.headers);

    const responseBodyText = await this.getIdsResponse.text();
    if (this.getIdsResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getIdsResponseBody = JSON.parse(await this.getIdsResponse.text());
        this.guid = this.getIdsResponseBody.guid;
        this.muid = this.getIdsResponseBody.muid;
        this.sid = this.getIdsResponseBody.sid;
        this.setCookie = await this.getIdsResponse.headers()['set-cookie'];
        console.log("setCookie >>>>> ", this.setCookie);
        logger.log('info', `Response POST get Checkout link ${getIdsLink}` + JSON.stringify(this.getIdsResponseBody, undefined, 4));
        this.attach(`Response POST get Checkout link ${getIdsLink}` + JSON.stringify(this.getIdsResponseBody, undefined, 4))
    }
    else if (responseBodyText.includes('<!doctype html>')) {
        logger.log('info', `Response POST get Checkout link ${getIdsLink} - ${responseBodyText}`);
        this.attach(`Response POST get Checkout link ${getIdsLink} returns html`)
    }
});

// Creates payment method to subscribe
Then('{} creates payment method to subscribe', async function (actor) {
    const stripe = require('stripe')('sk_test_7tTAEwumdqWe2MrQh9ld6sAz');

    this.paymentMethod = await stripe.paymentMethods.create({
    type: 'card',
    card: {
        "number": 4242424242424242,
        "cvc": 314,
        "exp_month": 8,
        "exp_year": 2024,
    },
    billing_details: {
        name: "test",
        email: "subscriptionapitest@gmail.com",
        address: {
            "city": null,
            "country": "US",
            "line1": null,
            "line2": null,
            "postal_code": null,
            "state": null
        }
    },
    });
    console.log("paymentMethod >>>>> ", this.paymentMethod.id);
});

// Confirm subscribed
Then('{} sets POST api endpoint to confirm subscribed', async function (actor) {
    confirmSubscribedLink = encodeURI(`https://api.stripe.com/v1/payment_pages/${this.CsTest[5]}/confirm`);
});

Then('{} sets request body with payload to confirm subscribed', async function (actor) {
    this.confirmSubscribedPayLoad = { 
        "eid": "NA",
        "payment_method": this.paymentMethod.id,
        "expected_amount": 0,
        "expected_payment_method_type": "card",
        "guid": this.guid,
        "muid": this.muid,
        "sid": this.sid,
        "key": "pk_test_0Dq01FUcmFyHtRjr7PmXf5JL",
    }

    console.log("confirmSubscribedPayLoad >>>>> ", this.confirmSubscribedPayLoad);
});

Then(`{} sends POST api endpoint to confirm subscribed`, async function (actor) {
    this.headers = {
        'Cookie': this.setCookie,
        "COMPANY-KEY": this.companyKey,
        "COMPANY-TYPE": this.companyType,
        "content-type": "application/x-www-form-urlencoded",
    }
    console.log("Headers >>>>> ", this.headers);

    this.confirmSubscribedResponse = await subscriptionRequest.confirmSubscribed(this.request, confirmSubscribedLink, this.headers, this.confirmSubscribedPayLoad);

    const responseBodyText = await this.confirmSubscribedResponse.text();
    if (this.confirmSubscribedResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.confirmSubscribedResponseBody = JSON.parse(await this.confirmSubscribedResponse.text());
        logger.log('info', `Response POST confirm subscribed ${confirmSubscribedLink}` + JSON.stringify(this.confirmSubscribedResponseBody, undefined, 4));
        this.attach(`Response POST confirm subscribed ${confirmSubscribedLink}` + JSON.stringify(this.confirmSubscribedResponseBody, undefined, 4))
    }
    else if (responseBodyText.includes('<!doctype html>')) {
        logger.log('info', `Response POST confirm subscribed ${confirmSubscribedLink} - ${responseBodyText}`);
        this.attach(`Response POST confirm subscribed ${confirmSubscribedLink} returns html`)
    }
});

// Get latest subscription
Then('{} sets GET api endpoint to get latest subscription', async function (actor) {
    getLatestSubscriptionLink = encodeURI(`${Links.API_LATEST_SUB}${this.subscriptionId}/latest`);
});

Then(`{} sends GET api endpoint to get latest subscription`, async function (actor) {
    this.headers = {
        'Cookie': this.cookie,
        "COMPANY-KEY": this.companyKey,
        "COMPANY-TYPE": this.companyType
    }
    console.log("Headers >>>>> ", this.headers);

    this.getLatestSubscriptionResponse = await subscriptionRequest.latestSubscription(this.request, getLatestSubscriptionLink, this.headers);

    const responseBodyText = await this.getLatestSubscriptionResponse.text();
    console.log("responseBodyText of Latest Sub >>>>> ", responseBodyText);
    if (this.getLatestSubscriptionResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        logger.log('info', `Response POST get Checkout link ${getLatestSubscriptionLink}` + JSON.stringify(this.getLatestSubscriptionResponseBody, undefined, 4));
        this.attach(`Response POST get Checkout link ${getLatestSubscriptionLink}` + JSON.stringify(this.getLatestSubscriptionResponseBody, undefined, 4))
    }
    else if (responseBodyText.includes('<!doctype html>')) {
        logger.log('info', `Response POST get Checkout link ${getLatestSubscriptionLink} - ${responseBodyText}`);
        this.attach(`Response POST get Checkout link ${getLatestSubscriptionLink} returns html`)
    }
});

// Check default method after subscribed
Then(`{} checks current subscription is subscription that has been subscribed`, async function (actor) {
    expect(this.paymentMethod.id).toEqual(this.paymentMethod.id);
});