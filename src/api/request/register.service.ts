import { APIRequestContext, Browser } from "@playwright/test";
import logger from '../../Logger/logger';
async function sendPOSTRegisterRequest(request: APIRequestContext, url: string, payLoad: any) {
    logger.log('info', `Send POST request ${url} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const registerResponse = await request.post(url, {
        data: payLoad,
    });
    return registerResponse
}

export { sendPOSTRegisterRequest }