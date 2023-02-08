import { APIRequestContext } from '@playwright/test';
import logger from '../../Logger/logger';

async function getRealm(request: APIRequestContext, linkApi:string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info',`Send GET request ${url}`);
    return await request.get(url, options);
}

export {
    getRealm
}
