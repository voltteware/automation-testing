import { APIRequestContext } from '@playwright/test';
import logger from '../../Logger/logger';

//Run forecast
async function postForecast(request: APIRequestContext, linkApi: string, payLoad: any, header?: any) {
    const url = `${linkApi}`;
    logger.log('info', `Send POST request ${url} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const runForecastResponse = await request.post(url, {
        data: payLoad,
        headers: header
    });
    return runForecastResponse;
}

export {
    postForecast
}