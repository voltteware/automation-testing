import { APIRequestContext } from '@playwright/test';
import logger from '../../Logger/logger';

// Upload inventory
async function uploadInventory(request: APIRequestContext, linkApi: string, shipmentName: string, fileName: string, cookie: any, companyKey: string, companyType: string) {
    const url = `${linkApi}`;
    var header = {
        Cookie: `${cookie}`,
        'COMPANY-KEY': `${companyKey}`,
        'COMPANY-TYPE': `${companyType}`,
    }
    var payload = {
        shipmentName: `${shipmentName}`,
        fileDetails: {
            fileName: `${fileName}`,
            ileType: "shipmentItem",
            append: false,
            zero: false,
            userId: "",
            isCreateNew: true,
            isInitialUpload: false
        }
    }
    logger.log('info', `Send POST request ${url} with ${JSON.stringify(payload, undefined, 4)}`);
    const response = await request.post(url, {
        data: payload,
        headers: header
    });
    return response;
}

async function updateShipment(request: APIRequestContext, linkApi: string, shipmentName: string, shipmentKey: string, cookie: any, companyKey: string, companyType: string) {
    const url = `${linkApi}`;
    var header = {
        Cookie: `${cookie}`,
        'COMPANY-KEY': `${companyKey}`,
        'COMPANY-TYPE': `${companyType}`,
    }
    var payload = {
        key: `${shipmentKey}`,
        shipmentName: `${shipmentName}`,
        stepProgress: {
            uploadInventory: true
        }
    }
    logger.log('info', `Send POST request ${url} with ${JSON.stringify(payload, undefined, 4)}`);
    const response = await request.put(url, {
        data: payload,
        headers: header
    });
    return response;
}

async function getShipmentDetail(request: APIRequestContext, linkApi: string, shipmentKey: string, cookie: any, companyKey: string, companyType: string) {
    const url =encodeURI(`${linkApi}?offset=0&limit=100&where={"logic":"and","filters":[{"logic":"or","filters":[{"filters":[{"field":"flag","operator":"eq","value":"RED"},{"field":"flag","operator":"eq","value":"YELLOW"},{"field":"flag","operator":"eq","value":"ORANGE"},{"field":"flag","operator":"eq","value":"TEAL"},{"field":"flag","operator":"eq","value":"GREEN"}],"logic":"or"},{"filters":[{"field":"status","operator":"eq","value":"WATCH"}],"logic":"or"}]},{"logic":"and","filters":[]},{"logic":"and","filters":[{"field":"status","operator":"neq","value":"IGNORE"}]},{"logic":"and","filters":[{"field":"status","operator":"neq","value":"INACTIVE"}]}]}&key=${shipmentKey}&type=forecast&restockType=WAREHOUSE`);
    var header = {
        Cookie: `${cookie}`,
        'COMPANY-KEY': `${companyKey}`,
        'COMPANY-TYPE': `${companyType}`,
    }

    const response = await request.get(url, {
        headers: header
    });
    return response;
}

async function getShipmentByKey(request: APIRequestContext, linkApi: string, shipmentKey: string, cookie: any, companyKey: string, companyType: string) {
    const url = `${linkApi}/${shipmentKey}`
    var header = {
        Cookie: `${cookie}`,
        'COMPANY-KEY': `${companyKey}`,
        'COMPANY-TYPE': `${companyType}`,
    }

    const response = await request.get(url, {
        headers: header
    });
    return response;
}

export { uploadInventory, updateShipment, getShipmentDetail, getShipmentByKey }