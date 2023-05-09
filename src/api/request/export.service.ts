import { APIRequestContext } from '@playwright/test';
import logger from '../../Logger/logger';
import csv from 'csvtojson';
import _, { endsWith } from "lodash";

// POST endpoint for export item
async function exportItem(request: APIRequestContext, linkApi: string, headers: any, payLoad: any, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send POST request ${url}`);
    const exportResponse = await request.post(url, {
        headers: headers,
        data: payLoad,
        params: {
            "headersOnly": false,
            "sort": "null",
            "where": JSON.stringify({ "logic": "and", "filters": [] })
        }
    });
    console.log("exportResponse: ", exportResponse.url(), "payload: ", payLoad, "headers: ", headers);
    return exportResponse;
}

async function totalItemFromExportFile(file: any) {
    const convertJsonActual = await csv().fromFile(file) // Convert CSV to JSON with export file
      .then(vendors => {
        return vendors;
      })
      console.log("convertJsonActual: ", convertJsonActual.length);

    console.log("Actual number total just download: ", convertJsonActual.length);
    return convertJsonActual;
}

async function filterItemThatHasPicked(file: any, containText: string) {
  var itemsInArray = await totalItemFromExportFile(file);
  var lengthOfFile = itemsInArray.length;
  for(let i = 0; i < lengthOfFile; i++) {
    const name = itemsInArray[i]["Item Name"];
    if(name === containText) {
      return itemsInArray[i];
    }
  }
}

export {
    exportItem,
    totalItemFromExportFile,
    filterItemThatHasPicked,
}
