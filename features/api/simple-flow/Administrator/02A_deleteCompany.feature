@test-api @api-admin @api-deleteCompany
Feature: API_Admin DELETE/company
    Background: Send GET request to get companies keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | subscriptionauto@gmail.com | Test1111# |
        And User sets GET api endpoint to get 20 companies has just created
        And In Header of the request, user sets param Cookie as valid connect.sid
        When User sends a GET request to get 20 latest companies

    @TC_DCP001 @regression-api @smoke-test-api
    Scenario Outline: TC_DCP001 - Verify <user> could call this API to hard delete a company
        Given Check <companyNameKeyWord> company exist in the system, if it does not exist will create company
        And User filters company to get company which has the company name included <companyNameKeyWord>
        And User sets DELETE api endpoint to delete company
        When User sends a DELETE method to <deleteType> delete the filtered company
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And Check that the company just deleted not exists in the current companies list

        Examples:
            | user  | companyNameKeyWord | deleteType | expectedStatus | expectedStatusText |
            | admin | AutoTest           | hard       | 200            | OK                 |

    #Bug API in case TC_DCP002_1, TC_DCP002_1
    @TC_DCP002 @bug-permission @low-bug-skip
    Scenario Outline: <TC_ID> - Verify error when user sends this API with <cookie> cookie
        Given Check <companyNameKeyWord> company exist in the system, if it does not exist will create company
        And User filters company to get company which has the company name included <companyNameKeyWord>
        And User sets DELETE api endpoint to delete company
        But User sets Cookie in HEADER as <cookie>
        When User sends a DELETE method to <deleteType> delete the filtered company
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | TC_ID       | companyNameKeyWord | deleteType | cookie  | expectedStatus | expectedStatusText |
            | TC_DCP002_1 | AutoTest           | hard       | empty   | 401            | Unauthorized       |
            | TC_DCP002_2 | AutoTest           | hard       | invalid | 401            | Unauthorized       |
            | TC_DCP002_1 | AutoTest           | soft       | empty   | 401            | Unauthorized       |
            | TC_DCP002_2 | AutoTest           | soft       | invalid | 401            | Unauthorized       |

    #Bug API in case TC_DCP003
    @TC_DCP003 @bug-permission @low-bug-skip
    Scenario Outline: TC_DCP003 - Verify <user> can't call this API to delete company
        Given Check <companyNameKeyWord> company exist in the system, if it does not exist will create company
        And User filters company to get company which has the company name included <companyNameKeyWord>
        And User has valid connect.sid of "<userA>" after send a POST request with payload as email: "<userA>" and password: "<password>"
        And User sets DELETE api endpoint to delete company
        And In Header of the request, user sets param Cookie as valid connect.sid
        When User sends a DELETE method to <deleteType> delete the filtered company
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | companyNameKeyWord | user | userA               | deleteType | password  | expectedStatus | expectedStatusText |
            | AutoTest           | user | may27user@gmail.com | hard       | Test1111# | 401            | Unauthorized       |
            | AutoTest           | user | may27user@gmail.com | soft       | Test1111# | 401            | Unauthorized       |

    @TC_DCP004 @regression-api @smoke-test-api
    Scenario Outline: TC_DCP004 - Verify <user> could call this API to soft delete a company with <companyType> comapny type
        Given Check <companyNameKeyWord> company exist in the system, if it does not exist will create company
        And User filters company to get company which has the company name included <companyNameKeyWord>
        And User sets valid cookie of <username> and valid companyKey and valid companyType in the header
        And User sets POST api endpoint to create item
        And User sets request body with payload as name: "<itemName>" and description: "<description>" and vendorName: "" and vendorPrice: "<vendorPrice>" and moq: "<moq>" and leadTime: "<leadTime>" and orderInterval: "<orderInterval>" and serviceLevel: "<serviceLevel>" and onHand: "<onHand>" and onHandMin: "<onHandMin>" and onHandThirdParty: "<onHandThirdParty>" and onHandThirdPartyMin: "<onHandThirdPartyMin>" and lotMultipleQty: "" and lotMultipleItemName: "" and asin: "" and fnsku: "" and skuNotes: "" and prepNotes: "" and supplierRebate: "" and inboundShippingCost: "" and reshippingCost: "" and repackagingMaterialCost: "" and repackingLaborCost: "" and rank: "" and inventorySourcePreference: "" and average7DayPrice: "" and isFbm: "" and key: "" and vendorKey: "" and lotMultipleItemKey: ""
        And User sends a POST method to create item
        And User sets DELETE api endpoint to delete company
        And User sends a DELETE method to <deleteType> delete the filtered company
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And Check that the company just soft deleted still exists but the subscription has been canceled
        And User sets valid cookie of <username> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item summary
        When User sends a GET request to get item summary
        Then User verify that has no item in item summary
        And User sets POST api endpoint to renew trial
        And User sends a POST method to renew trial

        Examples:
            | user  | username                   | companyNameKeyWord | companyType | deleteType | expectedStatus | expectedStatusText | itemName      | description     | vendorPrice | moq    | leadTime | orderInterval | serviceLevel | onHand | onHandMin | onHandThirdParty | onHandThirdPartyMin | lotMultipleQty | limitRow |
            | admin | subscriptionauto@gmail.com | soft-delete-auto   | CSV         | soft       | 200            | OK                 | New Item Auto | New description | random      | random | random   | random        | random       | random | random    | random           | random              | random         | 10       |