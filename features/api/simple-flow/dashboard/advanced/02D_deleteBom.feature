@test-api @api-dashboard @api-bom @api-deleteBom
Feature: API_Dashboard DELETE /api/bom
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username             | password  |
            | admin | testgetbom@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies

    @TC_DB001 @TC_DB002
    Scenario Outline: <TC_ID> - Verify <user> could call this API to delete only child bom of a company has type <companyType> belongs to her
        Given User picks company which has onboarded before with type <companyType> in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers with limit row: <limitRow>
        And User sends a GET request to get list suppliers
        And user checks Auto supplier exist in the system, if it does not exist will create new supplier
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets POST api endpoint to create item
        And User sets request body with payload as name: "<itemName>" and description: "<description>" and vendorName: "<vendorName>" and vendorPrice: "<vendorPrice>" and moq: "<moq>" and leadTime: "<leadTime>" and orderInterval: "<orderInterval>" and serviceLevel: "<serviceLevel>" and onHand: "<onHand>" and onHandMin: "<onHandMin>" and onHandThirdParty: "<onHandThirdParty>" and onHandThirdPartyMin: "<onHandThirdPartyMin>" and lotMultipleQty: "<lotMultipleQty>" and lotMultipleItemName: "<lotMultipleItemName>" and asin: "" and fnsku: "" and skuNotes: "" and prepNotes: "" and supplierRebate: "" and inboundShippingCost: "" and reshippingCost: "" and repackagingMaterialCost: "" and repackingLaborCost: "" and rank: "" and inventorySourcePreference: "" and average7DayPrice: "" and isFbm: "" and key: "" and vendorKey: "<vendorKey>" and lotMultipleItemKey: "<lotMultipleItemKey>"
        And User sends a POST method to create item
        And User sets GET api endpoint to get bom keys
        And User sends a GET request to get all boms
        And User checks Auto bom exist in the system, if it does not exist will create new bom
        And User sets POST api endpoint to create bom
        And User sets request body with payload as parentName: "<parentName>" and parentKey: "<parentKey>" and childName: "<childName>" and childKey: "<childKey>" and qty: "<qty>"
        And User sends a POST method to create bom
        And User sends a GET request to get total of boms
        And User picks <quantity> random boms in above list boms
        When User sends a DELETE method to delete bom child
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # And User checks the total boms is correct
        And User search the deleted child bom by name and check that no bom found

        Examples:
            | TC_ID    | companyType | parentName | parentKey | childName | childKey | qty    | quantity | expectedStatus | expectedStatusText | email                | limitRow | itemName      | description     | vendorName | vendorPrice | moq    | leadTime | orderInterval | serviceLevel | onHand | onHandMin | onHandThirdParty | onHandThirdPartyMin | lotMultipleQty | lotMultipleItemName | vendorKey | lotMultipleItemKey |
            | TC_DB001 | CSV         | 2          | random    | random    | random   | random |  1       | 200            | OK                 | testgetbom@gmail.com | 10       | New Item Auto | New description | random     | random      | random | random   | random        | random       | random | random    | random           | random              | random         | random              | random    | random             |
            | TC_DB002 | ASC         | 2          | random    | random    | random   | random |  1       | 200            | OK                 | testgetbom@gmail.com | 10       | New Item Auto | New description | random     | random      | random | random   | random        | random       | random | random    | random           | random              | random         | random              | random    | random             |

    #Bug API in case TC_DB003_1, TC_DB003_2
    @TC_DB003 @bug-permission @low-bug-skip
    Scenario Outline: <TC_ID> - Verify error when user sends this API with <cookie> cookie and <companyKeyHeader> companyKeyHeader and <companyTypeHeader> companyTypeHeader
        Given User picks company which has onboarded before with type CSV in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: 10
        And User sends a GET request to get list items
        And User sets GET api endpoint to get bom keys
        And User sends a GET request to get all boms
        And User checks Auto bom exist in the system, if it does not exist will create new bom
        And User sends a GET request to get total of boms
        And User filters <numberOfBoms> boms which has the parentName includes <bomParentNameKeyword>
        But User sets <cookie> cookie of <email> and <companyKeyHeader> companyKey and <companyTypeHeader> companyType in the header
        When User sends a DELETE method to delete bom child
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | TC_ID      | email                | numberOfBoms | bomParentNameKeyword | cookie  | companyKeyHeader | companyTypeHeader | expectedStatus | expectedStatusText    |
            | TC_DB003_1 | testgetbom@gmail.com | 1            | Auto                 | invalid | invalid          | invalid           | 401            | Unauthorized          |
            | TC_DB003_2 | testgetbom@gmail.com | 1            | Auto                 | invalid | valid            | valid             | 401            | Unauthorized          |
            | TC_DB003_3 | testgetbom@gmail.com | 1            | Auto                 | valid   | invalid          | invalid           | 400            | Company not found.    |
            | TC_DB003_4 | testgetbom@gmail.com | 1            | Auto                 | valid   |                  |                   | 500            | Internal Server Error |

    @TC_DB004
    Scenario Outline: TC_DB004 - Verify <userA> can't call this API to delete bom not belongs to her company
        Given User picks company which has onboarded before with type CSV in above response
        But User sets valid cookie of <userB> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: 10
        And User sends a GET request to get list items
        And User sets GET api endpoint to get bom keys
        And User sends a GET request to get all boms
        And User checks Auto bom exist in the system, if it does not exist will create new bom
        And User sends a GET request to get total of boms
        And User filters <numberOfBoms> boms which has the parentName includes <bomParentNameKeyword>
        And User has valid connect.sid of "<userA>" after send a POST request with payload as email: "<userA>" and password: "<password>"
        And User sets valid cookie of "<userA>" and valid companyKey and valid companyType in the header
        When User sends a DELETE method to delete bom child
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | numberOfBoms | bomParentNameKeyword | userA               | userB                | password  | expectedStatus | expectedStatusText |
            | 1            | Auto                 | may27user@gmail.com | testgetbom@gmail.com | Test1111# | 400            | Company not found. |

    @TC_DB005 @TC_DB006
    Scenario Outline: <TC_ID> - Verify <user> could call this API to delete bom and his child of a company has type <companyType> belongs to her
        Given User picks company which has onboarded before with type <companyType> in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers with limit row: <limitRow>
        And User sends a GET request to get list suppliers
        And user checks Auto supplier exist in the system, if it does not exist will create new supplier
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets POST api endpoint to create item
        And User sets request body with payload as name: "<itemName>" and description: "<description>" and vendorName: "<vendorName>" and vendorPrice: "<vendorPrice>" and moq: "<moq>" and leadTime: "<leadTime>" and orderInterval: "<orderInterval>" and serviceLevel: "<serviceLevel>" and onHand: "<onHand>" and onHandMin: "<onHandMin>" and onHandThirdParty: "<onHandThirdParty>" and onHandThirdPartyMin: "<onHandThirdPartyMin>" and lotMultipleQty: "<lotMultipleQty>" and lotMultipleItemName: "<lotMultipleItemName>" and asin: "" and fnsku: "" and skuNotes: "" and prepNotes: "" and supplierRebate: "" and inboundShippingCost: "" and reshippingCost: "" and repackagingMaterialCost: "" and repackingLaborCost: "" and rank: "" and inventorySourcePreference: "" and average7DayPrice: "" and isFbm: "" and key: "" and vendorKey: "<vendorKey>" and lotMultipleItemKey: "<lotMultipleItemKey>"
        And User sends a POST method to create item
        And User sets GET api endpoint to get bom keys
        And User sends a GET request to get all boms
        And User checks Auto bom exist in the system, if it does not exist will create new bom
        And User sets POST api endpoint to create bom
        And User sets request body with payload as parentName: "<parentName>" and parentKey: "<parentKey>" and childName: "<childName>" and childKey: "<childKey>" and qty: "<qty>"
        And User sends a POST method to create bom
        And User sends a GET request to get total of boms
        And User picks <quantity> random boms in above list boms
        When User sends a DELETE method to delete bom and his child
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User check that the deleted BOM and its child are not included in the current BOM list

        Examples:
            | TC_ID    | companyType | quantity | expectedStatus | expectedStatusText | email                | parentName | parentKey | childName | childKey | qty    | limitRow | itemName      | description     | vendorName | vendorPrice | moq    | leadTime | orderInterval | serviceLevel | onHand | onHandMin | onHandThirdParty | onHandThirdPartyMin | lotMultipleQty | lotMultipleItemName | vendorKey | lotMultipleItemKey |
            | TC_DB005 | CSV         | 1        | 200            | OK                 | testgetbom@gmail.com | 2          | random    | random    | random   | random | 10       | New Item Auto | New description | random     | random      | random | random   | random        | random       | random | random    | random           | random              | random         | random              | random    | random             |
            | TC_DB006 | ASC         | 1        | 200            | OK                 | testgetbom@gmail.com | 2          | random    | random    | random   | random | 10       | New Item Auto | New description | random     | random      | random | random   | random        | random       | random | random    | random           | random              | random         | random              | random    | random             |