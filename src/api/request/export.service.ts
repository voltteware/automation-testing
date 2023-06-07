import { APIRequestContext } from '@playwright/test';
import logger from '../../Logger/logger';
import csv from 'csvtojson';
import _, { endsWith } from "lodash";

let nameInExportFile: any;
let valuesThatHaveFilter: string[] = [];

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

// POST endpoint for export item
async function exportItemWithFilter(request: APIRequestContext, linkApi: string, headers: any, payLoad: any, fields: any, columnName: string, sort: string) {
  const url = `${linkApi}`;
  logger.log('info', `Send POST request ${url} and fields ${fields}`);
  const exportResponse = await request.post(url, {
    headers: headers,
    data: payLoad,
    params: {
      "fields": fields,
      "headersOnly": false,
      "sort": sort,
      "where": JSON.stringify({ 
        "filters": 
        [{ 
          "filters": [{ 
            "field": columnName, 
            "operator": "gt", 
            "value": 100 }], 
            "logic": "and" 
        }], 
        "logic": "and" 
      })
    }
  });
  console.log("exportResponse with filter: ", exportResponse.url(), "payload: ", payLoad, "headers: ", headers);
  return exportResponse;
}

// POST endpoint for export skus in Item list
async function exportSKUInItemList(request: APIRequestContext, linkApi: string, headers: any, payLoad: any, fields: any, params: any, supplierName: any, options?: object) {
  const url = `${linkApi}`;
  let exportRestockSuggestionResponse;
  logger.log('info', `Send POST request ${url} and fields ${fields} and Supplier Name: ${supplierName}`);
  if(supplierName === "[My Warehouse]") {
    exportRestockSuggestionResponse = await request.post(url, {
      headers: headers,
      data: payLoad,
      params: {
          "fields": fields,
          "headersOnly": false,
          "sort": "null",
          "where": JSON.stringify(
            {
                "logic": "and",
                "filters": [
                    {
                        "logic": "or",
                        "filters": [
                            {
                                "filters": [],
                                "logic": "or"
                            },
                            {
                                "filters": [],
                                "logic": "or"
                            }
                        ],
                        "currentSupplierFilters": [
                            {
                                "text": "[My Warehouse]",
                                "value": "[My Warehouse]"
                            }
                        ]
                    },
                    {
                        "logic": "or",
                        "filters": [
                            {
                                "field": "localQty",
                                "operator": "gt",
                                "value": 0
                            },
                            {
                                "field": "localQty",
                                "operator": "gt",
                                "value": 0
                            }
                        ]
                    },
                    {
                        "logic": "and",
                        "filters": []
                    }
                ]
            }
        )
      }
  });
  logger.log("exportResponse of My Warehouse: ", exportRestockSuggestionResponse.url(), "payload: ", payLoad, "headers: ", headers);
  return exportRestockSuggestionResponse;
  }
  if(supplierName === "[All Suppliers]") {
    exportRestockSuggestionResponse = await request.post(url, {
      headers: headers,
      data: payLoad,
      params: {
          "fields": fields,
          "headersOnly": false,
          "sort": "null",
          "where": JSON.stringify(
            {
                "logic": "and",
                "filters": [
                    {
                        "logic": "or",
                        "filters": [
                            {
                                "filters": [],
                                "logic": "or"
                            },
                            {
                                "filters": [],
                                "logic": "or"
                            }
                        ],
                        "currentSupplierFilters": [
                            {
                                "text": "[All Suppliers]",
                                "value": "[All Suppliers]"
                            }
                        ]
                    },
                    {
                        "logic": "and",
                        "filters": []
                    }
                ]
            }
        )
      }
  });
  logger.log("exportResponse of All Suppliers: ", exportRestockSuggestionResponse.url(), "payload: ", payLoad, "headers: ", headers);
  return exportRestockSuggestionResponse;
  }
  else {
    exportRestockSuggestionResponse = await request.post(url, {
      headers: headers,
      data: payLoad,
      params: {
          "fields": fields,
          "headersOnly": false,
          "sort": "null",
          "where": JSON.stringify(
            {
              "logic": "and",
              "filters": [
                  {
                      "logic": "or",
                      "filters": [
                          {
                              "filters": [],
                              "logic": "or"
                          },
                          {
                              "filters": [],
                              "logic": "or"
                          }
                      ],
                      "currentSupplierFilters": [
                          {
                              "text": `${supplierName}`,
                              "value": `${supplierName}`
                          }
                      ]
                  },
                  {
                      "logic": "or",
                      "filters": [
                          {
                              "field": "supplier",
                              "operator": "eq",
                              "value": `${supplierName}`
                          },
                          {
                              "field": "supplier",
                              "operator": "eq",
                              "value": `${supplierName}`
                          }
                      ]
                  },
                  {
                      "logic": "and",
                      "filters": []
                  },
                  {
                      "logic": "or",
                      "filters": [
                          {
                              "field": "localQty",
                              "operator": "eq",
                              "value": 0
                          },
                          {
                              "field": "localQty",
                              "operator": "isnull",
                              "value": null
                          }
                      ]
                  }
              ]
          }
          )
      }
    });
  logger.log("exportResponse: ", exportRestockSuggestionResponse.url(), "payload: ", payLoad, "headers: ", headers);
  return exportRestockSuggestionResponse;
  }
}

// POST endpoint for export sku in Shipment Details
async function exportSKUsInShipmentDetails(request: APIRequestContext, linkApi: string, headers: any, payLoad: any, fields: any, key: string, restockType: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send POST request ${url} and fields ${fields}`);
    const exportResponse = await request.post(url, {
        headers: headers,
        data: payLoad,
        params: {
            "fields": fields,
            "headersOnly": false,
            "sort": "null",
            "restockKey": key,
            "type": "amazon",
            "restockType": restockType,
            "where": JSON.stringify({ "logic": "and", "filters": [] })
        }
    });
    console.log("exportResponse: ", exportResponse.url(), "payload: ", payLoad, "headers: ", headers);
    return exportResponse;
}

// POST endpoint for export data in Purchasing > My Suggested
async function exportItemsInPOByVendor(request: APIRequestContext, linkApi: string, headers: any, payLoad: any, fields: any, vendorKey:any, options?: object) {
  const url = `${linkApi}`;
  logger.log('info', `Send POST request ${url} and fields ${fields} and vendor key: ${vendorKey}`);
  const exportResponse = await request.post(url, {
      headers: headers,
      data: payLoad,
      params: {
          "fields": fields,
          "headersOnly": false,
          "sort": "null",
          "where": JSON.stringify({ "logic": "and", "filters": [] }),
          "vendorKey": vendorKey,
      }
  });
  console.log("export my suggested by vendor: ", exportResponse.url(), "payload: ", payLoad, "headers: ", headers);
  return exportResponse;
}

// POST endpoint for export data in Purchasing > Custom
async function exportItemsInCustom(request: APIRequestContext, linkApi: string, headers: any, payLoad: any, fields: any, options?: object) {
  const url = `${linkApi}`;
  logger.log('info', `Send POST request ${url} and fields ${fields}`);
  const exportResponse = await request.post(url, {
      headers: headers,
      data: payLoad,
      params: {
          "fields": fields,
          "headersOnly": false,
          "sort": "null",
          "where": JSON.stringify({ "logic": "and", "filters": [] }),
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
      // console.log("convertJsonActual: ", convertJsonActual);

    console.log("Total Items in file: ", convertJsonActual.length);
    return convertJsonActual;
}

async function filterRowThatHasPicked(file: any, containText: string, section: string) {
  console.log("Contain Text: ", containText);
  var itemsInArray = await totalItemFromExportFile(file);
  console.log("itemsInArray: >>>> ", itemsInArray)
  var lengthOfFile = itemsInArray.length;
  for(let i = 0; i < lengthOfFile; i++) {
    switch(section) {
      case "supplier":
        nameInExportFile = itemsInArray[i]["Supplier Name"];
        console.log("Service - Supplier Name in File export: ", nameInExportFile);

        if(nameInExportFile === containText) {
          valuesThatHaveFilter = itemsInArray[i];
        }

        break;
      case "bom":
        nameInExportFile = itemsInArray[i]["Parent Name"];

        if(nameInExportFile === containText) {
          valuesThatHaveFilter = itemsInArray[i];
        }

        break;
      case "shipment-details":
        nameInExportFile = itemsInArray[i]["SKU"];

        if(nameInExportFile === containText) {
          valuesThatHaveFilter = itemsInArray[i];
        }

        break;
      case "custom":
        nameInExportFile = itemsInArray[i]["FNSKU"];

        if(nameInExportFile === containText) {
          valuesThatHaveFilter = itemsInArray[i];
        }

        break;
      default: 
        nameInExportFile = itemsInArray[i]["Item Name"];
        console.log("Service - Item Name in File export: ", nameInExportFile);

        if(nameInExportFile === containText) {
          valuesThatHaveFilter = itemsInArray[i];
        }
    }
  }
  console.log("valuesThatHaveFilter: ", valuesThatHaveFilter);
  return valuesThatHaveFilter;
}

async function addFieldsIntoArray(fields: string) {
  let addFieldsIntoArray = fields.split(',');
  return addFieldsIntoArray;
}

async function mapColumn(columnName: string, section: string, companyType: string) {
  console.log("Comapny Type: ", companyType);
  console.log("columnName >>>>", columnName);
  let columnAfterMapping;
  switch(section) {
    case "item":
      if(companyType === "ASC" && columnName === "onHand") {
        columnAfterMapping = "On Hand FBA Qty";
        console.log("On Hand FBA column: ", columnAfterMapping)
      }
      else {
        columnAfterMapping = Columns[columnName];
        console.log("columnAfterMapping item >>>> ", columnAfterMapping)
      }

      break;
    case "supplier":
      if(columnName === "name") {
        columnAfterMapping = Columns.supplierName;
        console.log("columnAfterMapping >>>> ", columnAfterMapping)
      }
      else if(columnName === "leadTime") {
        columnAfterMapping = Columns.leadTime;
        console.log("columnAfterMapping >>>> ", columnAfterMapping)
      }
      else if(columnName === "key") {
        columnAfterMapping = Columns.vendorKey;
        console.log("columnAfterMapping >>>> ", columnAfterMapping)
      }
      else {
        columnAfterMapping = Columns[columnName];
      }

      break;
    case "supply":
      if(columnName === "orderQty") {
        columnAfterMapping = Columns.orderQtySupply;
      }
      else if(columnName === "openQty") {
        columnAfterMapping = Columns.openQtySupply;
      }
      else {
        columnAfterMapping = Columns[columnName];
      }

      break;
    case "restock-suggestion":
      if(columnName === "orderQty") {
        columnAfterMapping = Columns.orderQtyRestock;
      }
      else if(columnName === "supplier") {
        columnAfterMapping = Columns.supplierName;
      }
      else {
        columnAfterMapping = Columns[columnName];
      }

      break;
    case "shipment":
      if(columnName === "status") {
        columnAfterMapping = Columns.shipmentStatus;
      }
      else if(columnName === "key") {
        columnAfterMapping = Columns.shipmentKey;
      }
      else {
        columnAfterMapping = Columns[columnName];
      }

      break;
    case "shipment-detail":
      if(columnName === "packageWeight") {
        columnAfterMapping = Columns.packageWeightSD;
      }
      else if(columnName === "receivedQty") {
        columnAfterMapping = Columns.receivedQtySD;
      }
      else if(columnName === "localQty") {
        columnAfterMapping = Columns.localQtySD;
      }
      else {
        columnAfterMapping = Columns[columnName];
      }

      break;
    case "custom":
      if(columnName === "description") {
        columnAfterMapping = Columns.descriptionPO;
      }
      else if(companyType === "ASC" && columnName === "onHand") {
        console.log("Here >>>>>>>>> ", companyType, " >>>>> ", columnName)
        columnAfterMapping = Columns.onHandFBAPo;
      }
      else {
        columnAfterMapping = Columns[columnName];
      }

      break;
    default: 
      columnAfterMapping = Columns[columnName];
  }

  console.log("columnAfterMapping here: ", columnAfterMapping)
  return columnAfterMapping;
};

export {
    exportItem,
    totalItemFromExportFile,
    filterRowThatHasPicked,
    addFieldsIntoArray,
    mapColumn,
    exportSKUInItemList,
    exportSKUsInShipmentDetails,
    exportItemsInPOByVendor,
    exportItemsInCustom,
    exportItemWithFilter
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
  onHandFBAPo: "On Hand FBA Qty",
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
  parentKey: "Parent Key",
  parentName: "Parent Name",
  childName: "Component Name",
  qty: "Kit Qty",
  flag: "Flag",
  status: "Status",
  sku: "Item Name",
  productName: "Product Name",
  tags: "Tags",
  doNotRestock: "Do Not Restock",
  prepGuide: "Amazon Prep Guide",
  skuNotes: "SKU Notes",
  prepNotes: "Prep Notes",
  supplierSku: "Supplier SKU",
  supplierCost: "Supplier Cost",
  supplierRebate: "Supplier Rebate",
  inboundShippingCost: "Inbound Shipping Cost",
  reshippingCost: "Reshipping Cost",
  repackagingMaterialCost: "Repackaging Material Cost",
  repackingLaborCost: "Repackaging Labor Cost",
  restockModel: "FBA Replenishment Model",
  upc: "UPC",
  ean: "EAN",
  fba: "FBA",
  lowestFba: "Lowest FBA",
  nonFba: "Non FBA",
  lowestNonFba: "Lowest Non FBA",
  packageWeight: "Package Weight (lbs)",
  dimensionalWeight: "Dimensional Weight (lbs)",
  casePackQuantity: "Case Pack Qty",
  hazmat: "Hazmat",
  oversized: "Oversized",
  s2d: "2 Days Units Shipped",
  s7d: "7 Days Units Shipped",
  s14d: "14 Days Units Shipped",
  s30d: "30 Days Units Shipped",
  s60d: "60 Days Units Shipped",
  s90d: "90 Days Units Shipped",
  s180d: "180 Days Units Shipped",
  average7DayPrice: "AVG 7D Price",
  listPrice: "List Price",
  newBuyBox: "New buy box",
  estimatedMargin: "EM",
  estimatedMarginPercentage: "EM %",
  estimatedMarkupPercentage: "Markup %",
  qoh: "On Hand FBA Qty",
  inbound: "Inbound",
  inboundFcTransfer: "FC Transfer",
  sum: "Sum",
  shipmentKey: "Key",
  inboundWorking: "Inbound Working",
  inboundShipped: "Inbound Shipped",
  inboundReceiving: "Inbound Receiving",
  inboundTotal: "Inbound Total",
  targetDays: "Target Days",
  remaining: "Remaining Days at Amazon",
  demand: "Demand",
  outOfStockPercentage: "Out Of Stock %",
  reserved: "Reserved",
  unfulfillable: "Unfulfillable",
  pending: "Pending",
  localQty: "Warehouse Qty",
  maximumShipmentQty: "Maximum Shipment Qty",
  suggShip: "Sugg Ship",
  suggReorder: "Sugg Reorder",
  onOrder: "On Order",
  restockNeeded: "Restock Needed",
  category: "Category",
  rank: "Rank",
  referralFee: "Referral Fee",
  fbaFee: "FBA Fees",
  forecastRecommendedQty: "Forecast Recommended Qty",
  recommendedSupplierQty: "Supplier Restock Recommendation",
  recommendedWarehouseQty: "Warehouse Restock Recommendation",
  orderQtyRestock: "Order Quantity",
  shipmentId: "Shipment ID",
  shipmentName: "Shipment Name",
  shipmentSource: "Source",
  destinationFulfillmentCenterId: "Destination",
  shipmentStatus: "Status",
  requestedQty: "Requested",
  receivedQty: "Received",
  totalCost: "Total Cost",
  localQtySD: "Warehouse Quantity",
  restockType: "Restock Type",
  orderNotes: "Order Notes",
  description: "Product Name",
  packageWeightSD: "Weight",
  cost: "Cost",
  caseQty: "Case Pack Quantity",
  shipmentQty: "Shipment Quantity",
  receivedQtySD: "Quantity Received",
  notes: "Notes",
  descriptionPO: "Description",
  onNewPo: "On New PO",
  recommendedQty: "Recommended Qty",
  purchaseQty: "Purchase Qty",
  total: "Total",
  snapshotQty: "Snapshot Qty",
  openPurchaseOrders: "Existing PO Qty",
  openSalesOrders: "Open Sales Orders"
}
