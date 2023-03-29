@test-api-extra @regression-api @onboarding-flow
Feature: API_Regression User can create company
    Background: Send POST /login request to login before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                     | password  |
            | admin | testuserforecastrx@gmail.com | Test1111# |

    @TC_OB001_CSV
    # Will add enpoint Edit Value on Grid later
    Scenario Outline: <TC_ID> - Verify user <email> could call APIs to create company CSV
        Given In Header of the request, User sets param Cookie as valid connect.sid
        And User sets request body with payload as companyName: "<companyName>" and companyKey: "" and companyType: "<companyType>" and serviceLevel: "<serviceLevel>" and leadTime: "<leadTime>" and orderInterval: "<orderInterval>" and initialSyncDate: "" and marketplaceId: ""
        And User sets POST api endpoint to create company
        And User sends a POST method to create company
        And User sets PUT api endpoint to update company keys
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets request body with payload as leadTime: <leadTime> and companyKey, companyType
        And User sends a PUT method to update company of "<email>" by company key
        And User sets POST api endpoint to create suppliers
        And User sets request body with payload as name: "<supplierName>" and description: "<description>" and email: "<emailSupplier>" and moq: "<moq>" and leadTime: "<leadTime>" and orderInterval: "<orderInterval>" and serviceLevel: "<serviceLevel>" and targetOrderValue: "" and freeFreightMinimum: "" and restockModel: ""
        And User sends a POST method to create supplier
        And User sets GET api endpoint to get suppliers with limit row: <limitRow>
        And User sends a GET request to get list suppliers
        And user checks Auto supplier exist in the system, if it does not exist will create new supplier
        And User sets POST api endpoint to create item
        And User sets request body with payload as name: "<itemName>" and description: "<description>" and vendorName: "<vendorName>" and vendorPrice: "<vendorPrice>" and moq: "<moq>" and leadTime: "<leadTime>" and orderInterval: "<orderInterval>" and serviceLevel: "<serviceLevel>" and onHand: "<onHand>" and onHandMin: "<onHandMin>" and onHandThirdParty: "<onHandThirdParty>" and onHandThirdPartyMin: "<onHandThirdPartyMin>" and lotMultipleQty: "" and lotMultipleItemName: "" and asin: "" and fnsku: "" and skuNotes: "" and prepNotes: "" and supplierRebate: "" and inboundShippingCost: "" and reshippingCost: "" and repackagingMaterialCost: "" and repackingLaborCost: "" and rank: "" and inventorySourcePreference: "" and average7DayPrice: "" and isFbm: "" and key: "" and vendorKey: "<vendorKey>" and lotMultipleItemKey: ""
        And User sends a POST method to create item
        And User sets POST api endpoint to create item
        And User sets request body with payload as name: "<itemName>" and description: "<description>" and vendorName: "<vendorName>" and vendorPrice: "<vendorPrice>" and moq: "<moq>" and leadTime: "<leadTime>" and orderInterval: "<orderInterval>" and serviceLevel: "<serviceLevel>" and onHand: "<onHand>" and onHandMin: "<onHandMin>" and onHandThirdParty: "<onHandThirdParty>" and onHandThirdPartyMin: "<onHandThirdPartyMin>" and lotMultipleQty: "" and lotMultipleItemName: "" and asin: "" and fnsku: "" and skuNotes: "" and prepNotes: "" and supplierRebate: "" and inboundShippingCost: "" and reshippingCost: "" and repackagingMaterialCost: "" and repackingLaborCost: "" and rank: "" and inventorySourcePreference: "" and average7DayPrice: "" and isFbm: "" and key: "" and vendorKey: "<vendorKey>" and lotMultipleItemKey: ""
        And User sends a POST method to create item
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets GET api endpoint to get bom keys
        And User sends a GET request to get all boms
        And User sets POST api endpoint to create bom
        And User sets request body with payload as parentName: "<parentName>" and parentKey: "<parentKey>" and childName: "<childName>" and childKey: "<childKey>" and qty: "<qty>"
        And User sends a POST method to create bom
        And User sets GET api endpoint to get demands with limit row: <limitRow>
        And User sends a GET request to get list demands
        And User checks any demand exist in the system, if it does not exist will create new demand
        And User sets POST api endpoint to create supply
        And User sets request body with payload as supplyUuid: "<supplyUuid>" and refNum: "<refNum>" and vendorName: "<vendorName>" and vendorKey: "<vendorKey>" and docDate: "<docDate>" and dueDate: "<dueDate>" and itemName: "<itemName>" and itemKey: "<itemKey>" and orderQty: "<orderQty>" and openQty: "<openQty>" and orderKey: "<orderKey>" and rowKey: "<rowKey>"
        And User sends a POST method to create supply
        And User sends a PUT method to set a scheduled time meeting
        And User sets GET api endpoint to get company information by company key
        And User sends a GET request to get company information by company key
        And User sets POST api to run forecast
        And User sends a POST request to run forecast
        When The expected status code should be <expectedStatus>
        Then The status text is "<expectedStatusText>"
        # And Check that the company just created exists in the current companies list of his
        # And And User sets DELETE api endpoint to delete company
        # And User sends a DELETE method to delete the created company
        Examples:   
            | TC_ID    | email                        | companyName | companyType | serviceLevel | leadTime | orderInterval | expectedStatus | expectedStatusText | supplierName      | description     | emailSupplier      | moq    | itemName      | description     | vendorName | vendorPrice | onHand | onHandMin | onHandThirdParty | onHandThirdPartyMin | lotMultipleQty | lotMultipleItemName | vendorKey | limitRow | parentName | parentKey | childName | childKey | qty    | supplyUuid | refNum | docDate | dueDate | itemKey | orderQty | openQty | orderKey | rowKey |
            | TC_OB001 | testuserforecastrx@gmail.com | random      | CSV         | random       | random   | random        | 200            | OK                 | New Supplier Auto | New description | newemail@gmail.com | random | New Item Auto | New description | random     | random      | random | random    | random           | random              | random         | random              | random    | 10       | random     | random    | random    | random   | random | random     | random | random  | randon  | random  | random   | random  | random   | random |

        @TC_OB002_ASC
        # Will add enpoint Edit Value on Grid later
        Scenario Outline: <TC_ID> - Verify user <email> could call APIs to create company ASC
            Given In Header of the request, user sets param Cookie as valid connect.sid
            And User sends a GET request to get all company
            And User selects onboarding company with type <companyType>
            And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
            And User sets PUT api endpoint to update company keys
            And User sets request body with payload as leadTime: <leadTime> and companyKey, companyType
            And User sends a PUT method to update company of "<email>" by company key
            And User sets POST api endpoint to create suppliers
            And User sets request body with payload as name: "<supplierName>" and description: "<description>" and email: "<emailSupplier>" and moq: "<moq>" and leadTime: "<leadTime>" and orderInterval: "<orderInterval>" and serviceLevel: "<serviceLevel>" and targetOrderValue: "" and freeFreightMinimum: "" and restockModel: ""
            And User sends a POST method to create supplier
            And User sets GET api endpoint to get suppliers with limit row: <limitRow>
            And User sends a GET request to get list suppliers
            And User sets POST api endpoint to create item
            And User sets request body with payload as name: "<itemName>" and description: "<description>" and vendorName: "<vendorName>" and vendorPrice: "<vendorPrice>" and moq: "<moq>" and leadTime: "<leadTime>" and orderInterval: "<orderInterval>" and serviceLevel: "<serviceLevel>" and onHand: "<onHand>" and onHandMin: "<onHandMin>" and onHandThirdParty: "<onHandThirdParty>" and onHandThirdPartyMin: "<onHandThirdPartyMin>" and lotMultipleQty: "<lotMultipleQty>" and lotMultipleItemName: "" and asin: "<asin>" and fnsku: "<fnsku>" and skuNotes: "<skuNotes>" and prepNotes: "<prepNotes>" and supplierRebate: "<supplierRebate>" and inboundShippingCost: "<inboundShippingCost>" and reshippingCost: "<reshippingCost>" and repackagingMaterialCost: "<repackagingMaterialCost>" and repackingLaborCost: "<repackingLaborCost>" and rank: "<rank>" and inventorySourcePreference: "<inventorySourcePreference>" and average7DayPrice: "<average7DayPrice>" and isFbm: "<isFbm>" and key: "" and vendorKey: "<vendorKey>" and lotMultipleItemKey: ""
            And User sends a POST method to create item
            And User sets GET api endpoint to get item with limit row: <limitRow>
            And User sends a GET request to get list items
            And User sets GET api endpoint to get bom keys
            And User sends a GET request to get all boms
            And User sets POST api endpoint to create bom
            And User sets request body with payload as parentName: "<parentName>" and parentKey: "<parentKey>" and childName: "<childName>" and childKey: "<childKey>" and qty: "<qty>"
            And User sends a POST method to create bom
            And User sets POST api endpoint to create supply
            And User sets request body with payload as supplyUuid: "<supplyUuid>" and refNum: "<refNum>" and vendorName: "<vendorName>" and vendorKey: "<vendorKey>" and docDate: "<docDate>" and dueDate: "<dueDate>" and itemName: "<itemName>" and itemKey: "<itemKey>" and orderQty: "<orderQty>" and openQty: "<openQty>" and orderKey: "<orderKey>" and rowKey: "<rowKey>"
            And User sends a POST method to create supply
            And User sends a PUT method to set a scheduled time meeting
            And User sets GET api endpoint to get company information by company key
            And User sends a GET request to get company information by company key
            # And User sets POST api to run forecast
            # And User sends a POST request to run forecast
            When The expected status code should be <expectedStatus>
            Then The status text is "<expectedStatusText>"
            # And Check that the company just created exists in the current companies list of his
            # And And User sets DELETE api endpoint to delete company
            # And User sends a DELETE method to delete the created company

        Examples:
            | TC_ID    | companyType | email                        | supplierName      | description     | emailSupplier      | moq    | itemName      | description     | leadTime | orderInterval | serviceLevel | limitRow | itemName      | vendorName | vendorPrice | onHand | onHandMin | onHandThirdParty | onHandThirdPartyMin | lotMultipleQty | asin   | fnsku  | skuNotes | prepNotes | supplierRebate | inboundShippingCost | reshippingCost | repackagingMaterialCost | repackingLaborCost | rank   | inventorySourcePreference | average7DayPrice | isFbm  | vendorKey | parentName | parentKey | childName | childKey | qty     | supplyUuid | refNum | docDate | dueDate | orderQty | openQty | orderKey | rowKey | itemKey | expectedStatus | expectedStatusText |
            | TC_OB002 | ASC         | testuserforecastrx@gmail.com | New Supplier Auto | New description | newemail@gmail.com | random | New Item Auto | New description | random   | random        | random       | 10       | New Item Auto | random     | random      | random | random    | random           | random              | random         | random | random | random   | random    | random         | random              | random         | random                  | random             | random | FBA + FBM                 | random           | random | random    | random     | random    | random    | random   | random  | random     | random | random  | random  | random   | random  | random   | random | random  | 200            | OK                 |