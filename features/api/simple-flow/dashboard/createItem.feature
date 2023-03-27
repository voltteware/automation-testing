@test-api @api-dashboard @api-item @api-createItem
Feature: API_Dashboard POST /api/item
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111! |
        And User sets GET api endpoint to get company keys
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get company keys

    @TC_CI001 @regression-api @csv
    Scenario Outline: TC_CI001 - Verify user <email> could call this API to create item for company has type <companyType> with input all data valid
        Given User picks company with type CSV in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers with limit row: <limitRow>
        And User sends a GET request to get list suppliers
        And user checks Auto supplier exist in the system, if it does not exist will create new supplier
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets POST api endpoint to create item
        And User sets request body with payload as name: "<itemName>" and description: "<description>" and vendorName: "<vendorName>" and vendorPrice: "<vendorPrice>" and moq: "<moq>" and leadTime: "<leadTime>" and orderInterval: "<orderInterval>" and serviceLevel: "<serviceLevel>" and onHand: "<onHand>" and onHandMin: "<onHandMin>" and onHandThirdParty: "<onHandThirdParty>" and onHandThirdPartyMin: "<onHandThirdPartyMin>" and lotMultipleQty: "<lotMultipleQty>" and lotMultipleItemName: "<lotMultipleItemName>" and asin: "" and fnsku: "" and skuNotes: "" and prepNotes: "" and supplierRebate: "" and inboundShippingCost: "" and reshippingCost: "" and repackagingMaterialCost: "" and repackingLaborCost: "" and rank: "" and inventorySourcePreference: "" and average7DayPrice: "" and isFbm: "" and key: "" and vendorKey: "<vendorKey>" and lotMultipleItemKey: "<lotMultipleItemKey>"
        When User sends a POST method to create item
        Then The expected status code should be <expectedStatus>
        And User checks API contract essential types in item object are correct
        And User checks values in response of create item are correct
        Examples:
            | companyType | email                      | limitRow | itemName      | description     | vendorName | vendorPrice | moq    | leadTime | orderInterval | serviceLevel | onHand | onHandMin | onHandThirdParty | onHandThirdPartyMin | lotMultipleQty | lotMultipleItemName | vendorKey | lotMultipleItemKey | expectedStatus |
            | CSV         | testautoforecast@gmail.com | 10       | New Item Auto | New description | random     | random      | random | random   | random        | random       | random | random    | random           |random               | random         | random              | random    | random             | 200            |

    @TC_CI002
    Scenario Outline: TC_CI002 - Verify user <email> could call this API to create item for company has type <companyType> with only input required field
        Given User picks company with type CSV in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets POST api endpoint to create item
        And User sets request body with payload as name: "<itemName>" and asin: "" and fnsku: ""
        When User sends a POST method to create item
        Then The expected status code should be <expectedStatus>
        And User checks API contract essential types in item object are correct
        And User checks values in response of create item are correct
        Examples:
            | companyType | email                      | itemName      | asin   | fnsku  | expectedStatus |
            | CSV         | testautoforecast@gmail.com | New Item Auto | random | random | 200            |

    @TC_CI003 @regression-api @asc
    Scenario Outline: TC_CI003 - Verify user <email> could call this API to create item for company has type <companyType> with input all data valid
        Given User picks company with type ASC in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers with limit row: <limitRow>
        And User sends a GET request to get list suppliers
        And user checks Auto supplier exist in the system, if it does not exist will create new supplier
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets POST api endpoint to create item
        And User sets request body with payload as name: "<itemName>" and description: "<description>" and vendorName: "<vendorName>" and vendorPrice: "<vendorPrice>" and moq: "<moq>" and leadTime: "<leadTime>" and orderInterval: "<orderInterval>" and serviceLevel: "<serviceLevel>" and onHand: "<onHand>" and onHandMin: "<onHandMin>" and onHandThirdParty: "<onHandThirdParty>" and onHandThirdPartyMin: "<onHandThirdPartyMin>" and lotMultipleQty: "<lotMultipleQty>" and lotMultipleItemName: "<lotMultipleItemName>" and asin: "<asin>" and fnsku: "<fnsku>" and skuNotes: "<skuNotes>" and prepNotes: "<prepNotes>" and supplierRebate: "<supplierRebate>" and inboundShippingCost: "<inboundShippingCost>" and reshippingCost: "<reshippingCost>" and repackagingMaterialCost: "<repackagingMaterialCost>" and repackingLaborCost: "<repackingLaborCost>" and rank: "<rank>" and inventorySourcePreference: "<inventorySourcePreference>" and average7DayPrice: "<average7DayPrice>" and isFbm: "<isFbm>" and key: "" and vendorKey: "<vendorKey>" and lotMultipleItemKey: "<lotMultipleItemKey>"
        When User sends a POST method to create item
        Then The expected status code should be <expectedStatus>
        And User checks API contract essential types in item object are correct
        And User checks values in response of create item are correct
        Examples:
            | companyType | email                      | limitRow | itemName      | description     | vendorName | vendorPrice | moq    | leadTime | orderInterval | serviceLevel | onHand | onHandMin | onHandThirdParty | onHandThirdPartyMin | lotMultipleQty | lotMultipleItemName | asin   | fnsku  | skuNotes | prepNotes | supplierRebate | inboundShippingCost | reshippingCost | repackagingMaterialCost | repackingLaborCost | rank   | inventorySourcePreference | average7DayPrice | isFbm  | vendorKey | lotMultipleItemKey | expectedStatus |
            | ASC         | testautoforecast@gmail.com | 10       | New Item Auto | New description | random     | random      | random | random   | random        | random       | random | random    | random           | random              | random         | random              | random | random | random   | random    | random         | random              | random         | random                  | random             | random | FBA + FBM                 | random           | random | random    | random             | 200            |

    @TC_CI004
    Scenario Outline: TC_CI004 - Verify user <email> could call this API to create item for company has type <companyType> with only input required field
        Given User picks company with type ASC in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets POST api endpoint to create item
        And User sets request body with payload as name: "<itemName>" and asin: "<asin>" and fnsku: "<fnsku>"
        When User sends a POST method to create item
        Then The expected status code should be <expectedStatus>
        And User checks API contract essential types in item object are correct
        And User checks values in response of create item are correct
        Examples:
            | companyType | email                      | itemName      | asin   | fnsku  | expectedStatus |
            | ASC         | testautoforecast@gmail.com | New Item Auto | random | random | 200            |   

    #TC_CI005_1, TC_CI005_2 fail due to bug api
    @TC_CI005 @bug-permission
    Scenario Outline: <scenario> - Verify error when user sends this API with <cookie> cookie, <companyKeyHeader> companyKey, <companyTypeHeader> companyType value in header
        Given User picks company with type CSV in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets POST api endpoint to create item
        But User sets <cookie> cookie of <email> and <companyKeyHeader> companyKey and <companyTypeHeader> companyType in the header
        And User sets request body with payload as name: "<itemName>" and description: "<description>" and vendorName: "" and vendorPrice: "<vendorPrice>" and moq: "<moq>" and leadTime: "<leadTime>" and orderInterval: "<orderInterval>" and serviceLevel: "<serviceLevel>" and onHand: "<onHand>" and onHandMin: "<onHandMin>" and onHandThirdParty: "<onHandThirdParty>" and onHandThirdPartyMin: "<onHandThirdPartyMin>" and lotMultipleQty: "<lotMultipleQty>" and lotMultipleItemName: "" and asin: "" and fnsku: "" and skuNotes: "" and prepNotes: "" and supplierRebate: "" and inboundShippingCost: "" and reshippingCost: "" and repackagingMaterialCost: "" and repackingLaborCost: "" and rank: "" and inventorySourcePreference: "" and average7DayPrice: "" and isFbm: "" and key: "" and vendorKey: "" and lotMultipleItemKey: ""
        When User sends a POST method to create item
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | scenario   | email                      | cookie  | companyKeyHeader | companyTypeHeader | itemName      | description     | vendorPrice | moq    | leadTime | orderInterval | serviceLevel | onHand | onHandMin | onHandThirdParty | onHandThirdPartyMin | lotMultipleQty | lotMultipleItemName | lotMultipleItemKey | expectedStatus | expectedStatusText    |
            | TC_CI005_1 | testautoforecast@gmail.com | invalid | invalid          | invalid           | New Item Auto | New description | random      | random | random   | random        | random       | random | random    | random           |random               | random         | random              | random             | 401            | Unauthorized          |
            | TC_CI005_2 | testautoforecast@gmail.com | invalid | valid            | valid             | New Item Auto | New description | random      | random | random   | random        | random       | random | random    | random           |random               | random         | random              | random             | 401            | Unauthorized          |
            | TC_CI005_3 | testautoforecast@gmail.com | valid   | invalid          | invalid           | New Item Auto | New description | random      | random | random   | random        | random       | random | random    | random           |random               | random         | random              | random             | 400            | Company not found.    |
            | TC_CI005_4 | testautoforecast@gmail.com | valid   |                  |                   | New Item Auto | New description | random      | random | random   | random        | random       | random | random    | random           |random               | random         | random              | random             | 500            | Internal Server Error |

    @TC_CI006
    Scenario Outline: TC_CI006 - Verify user <userA> could not call this API to create item of company which does not belongs to her
        Given User picks company with type CSV in above response
        But User sets valid cookie of <userB> and valid companyKey and valid companyType in the header
        And User has valid connect.sid of "<userA>" after send a POST request with payload as email: "<userA>" and password: "<password>"
        And User sets POST api endpoint to create item
        But User sets valid cookie of <userA> and valid companyKey and valid companyType in the header
        And User sets request body with payload as name: "<itemName>" and description: "<description>" and vendorName: "" and vendorPrice: "<vendorPrice>" and moq: "<moq>" and leadTime: "<leadTime>" and orderInterval: "<orderInterval>" and serviceLevel: "<serviceLevel>" and onHand: "<onHand>" and onHandMin: "<onHandMin>" and onHandThirdParty: "<onHandThirdParty>" and onHandThirdPartyMin: "<onHandThirdPartyMin>" and lotMultipleQty: "<lotMultipleQty>" and lotMultipleItemName: "" and asin: "" and fnsku: "" and skuNotes: "" and prepNotes: "" and supplierRebate: "" and inboundShippingCost: "" and reshippingCost: "" and repackagingMaterialCost: "" and repackingLaborCost: "" and rank: "" and inventorySourcePreference: "" and average7DayPrice: "" and isFbm: "" and key: "" and vendorKey: "" and lotMultipleItemKey: ""
        When User sends a POST method to create item
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | userA               | userB                      | password  | itemName      | description     | vendorPrice | moq    | leadTime | orderInterval | serviceLevel | onHand | onHandMin | onHandThirdParty | onHandThirdPartyMin | lotMultipleQty | expectedStatus | expectedStatusText    |
            | may27user@gmail.com | testautoforecast@gmail.com | Test1111! | New Item Auto | New description | random      | random | random   | random        | random       | random | random    | random           | random              | random         | 400            | Company not found.    |
    
    @TC_CI007
    Scenario Outline: TC_CI007 - Verify error FNSKU already exists
        Given User picks company with type ASC in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers with limit row: 5
        And User sends a GET request to get list suppliers
        And User sets POST api endpoint to create item
        And User sets request body with payload as name: "<itemName>" and description: "<description>" and vendorName: "<vendorName>" and vendorPrice: "<vendorPrice>" and moq: "<moq>" and leadTime: "<leadTime>" and orderInterval: "<orderInterval>" and serviceLevel: "<serviceLevel>" and onHand: "<onHand>" and onHandMin: "<onHandMin>" and onHandThirdParty: "<onHandThirdParty>" and onHandThirdPartyMin: "<onHandThirdPartyMin>" and lotMultipleQty: "<lotMultipleQty>" and lotMultipleItemName: "" and asin: "<asin>" and fnsku: "<fnsku>" and skuNotes: "<skuNotes>" and prepNotes: "<prepNotes>" and supplierRebate: "<supplierRebate>" and inboundShippingCost: "<inboundShippingCost>" and reshippingCost: "<reshippingCost>" and repackagingMaterialCost: "<repackagingMaterialCost>" and repackingLaborCost: "<repackingLaborCost>" and rank: "<rank>" and inventorySourcePreference: "<inventorySourcePreference>" and average7DayPrice: "<average7DayPrice>" and isFbm: "<isFbm>" and key: "" and vendorKey: "<vendorKey>" and lotMultipleItemKey: ""
        And User sends a POST method to create item
        When User sends a POST method to create item
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | email                      | itemName      | description     | vendorPrice | moq    | leadTime | orderInterval | serviceLevel | onHand | onHandMin | onHandThirdParty | onHandThirdPartyMin | lotMultipleQty | asin   | fnsku  | skuNotes | prepNotes | supplierRebate | inboundShippingCost | reshippingCost | repackagingMaterialCost | repackingLaborCost | rank   | inventorySourcePreference | average7DayPrice | isFbm  | vendorName | vendorKey | expectedStatus | expectedStatusText                      |
            | testautoforecast@gmail.com | New Item Auto | New description | random      | random | random   | random        | random       | random | random    | random           | random              | random         | random | random | random   | random    | random         | random              | random         | random                  | random             | random | FBA + FBM                 | random           | random | random     | random    | 400            | Item with the same FNSKU already exists |

    @TC_CI008
    Scenario Outline: TC_CI008 - Verify error Item Name and Supplier Name already exists
        Given User picks company with type CSV in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers with limit row: 5
        And User sends a GET request to get list suppliers
        And User sets GET api endpoint to get item with limit row: 5
        And User sends a GET request to get list items
        And User sets POST api endpoint to create item
        And User sets request body with payload as name: "<itemName>" and description: "<description>" and vendorName: "<vendorName>" and vendorPrice: "<vendorPrice>" and moq: "<moq>" and leadTime: "<leadTime>" and orderInterval: "<orderInterval>" and serviceLevel: "<serviceLevel>" and onHand: "<onHand>" and onHandMin: "<onHandMin>" and onHandThirdParty: "<onHandThirdParty>" and onHandThirdPartyMin: "<onHandThirdPartyMin>" and lotMultipleQty: "<lotMultipleQty>" and lotMultipleItemName: "<lotMultipleItemName>" and asin: "" and fnsku: "" and skuNotes: "" and prepNotes: "" and supplierRebate: "" and inboundShippingCost: "" and reshippingCost: "" and repackagingMaterialCost: "" and repackingLaborCost: "" and rank: "" and inventorySourcePreference: "" and average7DayPrice: "" and isFbm: "" and key: "" and vendorKey: "<vendorKey>" and lotMultipleItemKey: "<lotMultipleItemKey>"
        And User sends a POST method to create item
        When User sends a POST method to create item
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | email                      | itemName      | description     | vendorPrice | moq    | leadTime | orderInterval | serviceLevel | onHand | onHandMin | onHandThirdParty | onHandThirdPartyMin | lotMultipleQty | lotMultipleItemName | lotMultipleItemKey | vendorName | vendorKey | expectedStatus | expectedStatusText                                                 |
            | testautoforecast@gmail.com | New Item Auto | New description | random      | random | random   | random        | random       | random | random    | random           | random              | random         | random              | random             | random     | random    | 400            | Item with the same Item Name and same Supplier Name already exists |

    #Bug TC_CI009,TC_CI010 return status code 200 when call this API for company has type QBFS and QBO.
    @TC_CI009 @TC_CI010
    Scenario Outline: <scenario> - Verify user could not call this API with company has type <companyType>
        Given User picks company with type <companyType> in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets POST api endpoint to create item
        And User sets request body with payload as name: "<itemName>" and description: "<description>" and vendorName: "" and vendorPrice: "<vendorPrice>" and moq: "<moq>" and leadTime: "<leadTime>" and orderInterval: "<orderInterval>" and serviceLevel: "<serviceLevel>" and onHand: "<onHand>" and onHandMin: "<onHandMin>" and onHandThirdParty: "<onHandThirdParty>" and onHandThirdPartyMin: "<onHandThirdPartyMin>" and lotMultipleQty: "<lotMultipleQty>" and lotMultipleItemName: "" and asin: "" and fnsku: "" and skuNotes: "" and prepNotes: "" and supplierRebate: "" and inboundShippingCost: "" and reshippingCost: "" and repackagingMaterialCost: "" and repackingLaborCost: "" and rank: "" and inventorySourcePreference: "" and average7DayPrice: "" and isFbm: "" and key: "" and vendorKey: "" and lotMultipleItemKey: ""
        When User sends a POST method to create item
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | scenario  | companyType | email                     | itemName      | description     | vendorPrice | moq    | leadTime | orderInterval | serviceLevel | onHand | onHandMin | onHandThirdParty | onHandThirdPartyMin | lotMultipleQty | expectedStatus | expectedStatusText |
            | TC_CI009 | QBFS        | testautoforecast@gmail.com | New Item Auto | New description | random      | random | random   | random        | random       | random | random    | random           | random              | random         | 400            | Bad Request        |
            | TC_CI010 | QBO         | testautoforecast@gmail.com | New Item Auto | New description | random      | random | random   | random        | random       | random | random    | random           | random              | random         | 400            | Bad Request        |