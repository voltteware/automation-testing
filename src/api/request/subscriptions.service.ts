import { APIRequestContext } from '@playwright/test';
import logger from '../../Logger/logger';

// Get current subscription with payment method
async function getCurrentSubscription(request: APIRequestContext, linkApi: string, headers: any, companyKey: string) {
    const url = `${linkApi}${companyKey}`;
    logger.log('info', `Send GET request ${url}`);
    const exportResponse = await request.get(url, {
      headers: headers,
    });
    console.log("exportResponse get current subscription: ", exportResponse.url(), "headers: ", headers);
    return exportResponse;
}

// Get current plan of subscription 
async function getCurrentPlanOfSubscription(request: APIRequestContext, linkApi: string, headers: any, customerId: string) {
  const url = `${linkApi}${customerId}`;
  logger.log('info', `Send GET request ${url}`);
  const exportResponse = await request.get(url, {
    headers: headers,
  });
  console.log("exportResponse get current plan of subscription: ", exportResponse.url(), "headers: ", headers);
  return exportResponse;
}

// Get all plans 
async function getPlans(request: APIRequestContext, linkApi: string, headers: any) {
  const url = `${linkApi}`;
  logger.log('info', `Send GET request ${url}`);
  const exportResponse = await request.get(url, {
    headers: headers,
  });
  console.log("exportResponse get plans: ", exportResponse.url(), "headers: ", headers);
  return exportResponse;
}

// Switch plan
async function switchPlan(request: APIRequestContext, linkApi: string, headers: any, payload: any, planChanged: string) {
  const url = `${linkApi}${planChanged}`;
  logger.log('info', `Send POST request ${url}`);
  const exportResponse = await request.post(url, {
    headers: headers,
    data: payload,
  });
  console.log("exportResponse switch plan: ", exportResponse.url(), "headers: ", exportResponse.headers(), "Request payload: ", payload,  "plan: ", planChanged);
  return exportResponse;
}

// Get Checkout Link
async function getCheckoutLink(request: APIRequestContext, linkApi: string, headers: any, payload: any) {
  const url = `${linkApi}`;
  logger.log('info', `Send POST request ${url}`);
  const exportResponse = await request.post(url, {
    headers: headers,
    data: payload,
  });
  console.log("exportResponse get checkout link: ", exportResponse.url(), "headers: ", exportResponse.headers(), "Request payload: ", payload);
  return exportResponse;
}

// Get muid/guid/id from stripe
async function getIds(request: APIRequestContext, linkApi: string, headers: any) {
  const url = `${linkApi}`;
  logger.log('info', `Send POST request ${url}`);
  const exportResponse = await request.post(url, {
    headers: headers,
  });
  console.log("exportResponse get guid, muid, sid: ", exportResponse.url(), "headers: ", exportResponse.headers());
  return exportResponse;
}

// Confirm Subscribed
async function addPromotionCodeAndConfirmSubscribed(request: APIRequestContext, linkApi: string, headers: any, payload: any) {
  const url = `${linkApi}`;
  logger.log('info', `Send POST request ${url}`);
  const exportResponse = await request.post(url, {
    headers: headers,
    form: payload,
  });
  console.log("exportResponse confirm subscribed: ", exportResponse, "headers: ", exportResponse.headers());
  return exportResponse;
}

// Get latest Subscription
async function latestSubscription(request: APIRequestContext, linkApi: string, headers: any) {
  const url = `${linkApi}`;
  logger.log('info', `Send POST request ${url}`);
  const exportResponse = await request.get(url, {
    headers: headers,
  });
  console.log("exportResponse Get latest Subscription: ", exportResponse, "headers: ", exportResponse.headers());
  return exportResponse;
}

// Get pending subscription
async function getPendingSubscription(request: APIRequestContext, linkApi: string, headers: any) {
  const url = `${linkApi}`;
  logger.log('info', `Send POST request of pending subscription ${url}`);
  const exportResponse = await request.get(url, {
    headers: headers,
  });
  console.log("exportResponse Get pending Subscription: ", exportResponse, "headers: ", exportResponse.headers());
  return exportResponse;
}

// Cancel the next plan
async function cancelSubscription(request: APIRequestContext, linkApi: string, headers: any, subscriptionId: any) {
  const url = `${linkApi}`;
  logger.log('info', `Send DELETE request ${url}`);
  const exportResponse = await request.delete(url, {
    headers: headers,
    params: {
      nextPlanSubscriptionId: subscriptionId
    }
  });
  console.log("exportResponse cancel subscription: ", exportResponse, "headers: ", exportResponse.headers());
  return exportResponse;
}

export {
    getCurrentSubscription,
    getCurrentPlanOfSubscription,
    getPlans,
    switchPlan,
    getCheckoutLink,
    getIds,
    addPromotionCodeAndConfirmSubscribed,
    latestSubscription,
    getPendingSubscription,
    cancelSubscription
}
