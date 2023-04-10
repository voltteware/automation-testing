import { APIRequestContext } from '@playwright/test';
import logger from '../../Logger/logger';

//Run Sync
async function postSync(request: APIRequestContext, linkApi: string, payLoad: any, header?: any) {
    const url = `${linkApi}`;
    logger.log('info', `Send POST request ${url} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const runSyncResponse = await request.post(url, {
        data: payLoad,
        headers: header
    });
    return runSyncResponse;
};

export {
    postSync
}