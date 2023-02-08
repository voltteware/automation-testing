import { APIRequestContext, Browser } from "@playwright/test";
import logger from '../../Logger/logger';
async function sendPOSTAuthenticatieRequest(request: APIRequestContext, url: string, payLoad: any) {
    logger.log('info', `Send POST request ${url} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const authenticateResponse = await request.post(url, {
        data: payLoad,
    });
    return authenticateResponse
}

export { sendPOSTAuthenticatieRequest }