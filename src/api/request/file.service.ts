import { APIRequestContext } from '@playwright/test';
import logger from '../../Logger/logger';

//Get File
async function getFile(request: APIRequestContext, linkApi: string, companyKey:string, fileName:string, osName:string, options?: object) {
    const url = `${linkApi}/${companyKey}?fileName=${fileName}&os=${osName}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
}

export{getFile}