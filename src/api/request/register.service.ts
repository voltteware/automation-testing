import { APIRequestContext, request } from "@playwright/test";
import logger from '../../Logger/logger';
import { config } from '../../../config'

async function sendPOSTRegisterRequest(url: string, payLoad: any) {
    logger.log('info', `Send POST request ${url} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const registerContext = await request.newContext({
        baseURL: config.BASE_URL,
        ignoreHTTPSErrors: true
    })
    const registerResponse = await registerContext.post(url, {
        data: payLoad,
    });
    console.log('111111', await registerContext.storageState())
    console.log('222222', registerResponse.headersArray())
    console.log('333333', registerResponse.headers())
    return registerResponse
}

export { sendPOSTRegisterRequest }