import { APIRequestContext } from '@playwright/test';
import logger from '../../Logger/logger';
import csv from 'csvtojson';
import _, { endsWith } from "lodash";

// POST endpoint for export item
async function exportItem(request: APIRequestContext, linkApi: string, headers: any, payLoad: any, fields: any, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send POST request ${url} and fields ${fields}`);
    const exportResponse = await request.post(url, {
        headers: headers,
        data: payLoad,
        params: {
            "fields": fields,
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
      console.log("convertJsonActual: ", convertJsonActual);

    console.log("Actual number total just download: ", convertJsonActual.length);
    return convertJsonActual;
}

async function filterItemThatHasPicked(file: any, containText: string) {
  var itemsInArray = await totalItemFromExportFile(file);
  var lengthOfFile = itemsInArray.length;
  for(let i = 0; i < lengthOfFile; i++) {
    const name = itemsInArray[i]["Item Name"] || itemsInArray[i]["Supplier Name"] || itemsInArray[i]["Parent Name"];
    if(name === containText) {
      return itemsInArray[i];
    }
  }
}

async function addFieldsIntoArray(fields: string) {
  let addFieldsIntoArray = fields.split(',');
  return addFieldsIntoArray;
}

async function mapColumn(columnName: string, section: string, companyType: string) {
  console.log("columnName>>>>", columnName);
  if(section === "supplier" && columnName === "name") {
    return Columns.supplierName;
  }

  if(companyType === "ASC" && columnName === "name") {
    return Columns.asinSKU;
  }

  if(section === "supply" && columnName === "orderQty") {
    return Columns.orderQtySupply;
  }

  if(section === "supply" && columnName === "openQty") {
    return Columns.openQtySupply;
  }

  return Columns[columnName];
};

export {
    exportItem,
    totalItemFromExportFile,
    filterItemThatHasPicked,
    addFieldsIntoArray,
    mapColumn,
}

export const Columns: Record<string, string> = {
  key: "Item Key",
  asinSKU: "ASIN-SKU",
  name: "Item Name",
  supplierName: "Supplier Name",
  vendorKey: "Supplier Key",
  vendorName: "Supplier Name",
  vendorPrice: "Supplier Price",
  moq: "MOQ",
  serviceLevel: "Service Level",
  onHand: "On Hand Qty",
  onHandFBA: "On Hand FBA Qty",
  onHandThirdParty: "Warehouse Qty",
  orderInterval: "Order Interval",
  leadTime: "Lead Time",
  supplierKey: "Supplier Key",
  averageHistoryLength: "Average Item History Length",
  itemName: "Item Name",
  dueDate: "Date of Sale",
  orderQty: "Sales Order Qty",
  openQty: "Open Sales Order Qty",
  refNum: "Ref Num",
  fnsku: "FNSKU",
  asin: "ASIN",
  orderQtySupply: "Order Qty",
  openQtySupply: "Open Qty",
  parentName: "Parent Name",
  childName: "Component Name",
  qty: "Kit Qty",
}
