import { APIRequestContext, request } from "@playwright/test";
import logger from '../../Logger/logger';
import { config } from '../../../playwright.config'

async function sendPOSTRegisterRequest(url: string, payLoad: any) {
    logger.log('info', `Send POST request ${url} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const registerContext = await request.newContext({
        baseURL: config.BASE_URL,
        ignoreHTTPSErrors: true
    })
    const registerResponse = await registerContext.post(url, {
        data: payLoad,
    });
    return registerResponse
}

export { sendPOSTRegisterRequest }