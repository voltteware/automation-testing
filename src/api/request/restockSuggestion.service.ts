import { APIRequestContext } from '@playwright/test';
import logger from '../../Logger/logger';
import { nullable } from 'zod';

// Get restock suggestion
async function getRestockSuggestion(request: APIRequestContext, linkApi: string, options?: object) {
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}`);
    return await request.get(url, options);
};

// Edit item in Item List
async function editItemInItemList(request: APIRequestContext, linkApi: string, payLoad: any, header?: any) {
    const url = `${linkApi}`;    
    logger.log('info', `Send PUT request ${url} with ${JSON.stringify(payLoad, undefined, 4)}`);
    const editResponse = await request.put(url, {
        data: payLoad,
        headers: header
    });    
    return editResponse;
}

// export {
//     getRestockSuggestion,
//     editItemInItemList
// Count all items in Item List
async function countAllItemsInItemList(request: APIRequestContext, linkApi: string, supplierName: any, headers: any) {
    var countAllItemsInItemListResponse;
    const url = `${linkApi}`;
    logger.log('info', `Send POST request ${url}, Supplier Name >>>> ${supplierName}`);
    if (supplierName === "[My Warehouse]") {
        countAllItemsInItemListResponse = await request.get(url, {
            headers: headers,
            params: {
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
        console.log("countAllItemsInItemListResponse1: ", countAllItemsInItemListResponse.url(), "Total SKUs My warehouse ", countAllItemsInItemListResponse);
        return countAllItemsInItemListResponse;
    }
    if (supplierName === "[All Suppliers]") {
        countAllItemsInItemListResponse = await request.get(url, {
            headers: headers,
            params: {
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
                                "logic": "and",
                                "filters": []
                            }
                        ]
                    }
                )
            }
        });
        console.log("countAllItemsInItemListResponse1: ", countAllItemsInItemListResponse.url(), "Total All Suppliers: ", countAllItemsInItemListResponse);
        return countAllItemsInItemListResponse;
    }
    else {
        countAllItemsInItemListResponse = await request.get(url, {
            headers: headers,
            params: {
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
        console.log("countAllItemsInItemListResponse2: ", countAllItemsInItemListResponse.url(), "Total SKUs >>>>", countAllItemsInItemListResponse);
        return countAllItemsInItemListResponse;
    }
};

// Get list items in Item List
async function getItemListInItemList(request: APIRequestContext, linkApi: string, supplierName: any, headers: any, limitRow: number) {
    var getItemListInItemListResponse;
    const url = `${linkApi}`;
    logger.log('info', `Send GET request ${url}, ${supplierName}`);
    if (supplierName === "[My Warehouse]") {
        getItemListInItemListResponse = await request.get(url, {
            headers: headers,
            params: {
                "offset": 0,
                "limit": limitRow,
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
        console.log("getItemListInItemListResponse1: ", getItemListInItemListResponse.url(), getItemListInItemListResponse);
        logger.log('info', `Send GET request ${supplierName}`);
        return getItemListInItemListResponse;
    }
    if (supplierName === "[All Suppliers]") {
        getItemListInItemListResponse = await request.get(url, {
            headers: headers,
            params: {
                "offset": 0,
                "limit": limitRow,
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
                                "logic": "and",
                                "filters": []
                            }
                        ]
                    }
                )
            }
        });
        console.log("getItemListInItemListResponse1: ", getItemListInItemListResponse.url(), getItemListInItemListResponse);
        logger.log('info', `Send GET request ${supplierName}`);
        return getItemListInItemListResponse;
    }
    else {
        getItemListInItemListResponse = await request.get(url, {
            headers: headers,
            params: {
                "offset": 0,
                "limit": limitRow,
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
                                "logic": "and", "filters": [] 
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
        console.log("getItemListInItemListResponse2: ", getItemListInItemListResponse.url(), getItemListInItemListResponse);
        logger.log('info', `Send GET request ${supplierName}`);
        return getItemListInItemListResponse;
    }
};

export {
    getRestockSuggestion,
    countAllItemsInItemList,
    getItemListInItemList,
    editItemInItemList
}