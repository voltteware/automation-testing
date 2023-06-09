import { request } from '@playwright/test';
import logger from '../../Logger/logger';

//Update Shipment
async function uploadFileToS3(signedRequest: string, companyKey: string, companyType: string, file_blob: Buffer) {
    const context = await request.newContext();
    
    const uploadFileToS3 = await context.put(signedRequest, {        
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
            'COMPANY-KEY': companyKey,
            'COMPANY-TYPE': companyType,
            'Connection': 'keep-alive',
            'Content-Type': 'text/csv'            
        },
        data: file_blob
    });
    return uploadFileToS3;
};

export {
    uploadFileToS3
}