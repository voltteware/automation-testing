import { APIRequestContext } from '@playwright/test';
import logger from '../../Logger/logger';

// Get current subscription with payment method
async function getCurrentSubscription(request: APIRequestContext, linkApi: string, headers: any, companyKey: string) {
    const url = `${linkApi}${companyKey}`;
    logger.log('info', `Send GET request ${url}`);
    const exportResponse = await request.get(url, {
      headers: headers,
    });
    console.log("exportResponse: ", exportResponse.url(), "headers: ", headers);
    return exportResponse;
}

// Get current plan of subscription 
async function getCurrentPlanOfSubscription(request: APIRequestContext, linkApi: string, headers: any, customerId: string) {
  const url = `${linkApi}${customerId}`;
  logger.log('info', `Send GET request ${url}`);
  const exportResponse = await request.get(url, {
    headers: headers,
  });
  console.log("exportResponse: ", exportResponse.url(), "headers: ", headers);
  return exportResponse;
}

// Get all plans 
async function getPlans(request: APIRequestContext, linkApi: string, headers: any) {
  const url = `${linkApi}`;
  logger.log('info', `Send GET request ${url}`);
  const exportResponse = await request.get(url, {
    headers: headers,
  });
  console.log("exportResponse: ", exportResponse.url(), "headers: ", headers);
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
  console.log("exportResponse: ", exportResponse.url(), "headers: ", exportResponse.headers(), "Request payload: ", payload,  "plan: ", planChanged);
  return exportResponse;
}

export {
    getCurrentSubscription,
    getCurrentPlanOfSubscription,
    getPlans,
    switchPlan
}
