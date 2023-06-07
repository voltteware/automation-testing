@test-api @api-dashboard @api-exportData
Feature: API_Dashboard PUT /api/sync/item/download?<fields>
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                    | password  |
            | admin | exportdatatest@gmail.com    | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies
        Then User picks random company which has onboarded in above response
        And User sets GET api endpoint to get information of a company belongs to themself using company key random
        And User sets valid cookie of themself and valid companyKey and valid companyType in the header
    
    # Manage Company > Items
    @TC_Export001 @smoke-test-api @regression-api 
    Scenario Outline: <TC_ID> - Verify user <email> could call API export <section>
        # Create new item with contain text "Auto"
        Given User sets POST api endpoint to create item
        And User sets request body with payload as name: "<itemName>" and description: "<description>" and vendorName: "" and vendorPrice: "<vendorPrice>" and moq: "<moq>" and leadTime: "<leadTime>" and orderInterval: "<orderInterval>" and serviceLevel: "<serviceLevel>" and onHand: "<onHand>" and onHandMin: "<onHandMin>" and onHandThirdParty: "<onHandThirdParty>" and onHandThirdPartyMin: "<onHandThirdPartyMin>" and lotMultipleQty: "<lotMultipleQty>" and lotMultipleItemName: "" and asin: "" and fnsku: "" and skuNotes: "" and prepNotes: "" and supplierRebate: "" and inboundShippingCost: "" and reshippingCost: "" and repackagingMaterialCost: "" and repackingLaborCost: "" and rank: "" and inventorySourcePreference: "" and average7DayPrice: "" and isFbm: "" and key: "" and vendorKey: "" and lotMultipleItemKey: ""
        And User sends a POST method to create item
        And User set GET api endpoint to get items with name contains "<containText>"
        And User sends a GET request to get list items
        And User picks a random item in above list items
        And User saves the item key
        # Export Items
        And User sets POST api endpoint to export <section> with <columns>
        And User sets payload as name: "<removedItemKeys>"
        When User sends POST api endpoint to export <section>
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Count item that is Hidden
        And User set GET api endpoint to count item that is hidden
        And User sends GET api endpoint to count item that is hidden
        # Count item that is Active
        And User sends GET api request to get all items
        # Check total items in export file = total item that is hidden + item that is active
        And User checks total items in export file EQUALS total <section>
        # Pick random item to check value in export file and in grid
        And User set GET api endpoint to get items with name contains "<containText>"
        And User sends a GET request to get list items
        And User picks <quantity> random items in above list items
        And User checks values of item that just picked the same as export file
        # Hide item after created
        And User sets PUT api endpoint to edit isHidden of the above item for company type <companyType> with new value: true
        And User sends a PUT request to edit the item
        Examples:
            | TC_ID        | companyType | email                      | section | quantity | containText | expectedStatus | expectedStatusText | removedItemKeys | itemName      | description     | vendorPrice | moq    | leadTime | orderInterval | serviceLevel | onHand | onHandMin | onHandThirdParty | onHandThirdPartyMin | lotMultipleQty | columns                                                               |
            | TC_Export001 | ASC         | exportdatatest@gmail.com   | item    | 3        | Auto        | 200            | OK                 |                 | New Item Auto | New description | random      | random | random   | random        | random       | random | random    | random           | random              | random         | name,vendorName,vendorPrice,moq,serviceLevel,onHand,onHandThirdParty  |

    # Manage Company > Suppliers
    @TC_Export002 @smoke-test-api @regression-api 
    Scenario Outline: <TC_ID> - Verify user <email> could call API export <section>
        # Create new supplier with contain text "Auto"
        Given User sets GET api endpoint to get suppliers with limit row: <limitRow>
        And User sends a GET request to get list suppliers
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User checks "<supplierKeyWord>" supplier exist in the system, if it does not exist will create new supplier
        # Export Items
        And User sets POST api endpoint to export <section> with <columns>
        And User sets payload as name: "<removedItemKeys>"
        When User sends POST api endpoint to export <section>
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Count all suppliers
        And User sends a GET request to get total of suppliers
        # Check total items in export file = total suppliers in the grid
        And User checks total items in export file EQUALS total <section>
        # Pick random item to check value in export file and in grid
        And User sets GET api endpoint to get suppliers with limit row: <limitRow>
        And User sends a GET request to get list suppliers
        And User picks <quantity> random suppliers in above list suppliers
        And User checks values of <section> that just picked the same as export file
        # Delete supplier that just created
        And User filters <numberOfSuppliers> suppliers which has the name includes <supplierNameKeyword>
        And User checks there is at least 1 supplier found
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        When User sends a DELETE method to delete supplier
        Examples:
            | TC_ID        | companyType | email                    | section   | supplierNameKeyword | numberOfSuppliers | quantity | limitRow | containText | expectedStatus | expectedStatusText | removedItemKeys | supplierName      | description     | emailSupplier       | moq    | leadTime | orderInterval | serviceLevel | columns                                          |
            | TC_Export002 | CSV         | exportdatatest@gmail.com | supplier  | Auto                | 1                 | 3        | 10       | Auto        | 200            | OK                 |                 | New Supplier Auto | New description | emailtest@gmail.com | random | random   | random        | random       | name,leadTime,orderInterval,averageHistoryLength |

    # Manage Company > Demand
    @TC_Export003 @smoke-test-api @regression-api
    Scenario Outline: <TC_ID> - Verify user <email> could call API export <section>
        # Create new supplier with contain text "Auto"
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets GET api endpoint to get demands with limit row: <limitRow>
        And User sends a GET request to get list demands
        And User checks any demand exist in the system, if it does not exist will create new demand
        # Export Items
        And User sets POST api endpoint to export <section> with <columns>
        And User sets payload as name: "<removedItemKeys>"
        When User sends POST api endpoint to export <section>
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Count all suppliers
        And User sends a GET request to get total of demands
        # Check total items in export file = total suppliers in the grid
        And User checks total items in export file EQUALS total <section>
        # Pick random item to check value in export file and in grid
        And User sets GET api endpoint to get demands with limit row: <limitRow>
        And User sends a GET request to get list demands
        And User picks <quantity> random demands in above list demands
        And User checks values of <section> that just picked the same as export file
        Examples:
            | TC_ID        | companyType | email                    | section | quantity | limitRow | containText | expectedStatus | expectedStatusText | removedItemKeys | supplierName      | description     | emailSupplier       | moq    | leadTime | orderInterval | serviceLevel | columns                          |
            | TC_Export003 | CSV         | exportdatatest@gmail.com | demand  | 3        | 10       | Auto        | 200            | OK                 |                 | New Supplier Auto | New description | emailtest@gmail.com | random | random   | random        | random       | itemName,orderQty,openQty,refNum |

    # Manage Company > Supply
    @TC_Export004 @smoke-test-api @regression-api 
    Scenario Outline: <TC_ID> - Verify user <email> could call API export <section>
        # Create new supplier with contain text "Auto"
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get supplies with limit row: <limitRow>
        And User sends a GET request to get list supplies
        And User checks any supply exist in the system, if it does not exist will create new supply
        # Export Items
        And User sets POST api endpoint to export <section> with <columns>
        And User sets payload as name: "<removedItemKeys>"
        When User sends POST api endpoint to export <section>
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Count all suppliers
        And User sends a GET request to get total of supplies
        # Check total items in export file = total suppliers in the grid
        And User checks total items in export file EQUALS total <section>
        # Pick random item to check value in export file and in grid
        And User sets GET api endpoint to get supplies with limit row: <limitRow>
        And User sends a GET request to get list supplies
        And User picks <quantity> random supplies in above list supplies
        And User checks values of <section> that just picked the same as export file
        Examples:
            | TC_ID        | companyType | email                    | section | quantity | limitRow | containText | expectedStatus | expectedStatusText | removedItemKeys | supplierName      | description     | emailSupplier       | moq    | leadTime | orderInterval | serviceLevel | columns                              |
            | TC_Export004 | CSV         | exportdatatest@gmail.com | supply  | 3        | 10       | Auto        | 200            | OK                 |                 | New Supplier Auto | New description | emailtest@gmail.com | random | random   | random        | random       | vendorName,itemName,orderQty,openQty |

    # Manage Company > Edit Kits (Boms)
    @TC_Export005 @smoke-test-api @regression-api 
    Scenario Outline: <TC_ID> - Verify user <email> could call API export <section>
        # Create new supplier with contain text "Auto"
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User set GET api endpoint to get items with name contains "<containText>"
        And User sends a GET request to get list items
        And User sets GET api endpoint to get boms with limit row: <limitRow>
        And User sends a GET request to get list limited boms
        And User checks any bom exist in the system, if it does not exist will create new bom
        # Export Items
        And User sets POST api endpoint to export <section> with <columns>
        And User sets payload as name: "<removedItemKeys>"
        When User sends POST api endpoint to export <section>
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Count all suppliers
        And User sends a GET request to get total of boms
        # Check total items in export file = total suppliers in the grid
        And User checks total items in export file EQUALS total <section>
        # Pick random item to check value in export file and in grid
        And User sets GET api endpoint to get boms with limit row: <limitRow>
        And User sends a GET request to get list limited boms
        And User picks <quantity> random boms in above list boms
        And User checks values of <section> that just picked the same as export file
        Examples:
            | TC_ID        | companyType | email                    | section | quantity | limitRow | containText | expectedStatus | expectedStatusText | removedItemKeys | supplierName      | description     | emailSupplier       | moq    | leadTime | orderInterval | serviceLevel | columns                  |
            | TC_Export005 | CSV         | exportdatatest@gmail.com | bom     | 3        | 10       | Auto        | 200            | OK                 |                 | New Supplier Auto | New description | emailtest@gmail.com | random | random   | random        | random       | parentName,childName,qty |

    # RestockAMZ > Item List
    @TC_Export006 @smoke-test-api @regression-api 
    Scenario Outline: <TC_ID> - Verify user <email> could call API export <section>
        # Pick ASC company 
        Given User picks company which has onboarded before with type ASC in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        # User get restock total by vendor
        And User sets GET api method to get restock suggestion by vendor
        And User sends a GET api method to get restock suggestion by vendor
        And User saves all supplier name from list above
        # User count all items that have existed in the Item List via supplier just picked random from Supplier List
        And User sets GET endpoint api to count all item in <section>
        And User sends GET endpoint api to count all item in <section>
        # Export data
        And User sets POST api endpoint to export <section> with <columns>
        And User sets payload as name: "<removedItemKeys>"
        When User sends POST api endpoint to export <section>
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Check total items in export file = total suppliers in the grid
        And User checks total items in export file EQUALS total <section>
        # Pick random item to check value in export file and in grid
        And User sets GET endpoint API to get list SKUs with limit row: <limitRow>
        And User sends GET endpoint API to get list SKUs
        And User picks <quantity> random SKU in above list items
        And User checks values of <section> that just picked the same as export file
        Examples:
            | TC_ID        | companyType | email                    | section            | quantity | limitRow | containText | expectedStatus | expectedStatusText | removedItemKeys | supplierName      | description     | emailSupplier       | moq    | leadTime | orderInterval | serviceLevel | columns                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |   
            | TC_Export005 | ASC         | exportdatatest@gmail.com | restock-suggestion | 3        | 10       | Auto        | 200            | OK                 |                 | New Supplier Auto | New description | emailtest@gmail.com | random | random   | random        | random       | sku,productName,asin,tags,doNotRestock,prepGuide,skuNotes,prepNotes,supplierSku,supplierCost,supplierRebate,inboundShippingCost,reshippingCost,repackagingMaterialCost,repackingLaborCost,restockModel,fnsku,upc,ean,fba,lowestFba,nonFba,lowestNonFba,packageWeight,dimensionalWeight,casePackQuantity,hazmat,oversized,s2d,s7d,s14d,s30d,s60d,s90d,s180d,average7DayPrice,listPrice,newBuyBox,estimatedMargin,estimatedMarginPercentage,estimatedMarkupPercentage,qoh,inbound,inboundFcTransfer,sum,inboundWorking,inboundShipped,inboundReceiving,inboundTotal,targetDays,remaining,demand,outOfStockPercentage,reserved,unfulfillable,pending,localQty,maximumShipmentQty,suggShip,suggReorder,onOrder,restockNeeded,category,rank,referralFee,fbaFee,forecastRecommendedQty,recommendedSupplierQty,recommendedWarehouseQty,orderQty |

    # RestockAMZ > Manage Shipments
    @TC_Export007 @smoke-test-api @regression-api 
    Scenario Outline: <TC_ID> - Verify user <email> could call API export all shipments
        # Pick ASC company 
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        # Export data
        And User sets POST api endpoint to export <section> with <columns>
        And User sets payload as name: "<removedItemKeys>"
        When User sends POST api endpoint to export <section>
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # User count all shipments
        And User sets GET endpoint api to count all shipments
        And User sends GET endpoint api to count all shipments
        # Check total items in export file = total suppliers in the grid
        And User checks total items in export file EQUALS total <section>
        # Pick random item to check value in export file and in grid
        And User sets GET endpoint API to get list shipments with limit row: <limitRow>
        And User sends GET endpoint API to get list shipments
        And User picks <quantity> random shipment in above list shipments
        And User checks values of <section> that just picked the same as export file
        Examples:
            | TC_ID        | companyType | email                    | section  | quantity | limitRow | containText | expectedStatus | expectedStatusText | removedItemKeys | columns                                                                                                                                |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
            | TC_Export007 | ASC         | exportdatatest@gmail.com | shipment | 1        | 100      | Auto        | 200            | OK                 |                 | key,shipmentId,shipmentName,shipmentSource,destinationFulfillmentCenterId,status,requestedQty,receivedQty,totalCost,restockType,orderNotes |

    # RestockAMZ > Manage Shipments > Shipment Details
    @TC_Export008 @smoke-test-api @regression-api 
    Scenario Outline: <TC_ID> - Verify user <email> could call API export data in Shipment Details
        # Pick ASC company 
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        # User count all shipments
        And User sets GET endpoint API to get list shipments with limit row: <limitRow>
        And User sends GET endpoint API to get list shipments
        # User count all shipments
        And User sets GET endpoint api to count all SKUs in Shipment Details
        And User sends GET endpoint api to count all SKUs in Shipment Details
        # Export data
        And User sets POST api endpoint to export <section> with <columns>
        And User sets payload as name: "<removedItemKeys>"
        When User sends POST api endpoint to export <section>
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Check total items in export file = total suppliers in the grid
        And User checks total items in export file EQUALS total <section>
        # Pick random item to check value in export file and in grid
        And User sets GET endpoint api to get list SKUs in Shipment Details
        And User sends GET endpoint api to get list SKUs in Shipment Details
        And User picks <quantity> random SKU in above list SKUs
        And User checks values of <section> that just picked the same as export file
        Examples:
            | TC_ID        | companyType | email                    | section         | quantity | limitRow | containText | expectedStatus | expectedStatusText | removedItemKeys | columns                                                                             |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
            | TC_Export008 | ASC         | exportdatatest@gmail.com | shipment-detail | 1        | 100      | Auto        | 200            | OK                 |                 | fnsku,description,packageWeight,cost,localQty,caseQty,shipmentQty,receivedQty,notes |

    # Purchasing > My Suggested
    @TC_Export009 @smoke-test-api @regression-api 
    Scenario Outline: <TC_ID> - Verify user <email> could call API export data in Purchasing > My Suggested
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        # Count item in PO
        And User sets GET api endpoint to get summary by vendor
        And User sends a GET request to get summary by vendor
        And User selects any suggested purchase orders above that has supplier name
        # Export data
        And User sets POST api endpoint to export <section> with <columns>
        And User sets payload as name: "<removedItemKeys>"
        When User sends POST api endpoint to export <section>
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # User count all items in PO by vendor key
        And User sets GET api endpoint to get count items in PO by vendor key <vendorKey>
        And User sends request to get count items on Items in PO by vendor key
        # Check total items in export file = total suppliers in the grid
        And User checks total items in export file EQUALS total <section>
        # Pick random item to check value in export file and in grid
        And User sets api endpoint to get list items in PO of vendor key
        And User sends a POST request to get list items in PO by vendor key
        And User selects random items in Purchasing My Suggested
        And User checks values of <section> that just picked the same as export file
        Examples:
            | TC_ID        | companyType | vendorKey | email                    | section      | containText | expectedStatus | expectedStatusText | removedItemKeys | columns                                                                                                                                               |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
            | TC_Export009 | ASC         | random    | exportdatatest@gmail.com | my-suggested | Auto        | 200            | OK                 |                 | itemName,description,tags,onNewPo,recommendedQty,purchaseQty,vendorPrice,total,snapshotQty,onHand,onHandThirdParty,openPurchaseOrders,openSalesOrders |
        
    # Purchasing > Custom
    @TC_Export010 @smoke-test-api @regression-api 
    Scenario Outline: <TC_ID> - Verify user <email> could call API export data in Purchasing > Custom
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        # Export data
        And User sets POST api endpoint to export <section> with <columns>
        And User sets payload as name: "<removedItemKeys>"
        When User sends POST api endpoint to export <section>
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # User count all items in Custom
        And User sets GET api endpoint to get count items in Purchasing Custom
        When User sends a GET request to get count items in Purchasing Custom
        # Check total items in export file = total suppliers in the grid
        And User checks total items in export file EQUALS total <section>
        # Pick random item to check value in export file and in grid
        And User sets GET api endpoint to get items in Purchasing Custom
        And User sends a GET request to get items in Purchasing Custom
        And User picks <quantity> random item in above list items in Custom
        And User checks values of <section> that just picked the same as export file
        Examples:
            | TC_ID        | companyType | vendorKey | email                    | section | containText | expectedStatus | expectedStatusText | removedItemKeys | quantity | columns                                                                                                                                                              |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
            | TC_Export010 | ASC         | null      | exportdatatest@gmail.com | custom  | Auto        | 200            | OK                 |                 | 3        | itemName,description,tags,onNewPo,recommendedQty,purchaseQty,vendorPrice,total,snapshotQty,onHand,onHandThirdParty,openPurchaseOrders,openSalesOrders |

    # Purchasing > Custom > Filter
    @TC_Export011 @smoke-test-api @regression-api 
    Scenario Outline: <TC_ID> - Verify user <email> could call API export data in Purchasing > Custom with filter and sort
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        # Filtering items
        And User sets GET api endpoint to get items in Purchasing Custom with filter <columnName> column
        And User sends a GET request to get items in Purchasing Custom with filter <columnName> column
        # Export data
        And User sets POST api endpoint to export <section> with <columns>
        And User sets payload as name: "<removedItemKeys>"
        When User sends POST api endpoint to download <section> with filter <columnName> column and sort <sort>
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # User count all items in Custom after filtering
        And User sets GET api endpoint to get count items with filter <columnName> column in Purchasing Custom 
        When User sends a GET request to get count items with filter <columnName> column in Purchasing Custom 
        # Check total items in export file = total suppliers in the grid
        And User checks total items in export file EQUALS total <section>
        # Pick random item to check value in export file and in grid
        And User sets GET api endpoint to get items in Purchasing Custom
        And User sends a GET request to get items in Purchasing Custom
        And User picks <quantity> random item in above list items after filtering and sorting
        And User checks values of <section> that just picked the same as export file
        Examples:
            | TC_ID        | companyType | vendorKey | email                    | section | columnName    | sort | containText | expectedStatus | expectedStatusText | removedItemKeys | quantity | columns                                                                                                                                                              |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
            | TC_Export011 | ASC         | null      | exportdatatest@gmail.com | custom  | onHand        | null | Auto        | 200            | OK                 |                 | 3        | itemName,description,tags,onNewPo,recommendedQty,purchaseQty,vendorPrice,total,snapshotQty,onHand,onHandThirdParty,openPurchaseOrders,openSalesOrders |
